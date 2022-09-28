/* eslint-disable no-irregular-whitespace */
const mkdir = require('mkdirp');
const ProxyAgent = require('proxy-agent');
const chalk = require('chalk');
const { performance } = require('node:perf_hooks');
const { version, author } = require('../package.json');

const LogoMain = chalk.magenta(`
        ________ _______ _____   ___________
        ___  __ \\___    |___  | / /__  ____/
        __  / / /__  /| |__   |/ / _  / __
        _  /_/ / _  ___ |_  /|  /  / /_/ /
        /_____/  /_/  |_|/_/ |_/   \\\____/
              ${chalk.italic.gray(`v${version} - by ${author}`)}
\n`);

const Welcome_txt = `            🇼​​​​​ 🇪​​​​​ 🇱 ​​​​​🇨​ ​​​​🇴​​​​​ 🇲​​​​​ 🇪
                🇹​​​​​ 🇴
        🇩​​​​​ 🇮​​​​​ 🇸​​​​​ 🇨 ​​​​​🇴​​​​​ 🇷​​​​​ 🇩​​​​​  🇳​​​​​ 🇮​​​​​ 🇹 ​​​​​🇷​​​​​ 🇴
            🇬​​​​​ 🇪​​​​​ 🇳​​​​​ 🇪​​​​​ 🇷​​​​​ 🇦​​​​​ 🇹​​​​​ 🇴​ 🇷
              \n\n`;

const Credit_txt = `Made by ${chalk.green(`${author}`)} With ❤️\n\n`;
const Discord = `Need help? ${chalk.magenta('Join Our Discord')} \n${chalk.blue('https://discord.gg/CNAJfbs5dn\n\n')}`;

const Welcome = Welcome_txt + Credit_txt + Discord;
console.log(LogoMain + Welcome);
module.exports = { mkdir, ProxyAgent, chalk, performance, Welcome, LogoMain };
