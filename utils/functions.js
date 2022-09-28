const { magenta, italic, gray, blue, green } = require('colorette');
const { version, author } = require('../package.json');

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

const compactMode = ({ date, formatType = 'Date' }) => {
  return formatType === 'Date'
    ? Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
    : Intl.NumberFormat('en').format(date);
};

const LogoMain = magenta(`
        ________ _______ _____   ___________
        ___  __ \\___    |___  | / /__  ____/
        __  / / /__  /| |__   |/ / _  / __
        _  /_/ / _  ___ |_  /|  /  / /_/ /
        /_____/  /_/  |_|/_/ |_/   \\\____/
              ${italic(gray(`v${version} - by ${author}`))}
\n`);

/* eslint-disable no-irregular-whitespace */
const Welcome_txt = `            🇼​​​​​ 🇪​​​​​ 🇱 ​​​​​🇨​ ​​​​🇴​​​​​ 🇲​​​​​ 🇪
                🇹​​​​​ 🇴
        🇩​​​​​ 🇮​​​​​ 🇸​​​​​ 🇨 ​​​​​🇴​​​​​ 🇷​​​​​ 🇩​​​​​  🇳​​​​​ 🇮​​​​​ 🇹 ​​​​​🇷​​​​​ 🇴
            🇬​​​​​ 🇪​​​​​ 🇳​​​​​ 🇪​​​​​ 🇷​​​​​ 🇦​​​​​ 🇹​​​​​ 🇴​ 🇷
              \n\n`;

const Credit_txt = `Made by ${green(`${author}`)} With ❤️\n\n`;
const Discord = `Need help? ${magenta('Join Our Discord')} \n${blue('https://discord.gg/CNAJfbs5dn\n\n')}`;

const Welcome = Welcome_txt + Credit_txt + Discord;

module.exports = {
  wait,
  compactMode,
  Welcome,
  LogoMain,
};
