/* eslint-disable no-control-regex */
/* eslint-disable no-sequences */
'use strict';

const { Welcome, ProxyAgent, fetch, fs, mkdir, performance, chalk, LogoMain } = require('../utils/modules');
const { wait, duration, datetocompact, numberFormat } = require('../utils/functions');
const { interval, updateRate, proxy, proxiesType, proxiesfile, debug, codesfile, bURL, params } =
  require('../config.json').checker;
const { length, random } = require('../config.json').generator;

let wss;

const gen = require('./gen.js');

mkdir.sync(codesfile.match(/.*(\/|\\)/g)[0]);
if (!fs.existsSync(codesfile)) fs.writeFileSync(codesfile, '');
let codes = fs
  .readFileSync(codesfile, { encoding: 'utf-8' })
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

process.on('SIGINT', () => end(performance.now()));

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

function log(e) {
  pauseLog
    ? wait(pauseLog).then(() => {
        (pauseLog = 0), log(e);
      })
    : (console.log(e),
      wss &&
        clients.forEach(o => {
          o.send(JSON.stringify({ type: 'log', message: e.replace(/\[\d{1,2}m/g, '') }));
        }));
}

function dbug(o) {
  debug && log(`${chalk.yellow('[DBUG]')} ${o}`);
}

function formatCode(o) {
  return { code: o, c: !1, t: 1 / 0 };
}

async function actualizeCodes() {
  let e = codes
    .filter(e => !e.c || e.c === 'ongoing')
    .map(e => (Date.now() - e.t > 3e4 && ((e.c = !1), (e.t = 1 / 0)), e));
  dbug(`${chalk.yellow(codes.length - e.length)} codes purged.`);
  const o = codesMaxSize - e.length;
  if (o > 0) {
    const c = await gen(length, random, o);
    e.push(...c.codes.map(e => formatCode(e))), log(`${chalk.bgBlue('[ADDED]')} ${chalk.yellow(o)} more codes.`);
  }
  return e;
}

proxy &&
  setInterval(() => {
    const e = numberFormat(proxies.filter(e => e.working && e.readyAt <= Date.now()).length);
    const n = numberFormat(proxies.filter(e => e.working).length);
    const r = numberFormat(proxies.filter(e => !e.working).length);
    r <= 0
      ? log(
          `\n\n${chalk.bgGreen('Proxies')} \nUP: ${chalk.green(e)}\nALIVE: ${chalk.yellow(n)}\nDEAD: ${chalk.red(
            r,
          )}\n\n`,
        )
      : log(
          `\n\n${chalk.bgGreen('Proxies')} \nUP: ${chalk.green(e)}\nALIVE: ${chalk.yellow(n)}\nDEAD: ${chalk.red(
            r,
          )} ${chalk.bgRed('[purging]')}\n\n`,
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
    this.debug(chalk.yellow(`Checking ${code}...`));

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
        log(`${chalk.bgGreen('[HIT]')} ${chalk.cyan(`Check succeed, code: ${code}`)}.`);
        return {
          c: true,
          v: true,
        };
      } else {
        if (body.message === 'Unknown Gift Code') {
          this.debug(chalk.red(`Check failed (404)`));
          return {
            c: true,
            v: false,
          };
        } else if (body.message === 'You are being rate limited.') {
          let int = body.retry_after * 1000;
          this.debug(chalk.red(`Check missed (429), waiting ${numberFormat(int)}ms.`));
          this.used(5, int);
          return {
            c: false,
            v: null,
          };
        } else {
          this.debug(chalk.bgRedBright(`Unknow message (${body})`));
          return {
            c: null,
            v: null,
          };
        }
      }
    } catch (e) {
      this.debug(chalk.red(`Fetch missed (${e})`));
      if (!e.toString().toLowerCase().replace(/ +/g, '').includes('timedout')) this.working = false;
      return {
        c: false,
        v: null,
      };
    }
  }

  debug(str) {
    if (this.working) dbug(`${chalk.yellow(`{${this.id}}`)} ${str}`);
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
  fs.existsSync(proxiesfile) || (fs.closeSync(fs.openSync(proxiesfile, 'w')), grabProxies()),
  (proxies = fs
    .readFileSync(proxiesfile, { encoding: 'utf-8' })
    .split('\n')
    .filter(e => e)
    .map((e, o) => new Proxy(e, o))).push(localProxy));

async function grabProxies() {
  if (Date.now() - lastGrab < 10000) {
    dbug(chalk.red(`Codes actualization in cooldown, waiting ${duration(Date.now() - lastGrab, true, true)}.`));
    await wait(1000);
    return codes;
  }

  lastGrab = Date.now();
  await fetch(
    `https://api.proxyscrape.com/?request=displayproxies&proxytype=${proxiesType}&timeout=10000&country=all&anonymity=all&ssl=yes`,
  ).then(async res => {
    const body = await res.text();
    const lines = body.split('\n').filter(line => !proxies.find(p => p.proxy === line));
    log(`${chalk.bgBlue('[AUTO]')} grabbed ${chalk.yellow(lines.length)} proxies.`);
    for (let line of lines) {
      proxies.push(new Proxy(line, (proxies[proxies.length - 1]?.id || 0) + 1));
    }
  });
}

async function main() {
  const e = () =>
    proxy ? ((max - c) / (5 * proxies.filter(e => e.working).length)) * 6e4 : ((max - c).length / 5) * 6e4;
  console.info(
    `${chalk.bgGreen('[Launching]')} ${chalk.yellow(max)} ${chalk.green('checks')}, ${chalk.red(
      'estimated time:',
    )} ${chalk.blue(duration(e(), !0, !0))} | ${chalk.blue(datetocompact(e() + Date.now()))}`,
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
        `${chalk.bgGreen('[ETL]')} ${chalk.green(`${duration(e(), !1, !0)}`)} Analyzed ${chalk.green(
          `${numberFormat(c)}`,
        )}/${chalk.yellow(`${numberFormat(max)}`)} [${chalk.green(valids.length)}] - continuing ${chalk.cyan(
          numberFormat(max - c),
        )} codes`,
      ),
      (t = c)),
      await wait(pause ? pauseMs : interval);
  }
  end(performance.now());
}

