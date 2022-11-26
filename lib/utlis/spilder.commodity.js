// 国家馆页面爬取
const { Builder, By } = require("selenium-webdriver");
const fs = require("fs");
const downloadFile = require("./download.file");
const myAsyncPoll = require("./asyncPool");
async function getCommodity(shoppClassifyInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      //1.使用驱动开启一个会话
      let driver = new Builder().forBrowser("chrome").build();

      //获取商品页面链接
      let shoppClassifyList = [];
      for (let i of shoppClassifyInfo) {
        i.children.map((item) => {
          shoppClassifyList.push(item);
        });
      }

      //遍历商品页面，存入本地数据
      for (let item of shoppClassifyList) {
        //当前页面名称
        const currentPage = item.title;
        //写入目标文件
        const writableFile = `./public/${currentPage}/${currentPage}.json`;
        //创建商品文件夹
        if (!fs.existsSync(`./public/${currentPage}`)) {
          fs.mkdirSync(`./public/${currentPage}`);
        }
        //1.遍历打开商品页面
        console.log(`${new Date()}  正在打开  ${currentPage}  商品页面~`);
        await driver.get(item.url);

        console.log(`${new Date()}  模拟用户滚动开始~`);
        //获取当前窗口高度
        let myScroll = function () {
          return document.body.scrollHeight;
        };
        // 初始化现在滚动条所在高度为0
        let height = 0;
        // 当前窗口总高度
        let currentWindowHeight = await driver.executeScript(myScroll);
        while (height < currentWindowHeight) {
          height += 500;
          await driver.executeScript(`window.scrollTo(0, ${height})`);
          await driver.sleep(200);
          currentWindowHeight = await driver.executeScript(myScroll);
          await driver.sleep(100);
        }
        console.log(`${new Date()}  模拟用户滚动结束~`);

        console.log(
          `${new Date()}  ${currentPage}  商品页面数据开始写入  ${writableFile}  文件~`
        );
        //定位商品列表
        let productsInfo = [];
        let productsList = await driver.findElements(By.css("li.prolist-item"));
        for (const i of productsList) {
          productsInfo.push({
            imgUrl: await i
              .findElement(By.css(".prolist-image-list>a>img"))
              .getAttribute("src"),
            title: await i
              .findElement(By.css(".prolist-title>a"))
              .getAttribute("innerHTML"),
            price: await i
              .findElement(By.css(".prolist-price>var"))
              .getAttribute("innerHTML"),
            country: await i
              .findElement(By.css(".prolist-flag>span"))
              .getAttribute("innerHTML"),
          });
        }
        const asyncPool = new myAsyncPoll();
        asyncPool.setMaxLimit(50); //设置最大同时并发任务量
        productsInfo.map(async (item) => {
          asyncPool.add(() => {
            return new Promise((resolve) => {
              downloadFile(
                item.imgUrl,
                `./public/${currentPage}`,
                `${item.title.replace(/\/|\\/g, "-")}.png`
              );
            });
          });
        });
        asyncPool.start();

        //写入本地文件，带后续批量存入数据库
        fs.writeFile(writableFile, JSON.stringify(productsInfo), (err) => {});

        console.log(
          `${new Date()}  ${currentPage}  商品页面数据结束写入  ${writableFile}  文件~`
        );
      }
      //关闭会话
      await driver.quit();
      resolve(null);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { getCommodity };
