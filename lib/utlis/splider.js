const { getMainHtml } = require("./spilder.main");
const { getCommodity } = require("./spilder.commodity");

const spilder = async () => {
  //1.爬取并分析目标网站主页面
  const shoppClassifyInfo = await getMainHtml();
  //2.爬取所有商品页面
  await getCommodity(shoppClassifyInfo);
};

module.exports = spilder;