async function tryCode() {
  let r = codes.find(r => !r.c);
  if (!r) return;
  (r.c = 'ongoing'), (r.t = Date.now());
  let e = r.code.match(/[0-z]+/g);
  if (!e) return;
  let t = e[e.length - 1];
  let a = `${bURL}${t}${params}`;
  (!proxies.length || proxies.filter(r => r.working).length < 30) && (await grabProxies());
  const o = proxies.sort((r, e) => r.uses - e.uses).filter(r => r.working && r.ready)[0];
  if (proxy && !o) {
    let r = proxies.sort((r, e) => r.readyAt - e.readyAt).filter(r => r.working)[0];
    return (
      dbug(chalk.red(`No more proxy available | Next ready in ${duration(r.readyAt - Date.now(), !0, !0)}.`)),
      grabProxies(),
      r.readyAt
    );
  }
  if (!proxy && !localProxy.ready)
    return (
      dbug(chalk.red(`Rate-limited | Ready in ${duration(localProxy.readyAt - Date.now(), !0, !0)}.`)),
      localProxy.readyAt
    );
  const i = proxy ? await o.check(a, t) : await localProxy.check(a, t);
  return (r.c = i.c), (r.t = 1 / 0), i.c && c++, i.v && valids.push(t), !0;
}

function end(e) {
  (pauseMs = 6e4), (pause = !0), (pauseLog = 6e4);
  let i = '';
  let n = codesfile.match(/.*(\/|\\)/g)[0] + 'valids.txt';
  mkdir.sync(n.match(/.*(\/|\\)/g)[0]),
    fs.existsSync(n) && ((i = fs.readFileSync(n, { encoding: 'utf-8' })), fs.unlinkSync(n));
  let s = fs.createWriteStream(n, { encoding: 'utf-8' });
  s.write(i + valids.join('\n')),
    s.close(),
    mkdir.sync(codesfile.match(/.*(\/|\\)/g)[0]),
    fs.existsSync(codesfile) && fs.unlinkSync(codesfile),
    (s = fs.createWriteStream(codesfile, { encoding: 'utf-8' })).write(''),
    s.close(),
    mkdir.sync(proxiesfile.match(/.*(\/|\\)/g)[0]),
    fs.existsSync() && fs.unlinkSync(proxiesfile),
    (s = fs.createWriteStream(proxiesfile, { encoding: 'utf-8' })).write(
      proxies
        .filter(e => e.working)
        .map(e => e.proxy)
        .join('\n'),
    ),
    s.close(),
    wait(2e3).then(() => {
      console.info(
        `\n\n${chalk.bgBlue('[END]')} Coffee Break ${chalk.blue(
          duration(e - start, !0, !0),
        )} 🍵 - Checked ${chalk.green(`${numberFormat(c)}`)} ⚡ - Valid ${chalk.green(
          numberFormat(valids.length),
        )} ✔️ `,
      );
    }),
    wait(4e3).then(() => process.exit());
}

const start = performance.now();
wait(1e4).then(() => {
  main();
});
