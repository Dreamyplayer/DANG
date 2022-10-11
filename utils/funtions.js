import { yellow } from 'colorette';
import { checker } from '../config.js';

export const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

export const compactMode = ({ date, formatType = 'Date' }) => {
  return formatType === 'Date'
    ? Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
    : Intl.NumberFormat('en').format(date);
};

export const getRandomInt = (min = 1, max = 15) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const formatCode = o => {
  return { code: o, c: !1, t: 1 / 0 };
};

export const dbug = o => {
  checker.debug && console.log(`${yellow('[DBUG]')} ${o}`);
};
