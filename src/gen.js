/* eslint-disable no-sequences */
const mkdir = require('mkdirp');
const { performance } = require('node:perf_hooks');
const { green, bgBlue, red, cyan } = require('colorette');
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
const ms = require('ms');
const { compactMode, wait } = require('../utils/functions');
const { existsSync, unlinkSync, createWriteStream } = require('node:fs');
const { length, random, amount, outfile } = require('../config').generator;

(module.exports = (codesLength = 16, _ = !1, N = 1, o) =>
  new Promise(async n => {
    const l = [];
    o && existsSync(o) && unlinkSync(o);
    const E = performance.now();
    require.main === module &&
      wait(2000).then(() => {
        console.log(
          `${bgBlue('[Developing]')} ${green(compactMode({ date: N, formatType: 'Number' }))} codes of length ${red(
            codesLength,
          )}.\n`,
        );
      });

    for (let _ = 0; _ < N; _++) {
      let _ = '';
      let e = [
        RAN_GEN_1(codesLength),
        RAN_GEN_2(codesLength),
        RAN_GEN_3(codesLength),
        RAN_GEN_4,
        RAN_GEN_4_C,
        RAN_GEN_Direct,
        RAN_GEN_Direct_C,
        RAN_GEN_TOP(codesLength),
        RAN_GEN_Shuff(RAN_GEN_1(codesLength)),
        RAN_GEN_Shuff(RAN_GEN_2(codesLength)),
        RAN_GEN_Shuff(RAN_GEN_3(codesLength)),
        RAN_GEN_Shuff(RAN_GEN_TOP(codesLength)),
      ];
      _ = e[Math.floor(Math.random() * e.length)];

      l.push(_);
    }

    const R = performance.now();
    if (o) {
      await mkdir(o.match(/.*(\/|\\)/g)[0]);
      const e = createWriteStream(o, { encoding: 'utf-8' });
      e.write(Array.from(new Set(l)).join('\n').toString()), e.close();
    }
    n({ start: E, end: R, codes: l });
  })),
  require.main === module &&
    (console.clear(), console.log(`${bgBlue('[Establishing]')} Generation. . .\n`),
    module.exports(length, random, amount, outfile).then(e => {
      wait(6000).then(() => {
        console.info(
          `${bgBlue('[END]')} Coffee Break ${cyan(
            e.end - e.start <= 1000 ? (e.end - e.start).toString().split('.')[0] + 'ms' : ms(e.end - e.start),
          )} 🍵 - Developed ${green(compactMode({ date: e.codes.length, formatType: 'Number' }))} codes`,
        );
      });
    }));
