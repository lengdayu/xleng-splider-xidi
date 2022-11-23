const { getMainHtml } = require("./spilder.main");

const spilder = () => {
  //1.爬取并分析目标网站主页面
  getMainHtml();
};

module.exports = spilder;
