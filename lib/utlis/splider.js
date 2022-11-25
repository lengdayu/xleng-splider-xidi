const { getMainHtml } = require("./spilder.main");
const { getCommodity } = require("./spilder.country");

const spilder = async () => {
  //1.爬取并分析目标网站主页面
  // await getMainHtml();
  //2.爬取所有商品页面
  await getCommodity();
};

module.exports = spilder;
