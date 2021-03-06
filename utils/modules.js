/* eslint-disable no-irregular-whitespace */
'use strict';

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

const Welcome_txt = `            ๐ผโโโโโ ๐ชโโโโโ ๐ฑ โโโโโ๐จโ โโโโ๐ดโโโโโ ๐ฒโโโโโ ๐ช
                ๐นโโโโโ ๐ด
        ๐ฉโโโโโ ๐ฎโโโโโ ๐ธโโโโโ ๐จ โโโโโ๐ดโโโโโ ๐ทโโโโโ ๐ฉโโโโโ  ๐ณโโโโโ ๐ฎโโโโโ ๐น โโโโโ๐ทโโโโโ ๐ด
            ๐ฌโโโโโ ๐ชโโโโโ ๐ณโโโโโ ๐ชโโโโโ ๐ทโโโโโ ๐ฆโโโโโ ๐นโโโโโ ๐ดโ ๐ท
              \n\n`;

const Credit_txt = `Made by ${chalk.green(`${author}`)} With โค๏ธ\n\n`;
const Discord = `Need help? ${chalk.magenta('Join Our Discord')} \n${chalk.blue('https://discord.gg/CNAJfbs5dn\n\n')}`;

const Welcome = Welcome_txt + Credit_txt + Discord;
console.log(LogoMain + Welcome);
module.exports = { mkdir, ProxyAgent, chalk, performance, Welcome, LogoMain };
