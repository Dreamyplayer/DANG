/* eslint-disable no-control-regex */
/* eslint-disable no-sequences */

import { bgBlue, bgGreen, bgRed, blue, cyan, green, red, yellow } from 'colorette';
import fetch from 'cross-fetch';
import mkdir from 'mkdirp';
import ms from 'ms';
import { closeSync, createWriteStream, existsSync, openSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { setTimeout } from 'node:timers';
import ProxyAgent from 'proxy-agent';
import { checker } from '../config.js';
import { LogoMain, Welcome } from '../utils/Entry.js';
import { compactMode, dbug, formatCode, wait } from '../utils/funtions.js';

const { interval, autoGrabProxies, updateRate, proxy, proxiesType, proxiesfile, codesfile, bURL, params } = checker;

let wss;

mkdir.sync(codesfile.match(/.*(\/|\\)/g)[0]);
if (!existsSync(codesfile)) writeFileSync(codesfile, '');
let codes = readFileSync(codesfile, { encoding: 'utf-8' })
  .split('\n')
  .filter(c => c)
  .map(c => formatCode(c));
const clients = [];
const codesMaxSize = 10000;
const valids = [];
let c = 0;
const max = Number(process.argv?.[2] || codes.length);
let pauseMs = interval;
let pause = false;
let pauseLog = 0;
let lastGrab = 0;

const log = e => {
  pauseLog
    ? wait(pauseLog).then(() => {
        (pauseLog = 0), log(e);
      })
    : (console.log(e),
      wss &&
        clients.forEach(o => {
          o.send(JSON.stringify({ type: 'log', message: e.replace(/\[\d{1,2}m/g, '') }));
        }));
};

process.on('SIGINT', () => end(performance.now()));

console.clear();
wait(1e3).then(() => {
  log(LogoMain);
});

wait(4e3).then(() => {
  log(Welcome);
});

if (wss)
  wss.on('connection', ws => {
    clients.push(ws);
    dbug(`New ws connection : ${ws.id}`);
    ws.on('disconnect', () => {
      clients.splice(clients.indexOf(ws), 1);
      dbug(`ws connection closed : ${ws.id}`);
    });
  });

wss &&
  setInterval(() => {
    dbug('Sockets actualization');
    const e = proxies.filter(e => e.working && e.readyAt <= Date.now()).length;
    const t = proxies.filter(e => e.working).length;
    const i = proxies.filter(e => !e.working).length;
    clients.forEach(s => {
      s.send(JSON.stringify({ type: 'codes', toCheck: max, checked: c, valids: valids.length })),
        s.send(JSON.stringify({ type: 'proxies', up: e, alive: t, dead: i }));
    });
  }, updateRate);

const actualizeCodes = async () => {
  let e = codes
    .filter(e => !e.c || e.c === 'ongoing')
    .map(e => (Date.now() - e.t > 3e4 && ((e.c = !1), (e.t = 1 / 0)), e));
  dbug(`${yellow(codes.length - e.length)} codes purged.`);
  return e;
};

proxy &&
  setInterval(() => {
    const e = compactMode({
      date: proxies.filter(e => e.working && e.readyAt <= Date.now()).length,
      formatType: 'Number',
    });
    const n = compactMode({ date: proxies.filter(e => e.working).length, formatType: 'Number' });
    const r = compactMode({ date: proxies.filter(e => !e.working).length, formatType: 'Number' });
    r <= 0
      ? log(`\n\n${bgGreen('Proxies')} \nUP: ${green(e)}\nALIVE: ${yellow(n)}\nDEAD: ${red(r)}\n\n`)
      : log(
          `\n\n${bgGreen('Proxies')} \nUP: ${green(e)}\nALIVE: ${yellow(n)}\nDEAD: ${red(r)} ${bgRed('[purging]')}\n\n`,
        ),
      (pauseLog = 2500),
      (proxies = proxies.filter(e => e.working));
  }, 1e4);

class Proxy {
  constructor(proxy, id) {
    if (proxy) {
      this.proxy = proxy;
      this.URI = `${proxiesType}://${this.proxy}`;
      this.id = id === undefined ? this.proxy.split('').reduce((acc, v) => acc + v.charCodeAt(0), 0) : id;
      this.ready = true;
      this.readyAt = Date.now();
      this.uses = 0;
      this.working = true;
    } else if (proxy == null) {
      this.proxy = null;
      this.id = id || -1;
      this.ready = true;
      this.readyAt = Date.now();
      this.uses = 0;
      this.working = true;
    }
  }

  async check(url, code) {
    if (!this.ready)
      return {
        c: null,
        v: null,
      };

    this.used(1);
    this.debug(yellow(`Checking ${code}`));

    try {
      const body = await (
        await fetch(
          url,
          this.proxy
            ? { agent: new ProxyAgent(this.URI), headers: { 'User-Agent': 'unknown' } }
            : { headers: { 'User-Agent': 'unknown' } },
        )
      ).json();

      if (body?.redeemed === false && new Date(body?.expires_at) > Date.now()) {
        log(`${bgGreen('[HIT]')} ${cyan(`Check succeed, code: ${code}`)}.`);
        return {
          c: true,
          v: true,
        };
      } else {
        if (body.message === 'Unknown Gift Code') {
          this.debug(red(`Check failed (404)`));
          return {
            c: true,
            v: false,
          };
        } else if (body.message === 'You are being rate limited.') {
          let int = body.retry_after * 1000;
          this.debug(red(`Check missed (429), waiting ${compactMode({ date: int, formatType: 'Number' })}ms.`));
          this.used(5, int);
          return {
            c: false,
            v: null,
          };
        } else {
          this.debug(bgRed(`Unknow message (${body})`));
          return {
            c: null,
            v: null,
          };
        }
      }
    } catch (e) {
      this.debug(red(`Fetch missed (${e})`));
      if (!e.toString().toLowerCase().replace(/ +/g, '').includes('timedout')) this.working = false;
      return {
        c: false,
        v: null,
      };
    }
  }

  debug(str) {
    if (this.working) dbug(`${yellow(`{${this.id}}`)} ${str}`);
  }

  used(n = 1, time = 60000) {
    this.uses += n;
    if (this.uses >= 5) {
      if (time > 60000) this.working = false;
      this.ready = false;
      this.readyAt = Date.now() + time;
      this.rateLimited(time);
    }
  }

  rateLimited(ms) {
    const p = this;
    setTimeout(() => {
      p.uses = 0;
      p.ready = true;
    }, ms);
  }
}

let proxies = [];
const localProxy = new Proxy(null);
proxy &&
  (mkdir.sync(proxiesfile.match(/.*(\/|\\)/g)[0]),
  existsSync(proxiesfile) || (closeSync(openSync(proxiesfile, 'w')), grabProxies()),
  (proxies = readFileSync(proxiesfile, { encoding: 'utf-8' })
    .split('\n')
    .filter(e => e)
    .map((e, o) => new Proxy(e, o))).push(localProxy));

const grabProxies = async () => {
  if (Date.now() - lastGrab < 10000) {
    dbug(red(`Codes actualization in cooldown, waiting ${ms(Date.now() - lastGrab)}.`));
    await wait(1000);
    return codes;
  }

  if (autoGrabProxies) {
    lastGrab = Date.now();
    await fetch(`https://api.proxyscrape.com/?request=displayproxies&status=alive&proxytype=${proxiesType}`).then(
      async res => {
        const body = await res.text();
        const lines = body.split('\n').filter(line => !proxies.find(p => p.proxy === line));
        log(`${bgBlue('[AUTO]')} grabbed ${yellow(lines.length)} proxies.`);
        for (let line of lines) {
          proxies.push(new Proxy(line, (proxies[proxies.length - 1]?.id || 0) + 1));
        }
      },
    );
  }
};

const main = async () => {
  const e = () =>
    proxy ? ((max - c) / (5 * proxies.filter(e => e.working).length)) * 6e4 : ((max - c).length / 5) * 6e4;
  console.info(
    `${bgGreen('[Launching]')} ${yellow(compactMode({ date: max, formatType: 'Number' }))} ${green('checks')}, ${red(
      'estimated time:',
    )} ${blue(ms(e()))} | ${blue(compactMode({ date: e() + Date.now(), formatType: 'Date' }))}`,
  );
  let a = 0;
  let t = c;
  for (; c < max; ) {
    if (
      (pause ||
        (!(
          c - a > Math.sqrt(codesMaxSize) || codes.filter(e => Date.now() - e.t > 3e4).length > Math.sqrt(codesMaxSize)
        ) &&
          codes.find(e => !e.c && e.c !== 'ongoing')) ||
        ((pauseMs = 1e3), (pause = !0), (codes = await actualizeCodes()), (a = c), (pause = !1), (pauseMs = interval)),
      proxy)
    )
      tryCode().then(e => {
        typeof e === 'number' &&
          ((pauseMs = e - Date.now()),
          (pause = !0),
          setTimeout(() => {
            pause = !1;
          }, e - Date.now()));
      });
    else {
      let e = await tryCode();
      typeof e === 'number' &&
        ((pauseMs = e - Date.now()),
        (pause = !0),
        setTimeout(() => {
          pause = !1;
        }, e - Date.now()));
    }
    t !== c &&
      (log(
        `${bgGreen('[ETL]')} ${green(`${ms(e())}`)} Analyzed ${green(
          `${compactMode({ date: c, formatType: 'Number' })}`,
        )}/${yellow(`${compactMode({ date: max, formatType: 'Number' })}`)} [${green(
          valids.length,
        )}] - continuing ${cyan(compactMode({ date: max - c, formatType: 'Number' }))} codes`,
      ),
      (t = c)),
      await wait(pause ? pauseMs : interval);
  }
  end(performance.now());
};

const tryCode = async () => {
  let r = codes.find(r => !r.c);
  if (!r) return;
  (r.c = 'ongoing'), (r.t = Date.now());
  let e = r.code;
  if (!e) return;
  let t = e[e.length - 1];
  let a = `${bURL}${t}${params}`;
  (!proxies.length || proxies.filter(r => r.working).length < 30) && (await grabProxies());
  const o = proxies.sort((r, e) => r.uses - e.uses).filter(r => r.working && r.ready)[0];
  if (proxy && !o) {
    let r = proxies.sort((r, e) => r.readyAt - e.readyAt).filter(r => r.working)[0];
    return (
      dbug(red(`No more proxy available | Next ready in ${ms(r.readyAt - Date.now())}.`)), grabProxies(), r.readyAt
    );
  }
  if (!proxy && !localProxy.ready)
    return dbug(red(`Rate-limited | Ready in ${ms(localProxy.readyAt - Date.now())}.`)), localProxy.readyAt;
  const i = proxy ? await o.check(a, t) : await localProxy.check(a, t);
  return (r.c = i.c), (r.t = 1 / 0), i.c && c++, i.v && valids.push(t), !0;
};

const end = e => {
  (pauseMs = 6e4), (pause = !0), (pauseLog = 6e4);
  let i = '';
  let n = codesfile.match(/.*(\/|\\)/g)[0] + 'valid_codes.txt';
  mkdir.sync(n.match(/.*(\/|\\)/g)[0]), existsSync(n) && ((i = readFileSync(n, { encoding: 'utf-8' })), unlinkSync(n));
  let s = createWriteStream(n, { encoding: 'utf-8' });
  s.write(i + valids.join('\n')),
    s.close(),
    mkdir.sync(codesfile.match(/.*(\/|\\)/g)[0]),
    existsSync(codesfile) && unlinkSync(codesfile),
    (s = createWriteStream(codesfile, { encoding: 'utf-8' })).write(''),
    s.close(),
    mkdir.sync(proxiesfile.match(/.*(\/|\\)/g)[0]),
    existsSync() && unlinkSync(proxiesfile),
    (s = createWriteStream(proxiesfile, { encoding: 'utf-8' })).write(
      proxies
        .filter(e => e.working)
        .map(e => e.proxy)
        .join('\n'),
    ),
    s.close(),
    wait(2e3).then(() => {
      console.info(
        `\n\n${bgBlue('[END]')} Coffee Break ${blue(ms(e - start))} 🍵 - Checked ${green(
          `${compactMode({ date: c, formatType: 'Number' })}`,
        )} ⚡ - Valid ${green(compactMode({ date: valids.length, formatType: 'Number' }))} ✔️ `,
      );
    }),
    wait(4e3).then(() => process.exit());
};

const start = performance.now();
wait(1e4).then(() => {
  main();
});
