const { Builder, By } = require("selenium-webdriver");
const fs = require("fs");

const { spliderUrl, bannerTimeout } = require("../static/constatnce");

//获取主页面并处理数据
async function getMainHtml() {
  let mainHtml = {
    icons: {},
    shoppClassifyInfo: [],
  };

  //1.使用驱动开启一个会话
  let driver = new Builder().forBrowser("chrome").build();
  //创建action交互构造器
  const actions = driver.actions({ async: true });
  await driver.get(spliderUrl);
  console.log(`${new Date()}   正在打开浏览器~`);

  //2.分析页面，处理数据
  console.log(`${new Date()}   开始分析主页面数据~`);
  //2.1获取顶部左上角图片信息
  let topLogoUrl = await driver
    .findElement(By.css(".hd-logo>img"))
    .getAttribute("src");

  mainHtml.icons.topLogoUrl = topLogoUrl;

  //2.2获取首页国家信息
  let countrys = await driver.findElements(By.css(".nav-country>ul>li>a"));
  let countryInfo = [];
  for (let i of countrys) {
    countryInfo.push(await i.getText());
  }
  mainHtml.icons.countryInfo = countryInfo;

  //2.3获取商品列表
  let firstClassify = await driver.findElements(By.css(".nav-classify-item")); //1级商品列表
  let shoppClassifyInfo = [];
  //2.3.1一级列表信息获取
  for (let i of firstClassify) {
    let firstClassifyInfo = {
      title: "",
      iconUrl: null,
      children: [],
    };
    firstClassifyInfo.title = await i
      .findElement(By.css(".nav-classify-title"))
      .getText();

    //2.3.2二级菜单信息获取
    let secClassify = await i.findElements(By.css(".nav-classify-list-item"));
    for (let j of secClassify) {
      let secClassifyInfo = {
        title: "",
        iconUrl: null,
      };
      secClassifyInfo.title = await j
        .findElement(By.css("span"))
        .getAttribute("innerText");
      secClassifyInfo.iconUrl = await j
        .findElement(By.css("img"))
        .getAttribute("data-image");
      firstClassifyInfo.children.push(secClassifyInfo);
    }
    shoppClassifyInfo.push(firstClassifyInfo);
  }
  mainHtml.shoppClassifyInfo = shoppClassifyInfo;

  //2.4获取轮播图图片
  //定位轮播图底部元素
  let bannerButton = await driver.findElements(By.css(".banner-tag>span"));
  let bannerUrl = [];
  //模拟用户点击，切换轮播图
  for (let i of bannerButton) {
    //定位获取轮播图地址
    await actions.move({ origin: i }).click().perform();
    await driver.sleep(bannerTimeout); //点击完等待bannerTimeout秒再执行
    let banner = await driver.findElements(By.css(".banner-cont>ul>li"));
    for (let j of banner) {
      if (await j.findElement(By.css("img")).isDisplayed()) {
        bannerUrl.push(await j.findElement(By.css("img")).getAttribute("src"));
      }
    }
  }
  mainHtml.bannerInfo = bannerUrl;

  //2.5专题精选
  let recommendInfo = {
    title: "",
    item: [],
  };
  let recommend = await driver.findElement(By.css(".home-recommend"));
  recommendInfo.title = await recommend
    .findElement(By.css(".title-wrap>h2"))
    .getText();

  let recommnedItem = await driver.findElements(By.css(".ztlist-item"));
  for (let i of recommnedItem) {
    recommendInfo.item.push({
      title: await i.findElement(By.css(".text")).getText(),
      imgUrl: await i.findElement(By.css("img")).getAttribute("src"),
    });
  }
  mainHtml.recommendInfo = recommendInfo;

  console.log(`${new Date()}   开始主页面数据分析完成~`);

  fs.writeFileSync("./public/mainHtml.json", JSON.stringify(mainHtml));
  await driver.quit();
}

module.exports = { getMainHtml };
