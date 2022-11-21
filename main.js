#!/usr/bin/env node
//配置环境执行当前文件
const { program } = require("commander");

const helpOptions = require("./lib/core/help");
const createCommands = require("./lib/core/create");
const spliderOption = require("./lib/core/spilder");

//查看版本号
program.version(require("./package.json").version);
console.log("喜地电商demo当前版本号" + program.version());

//增加帮助option指令
helpOptions();

//配置创建option指令
createCommands();

//配置爬虫option指令
spliderOption();

//解析 配置的program.option的指令
program.parse(process.argv);
