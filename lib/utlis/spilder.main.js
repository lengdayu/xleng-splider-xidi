const { Builder, By, Key, until, Button } = require("selenium-webdriver");
const fs = require("fs");

const { spliderUrl } = require("../static/constatnce");

//获取主页面并处理数据
async function getMainHtml() {
  //1.获取主页面
  let broswer = new Builder().forBrowser("chrome").build();
  broswer.get(spliderUrl);
  console.log(`${new Date()}   正在打开浏览器~`);

  //2.分析页面，处理数据
  // console.log(`${new Date()}   开始分析主页面数据~`);
  // console.log(`${new Date()}   开始主页面数据分析完成~`);
}

module.exports = { getMainHtml };
