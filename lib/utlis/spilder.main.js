const { Builder, By } = require("selenium-webdriver");
const fs = require("fs");

const { spliderUrl, bannerTimeout } = require("../static/constatnce");

//获取主页面并处理数据
async function getMainHtml() {
  return new Promise(async (resolve, reject) => {
    try {
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
      let firstClassify = await driver.findElements(
        By.css(".nav-classify-item")
      ); //1级商品列表
      let shoppClassifyInfo = [];
      //2.3.1一级列表信息获取
      for (let i of firstClassify) {
        let firstClassifyInfo = {
          title: "",
          children: [],
        };
        firstClassifyInfo.title = await i
          .findElement(By.css(".nav-classify-title"))
          .getText();

        //2.3.2二级菜单信息获取
        let secClassify = await i.findElements(
          By.css(".nav-classify-list-item")
        );
        for (let j of secClassify) {
          let secClassifyInfo = {
            title: "",
            url: "",
            iconUrl: null,
          };
          secClassifyInfo.title = (
            await j.findElement(By.css("span")).getAttribute("innerText")
          ).replace(/\//g, "-");
          secClassifyInfo.url = await j
            .findElement(By.css("a"))
            .getAttribute("href");
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
            bannerUrl.push(
              await j.findElement(By.css("img")).getAttribute("src")
            );
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

      //2.6海外尖货
      let topCommodity = await driver.findElement(By.css(".home-new"));
      //滚动到当前区域
      await driver.actions().scroll(0, 0, 0, 0, topCommodity).perform();
      let topCommodityInfo = {
        title: "",
        item: [],
      };
      topCommodityInfo.title = await topCommodity
        .findElement(By.css(".title-main"))
        .getText();
      //定位到所有子元素
      let topCommodityItems = await topCommodity.findElements(
        By.css(".homepro-item")
      );
      for (let i of topCommodityItems) {
        let itemInfo = {};
        itemInfo.title = await i
          .findElement(By.css(".title>span"))
          .getAttribute("innerText");
        itemInfo.imgUrl = await i
          .findElement(By.css(".pic>a>img"))
          .getAttribute("src");
        itemInfo.desc = await i
          .findElement(By.css(".pic>a>img"))
          .getAttribute("title");
        topCommodityInfo.item.push(itemInfo);
      }
      mainHtml.topCommodityInfo = topCommodityInfo;

      //2.7 16国特品
      let startIndex = 4;
      let endIndex = 10;
      let specialCommodityInfo = [];
      while (startIndex <= endIndex) {
        let specialCommodityItemInfo = {};
        //标题部分
        let specialCommodityItem = driver.findElement(
          By.xpath(`/html/body/div[2]/div[${startIndex}]`)
        );
        //滚动到当前区域
        await driver
          .actions()
          .scroll(0, 0, 0, 0, specialCommodityItem)
          .perform();
        specialCommodityItemInfo.mainTitle = await specialCommodityItem
          .findElement(By.css(".title-main"))
          .getText();
        specialCommodityItemInfo.assistTitle = await specialCommodityItem
          .findElement(By.css(".title-assist"))
          .getText();
        //大图部分
        specialCommodityItemInfo.BannerUrl = await specialCommodityItem
          .findElement(By.css(".home-module-banner-big>a>img"))
          .getAttribute("src");
        //商品列表
        specialCommodityItemInfo.items = [];
        let specialCommodityItemChildren =
          await specialCommodityItem.findElements(By.css(".homepro-item"));
        for (let i of specialCommodityItemChildren) {
          specialCommodityItemInfo.items.push({
            imgUrl: await i
              .findElement(By.css(".pic>a>img"))
              .getAttribute("src"),
            desc: await i
              .findElement(By.css(".pic>a>img"))
              .getAttribute("title"),
            title: await i.findElement(By.css(".title>span")).getText(),
            price: await i.findElement(By.css(".price>var")).getText(),
            country: await i.findElement(By.css(".flag>span")).getText(),
          });
        }
        specialCommodityInfo.push(specialCommodityItemInfo);
        startIndex++;
      }
      mainHtml.specialCommodityInfo = specialCommodityInfo;

      //2.8 大家都在说
      let talkCommodityInfo = {};
      let talkCommodity = await driver.findElement(By.css(".home-hot"));
      //滚动到当前区域
      await driver.actions().scroll(0, 0, 0, 0, talkCommodity).perform();
      talkCommodityInfo.title = await talkCommodity
        .findElement(By.css("div.title-wrap>h2"))
        .getText();
      //子元素部分
      talkCommodityInfo.item = [];
      let talkCommodityItems = await talkCommodity.findElements(
        By.css(".homehot-item")
      );
      for (let i of talkCommodityItems) {
        talkCommodityInfo.item.push({
          imgUrl: await i.findElement(By.css(".pic>img")).getAttribute("src"),
          price: await i
            .findElement(By.css(".j_proPrice"))
            .getAttribute("innerText"),
          title: await i.findElement(By.css(".title")).getAttribute("title"),
          comment: await i
            .findElement(By.css(".comment-cont"))
            .getAttribute("innerText"),
          commentDate: await i
            .findElement(By.css(".comment-date"))
            .getAttribute("innerText"),
        });
      }
      mainHtml.talkCommodityInfo = talkCommodityInfo;

      //2.9 热门厂店
      let factoryInfo = {};
      let factory = await driver.findElement(
        By.css("body>div.content.content-index>div:nth-child(12)")
      );
      //滚动到当前区域
      await driver.actions().scroll(0, 0, 0, 0, factory).perform();
      factoryInfo.title = await factory
        .findElement(By.css(".title-main"))
        .getText();
      //子元素部分
      factoryInfo.item = [];
      let factoryItems = await factory.findElements(By.css(".factory-item"));
      for (let i of factoryItems) {
        factoryInfo.item.push({
          imgUrl: await i.findElement(By.css("img")).getAttribute("src"),
        });
      }
      mainHtml.factoryInfo = factoryInfo;

      //2.10 国家信息及图标
      let countryIconsInfo = [];
      let countryIcon = await driver.findElement(By.css(".stroll-wrap"));
      //滚动到当前区域
      await driver.actions().scroll(0, 0, 0, 0, countryIcon).perform();
      let countryIconItems = await countryIcon.findElements(
        By.css(".stroll-item")
      );
      for (const i of countryIconItems) {
        countryIconsInfo.push({
          country: await i.findElement(By.css(".stroll-title")).getText(),
          countryIconNormalUrl: await i
            .findElement(By.css(".pic-normal>img"))
            .getAttribute("src"),
          countryIconHoverUrl: await i
            .findElement(By.css(".pic-hover>img"))
            .getAttribute("src"),
        });
      }
      mainHtml.countryIconsInfo = countryIconsInfo;

      console.log(`${new Date()}   开始主页面数据分析完成~`);
      //写入本地文件，带后续批量存入数据库
      fs.writeFileSync("./public/mainHtml.json", JSON.stringify(mainHtml));
      await driver.quit();
      resolve(null);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { getMainHtml };
