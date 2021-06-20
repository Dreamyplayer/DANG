const fetch = require('node-fetch');
const chalk = require('chalk');
const { Webhook } = require('discord-webhook-node');

function makeid(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789×';

  for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

const clutter = v => [...v].sort(_ => Math.random() - 0.5).join('');

let E = [
  '🥳',
  '⚡',
  '🔨',
  '💘',
  '🚀',
  '🔥',
  '🎉',
  '🍰',
  '🎃',
  '🍔',
  '🍺',
  '🍼',
  '🌹',
  '🧐',
  '🤪',
  '🌀',
  '🌁',
  '😋',
  '😌',
  '😍',
  '😎',
  '😏',
  '🌈',
  '🌊',
  '🌛',
  '🌝',
  '🌞',
  '🌟',
  '🌠',
  '🌡️',
  '🌤️',
  '🌩️',
  '🌪️',
  '🌬️',
  '🌭',
  '🌮',
  '🌯',
  '🍑',
  '🌰',
];

module.exports = { fetch, chalk, makeid, clutter, E, Webhook };
