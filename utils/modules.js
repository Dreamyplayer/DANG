/* eslint-disable no-irregular-whitespace */
'use strict';

const fetch = require('node-fetch');
const mkdir = require('mkdirp');
const fs = require('fs');
const ProxyAgent = require('proxy-agent');
const chalk = require('chalk');
const { performance } = require('perf_hooks');

let LogoMain = chalk.magenta(`
        ________ _______ _____   ___________
        ___  __ \\___    |___  | / /__  ____/
        __  / / /__  /| |__   |/ / _  / __
        _  /_/ / _  ___ |_  /|  /  / /_/ /
        /_____/  /_/  |_|/_/ |_/   \\\____/
              ${chalk.italic.gray('v' + require('../package.json').version + '- by Dreamy')}
\n`);

let Welcome_txt = `            🇼​​​​​ 🇪​​​​​ 🇱 ​​​​​🇨​ ​​​​🇴​​​​​ 🇲​​​​​ 🇪
                🇹​​​​​ 🇴
        🇩​​​​​ 🇮​​​​​ 🇸​​​​​ 🇨 ​​​​​🇴​​​​​ 🇷​​​​​ 🇩​​​​​  🇳​​​​​ 🇮​​​​​ 🇹 ​​​​​🇷​​​​​ 🇴
          🇬​​​​​ 🇪​​​​​ 🇳​​​​​ 🇪​​​​​ 🇷​​​​​ 🇦​​​​​ 🇹​​​​​ 🇴​ 🇷
              \n\n`;

let Credit_txt = `Made by ${chalk.green('♔ Dяεαмү アlαүεя ♔')} With ❤️\n\n`;
let Discord = `Need help? ${chalk.magenta('Join Our Discord')} \n${chalk.blue('https://discord.gg/CNAJfbs5dn\n\n')}`;

let Welcome = Welcome_txt + Credit_txt + Discord;

module.exports = { fetch, mkdir, fs, ProxyAgent, chalk, performance, Welcome, LogoMain };
