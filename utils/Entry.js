import { blue, gray, green, italic, magenta } from 'colorette';
import { readFileSync } from 'node:fs';

const { author, version } = JSON.parse(readFileSync('./package.json'));

export const LogoMain = magenta(`
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

export const Welcome = Welcome_txt + Credit_txt + Discord;
