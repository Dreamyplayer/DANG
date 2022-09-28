/* eslint-disable no-irregular-whitespace */
const { magenta, italic, gray, blue, green } = require('colorette');
const { version, author } = require('../package.json');

const LogoMain = magenta(`
        ________ _______ _____   ___________
        ___  __ \\___    |___  | / /__  ____/
        __  / / /__  /| |__   |/ / _  / __
        _  /_/ / _  ___ |_  /|  /  / /_/ /
        /_____/  /_/  |_|/_/ |_/   \\\____/
              ${italic(gray(`v${version} - by ${author}`))}
\n`);

const Welcome_txt = `            🇼​​​​​ 🇪​​​​​ 🇱 ​​​​​🇨​ ​​​​🇴​​​​​ 🇲​​​​​ 🇪
                🇹​​​​​ 🇴
        🇩​​​​​ 🇮​​​​​ 🇸​​​​​ 🇨 ​​​​​🇴​​​​​ 🇷​​​​​ 🇩​​​​​  🇳​​​​​ 🇮​​​​​ 🇹 ​​​​​🇷​​​​​ 🇴
            🇬​​​​​ 🇪​​​​​ 🇳​​​​​ 🇪​​​​​ 🇷​​​​​ 🇦​​​​​ 🇹​​​​​ 🇴​ 🇷
              \n\n`;

const Credit_txt = `Made by ${green(`${author}`)} With ❤️\n\n`;
const Discord = `Need help? ${magenta('Join Our Discord')} \n${blue('https://discord.gg/CNAJfbs5dn\n\n')}`;

const Welcome = Welcome_txt + Credit_txt + Discord;
module.exports = { Welcome, LogoMain };
