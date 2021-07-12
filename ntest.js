'use strict';

const { Welcome } = require('./utils/modules');

// implement function for chalk colours
// add more colours
// const clr = (str, clr) => {
//   const colours = {
//     black: '\x1b[30m',
//     red: '\x1b[31m',
//     green: '\x1b[32m',
//     yellow: '\x1b[33m',
//     blue: '\x1b[34m',
//     magenta: '\x1b[35m',
//     cyan: '\x1b[36m',
//     white: '\x1b[37m',
//     bgBlack: '\x1b[40m',
//     bgRed: '\x1b[41m',
//     bgGreen: '\x1b[42m',
//     bgYellow: '\x1b[43m',
//     bgBlue: '\x1b[44m',
//     bgMagenta: '\x1b[45m',
//     bgCyan: '\x1b[46m',
//     bgWhite: '\x1b[47m',
//     reset: '\x1b[0m',
//     bright: '\x1b[1m',
//     dim: '\x1b[2m',
//     underscore: '\x1b[4m',
//     blink: '\x1b[5m',
//     reverse: '\x1b[7m',
//     hidden: '\x1b[8m',
//   };

//   if (str.indexOf('\x1b') === -1) {
//     return colours[clr] + str + colours.reset;
//   } else {
//     return str;
//   }
// };

// console.log(clr, 'green');

// implement function to format number
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

console.log(formatNumber(10000));

console.log(Welcome);

// Implement a function to convert a string to ascii text art
// function ascii(str) {
//   const arr = [];
//   let i = 0;
//   let j = 0;
//   for (i = 0; i < str.length; i += 1) {
//     arr[i] = [];
//     for (j = 0; j < str.length; j += 1) {
//       if (str[i] === str[j]) {
//         arr[i].push('-');
//       } else {
//         arr[i].push(' ');
//       }
//     }
//   }
//   return arr.join('\n');
// }

// console.log(ascii('hello'));

// console.log();

// const clr = (e, m) => {
//   const n = {
//     black: '[30m',
//     red: '[31m',
//     green: '[32m',
//     yellow: '[33m',
//     blue: '[34m',
//     magenta: '[35m',
//     cyan: '[36m',
//     white: '[37m',
//     bgBlack: '[40m',
//     bgRed: '[41m',
//     bgGreen: '[42m',
//     bgYellow: '[43m',
//     bgBlue: '[44m',
//     bgMagenta: '[45m',
//     bgCyan: '[46m',
//     bgWhite: '[47m',
//     reset: '[0m',
//     bright: '[1m',
//     dim: '[2m',
//     underscore: '[4m',
//     blink: '[5m',
//     reverse: '[7m',
//     hidden: '[8m',
//   };
//   return e.indexOf('') === -1 ? n[m] + e + n.reset : e;
// };

// console.log(clr('hellosdsda', 'green'));

// console.log(
//   chalk.magenta(`
//         ________ _______ _____   ___________
//         ___  __ \\___    |___  | / /__  ____/
//         __  / / /__  /| |__   |/ / _  / __
//         _  /_/ / _  ___ |_  /|  /  / /_/ /
//         /_____/  /_/  |_|/_/ |_/   \\\____/
// `),
// );

const max = Number(process.argv?.[2]);

console.log(max);

let myMap = new Map();
myMap.set('foo', { name: 'baz', desc: 'inga' });

let nameBar = myMap.get('bar')?.name;

console.log(nameBar);
