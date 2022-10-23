import { bgBlue, cyan, green, red } from 'colorette';
import mkdir from 'mkdirp';
import ms from 'ms';
import { createWriteStream, existsSync, unlinkSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { generator } from '../config.js';
import { compactMode, getRandomInt, wait } from '../utils/funtions.js';
import { getRan } from '../utils/GenFunctions.js';

const { length, amount, outfile } = generator;

export const gen = (async (N = amount, o = outfile) => {
  const l = [];
  o && existsSync(o) && unlinkSync(o);
  const E = performance.now();
  wait(2000).then(() => {
    console.log(
      `${bgBlue('[Developing]')} ${green(compactMode({ date: N, formatType: 'Number' }))} codes of length ${red(
        length,
      )}.\n`,
    );
  });
  for (let i = 0; i < N; i++) {
    const codesToPush = getRan(getRandomInt());
    l.push(codesToPush);
  }

  const R = performance.now();
  if (o) {
    await mkdir(o.match(/.*(\/|\\)/g)[0]);
    const e = createWriteStream(o, { encoding: 'utf-8' });
    e.write(Array.from(new Set(l)).join('\n').toString());
    e.close();
  }
  return { start: E, end: R, codes: l };
})().then(e => {
  wait(6000).then(() => {
    console.info(
      `${bgBlue('[END]')} Coffee Break ${cyan(
        e.end - e.start <= 1000 ? (e.end - e.start).toString().split('.')[0] + 'ms' : ms(e.end - e.start),
      )} 🍵 - Developed ${green(compactMode({ date: e.codes.length, formatType: 'Number' }))} codes`,
    );
  });
});
console.clear();
console.log(`${bgBlue('[Establishing]')} Generation. . .\n`);
