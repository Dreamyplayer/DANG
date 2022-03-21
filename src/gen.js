/* eslint-disable no-sequences */
'use strict';

const {
  RAN_GEN_1,
  RAN_GEN_2,
  RAN_GEN_3,
  RAN_GEN_4,
  RAN_GEN_4_C,
  RAN_GEN_Direct,
  RAN_GEN_Direct_C,
  RAN_GEN_Shuff,
  RAN_GEN_TOP,
} = require('../utils/genfunctions');
const { numberFormat, duration, wait } = require('../utils/functions');
const { existsSync, unlinkSync, createWriteStream } = require('node:fs');
const {  mkdir, performance, chalk } = require('../utils/modules');
const { length, random, amount, outfile } = require('../config').generator;

(module.exports = (e = 16, _ = !1, N = 1, o) =>
  new Promise(async n => {
    const r = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789×';
    const t = r.length - 1;
    const l = [];
    o && existsSync(o) && unlinkSync(o);
    const E = performance.now();
    if (_) {
      require.main === module &&
        wait(2000).then(() => {
          console.log(
            `${chalk.bgBlue('[Developing]')} ${chalk.green(numberFormat(N))} codes of length ${chalk.red(e)}.\n`,
          );
        });

      for (let _ = 0; _ < N; _++) {
        let _ = '';
        if (e === 24) {
          let e = [
            RAN_GEN_1(24),
            RAN_GEN_2(24),
            RAN_GEN_3(24),
            RAN_GEN_4,
            RAN_GEN_Direct,
            RAN_GEN_TOP(24),
            RAN_GEN_Shuff(RAN_GEN_1(24)),
            RAN_GEN_Shuff(RAN_GEN_2(24)),
            RAN_GEN_Shuff(RAN_GEN_3(24)),
            RAN_GEN_Shuff(RAN_GEN_TOP(24)),
          ];
          _ = e[Math.floor(Math.random() * e.length)];
        } else {
          let e = [
            RAN_GEN_1(16),
            RAN_GEN_2(16),
            RAN_GEN_3(16),
            RAN_GEN_4_C,
            RAN_GEN_Direct_C,
            RAN_GEN_TOP(16),
            RAN_GEN_Shuff(RAN_GEN_1(16)),
            RAN_GEN_Shuff(RAN_GEN_2(16)),
            RAN_GEN_Shuff(RAN_GEN_3(16)),
            RAN_GEN_Shuff(RAN_GEN_TOP(16)),
          ];
          _ = e[Math.floor(Math.random() * e.length)];
        }
        l.push(_);
      }
    } else {
      const o = _ ? r.length ** e : N;
      require.main === module &&
        wait(4000).then(() => {
          console.log(
            `${chalk.bgBlue('[Developing]')} ${chalk.green(numberFormat(o))} codes of length ${chalk.red(e)}.\n`,
          );
        });

      let n = Array(e).fill(0);
      for (; l.length < o; ) {
        let _ = '';
        for (let N = 0; N < e; N++) _ += r[n[N]];
        l.push(_);
        let N = !1;
        for (let _ = 0; _ < e; _++) {
          if (n[_] < t) {
            n[_]++, (N = !0);
            for (let e = 0; e < _; e++) n[e] = 0;
            break;
          }
          n[_];
        }
        if (!N) break;
      }
    }
    const R = performance.now();
    if (o) {
      await mkdir(o.match(/.*(\/|\\)/g)[0]);
      const e = createWriteStream(o, { encoding: 'utf-8' });
      e.write(l.join('\n')), e.close();
    }
    n({ start: E, end: R, codes: l });
  })),
  require.main === module &&
    (console.log(`${chalk.bgBlue('[Establishing]')} Generation. . .\n`),
    module.exports(length, random, amount, outfile).then(e => {
      wait(6000).then(() => {
        console.info(
          `${chalk.bgBlue('[END]')} Coffee Break ${chalk.cyan(
            duration(e.end - e.start, !0, !0),
          )} 🍵 - Developed ${chalk.green(numberFormat(e.codes.length))} codes`,
        );
      });
    }));
