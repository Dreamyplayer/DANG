import { generator } from '../config.js';

const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789×';
const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '1234567890';
const special = '`~!@#$%^&*()-=_+[]{}|;\':",./<>?';
const hex = '123456789ABCDEF';

const random = () => {
  if (typeof this?.crypto?.getRandomValues === 'function' && typeof this?.Uint32Array === 'function') {
    return this.crypto.getRandomValues(new this.Uint32Array(1))[0] / 4294967295;
  }

  return Math.random();
};

const keyGen = (
  length,
  useLowerCase = true,
  useUpperCase = true,
  useNumbers = true,
  useSpecial = true,
  useHex = false,
) => {
  let chars = '';
  let key = '';

  if (useLowerCase) chars += lowerCase;
  if (useUpperCase) chars += upperCase;
  if (useNumbers) chars += numbers;
  if (useSpecial) chars += special;
  if (useHex) chars += hex;

  for (let i = 0; i < length; i++) {
    key += chars[Math.floor(random() * chars.length)];
  }

  return key;
};

export const getRan = (key, length = generator.length, str = '') => {
  switch (key) {
    case 1:
      for (let i = 0; i < length; i++) str += possible.charAt(Math.floor(Math.random() * possible.length));
      return str;
    case 2:
      for (; length--; )
        str += String.fromCharCode(((str = (62 * Math.random()) | 0), (str += str > 9 ? (str < 36 ? 55 : 61) : 48)));
      return str;
    case 3:
      for (let i = 0; i < length; i++) {
        let r = Math.floor(62 * Math.random());
        let num = (r += r > 9 ? (r < 36 ? 55 : 61) : 48);
        str += String.fromCharCode(num);
      }
      return str;
    case 4:
      return [...Array(length)].map(() => possible[~~(Math.random() * possible.length)]).join('');
    case 5:
      return new Array(length).join().replace(/(.|$)/g, function () {
        return ((36 * Math.random()) | 0).toString(36)[Math.random() < 0.5 ? 'toString' : 'toUpperCase']();
      });
    case 6:
      return keyGen(length, true, true, true, false, false);
    case 7:
      return keyGen(length, true, true, true, true, false);
    case 8:
      return keyGen(length, true, true, true, true, false);
    case 9:
      return keyGen(length, true, true, true, false, false);
    case 10:
      return keyGen(length, true, true, true, true, false);
    case 11:
      return keyGen(length, true, true, true, true, false);
    case 12:
      return keyGen(length, false, false, false, false, true);
    case 13:
      return keyGen(length, false, false, false, false, true);
    case 14:
      return keyGen(length, false, false, false, false, true);
    case 15:
      return keyGen(length, false, false, false, false, true);
    default:
      throw Error(`No such key "${key}"`);
  }
};
