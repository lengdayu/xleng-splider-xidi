//目标网站地址
const spliderUrl = "https://www.xidibuy.com";
const bannerTimeout = 1000; //点击轮播图等待时间
const pageWaitTime = 15000; //网页打开等待时间
const maxDownloadNUM = 20; //文件最大并发下载量
const outCountry = ["16国特品", "瑞士", "希腊", "巴西"]; //定义页面没有banner的国家页面

module.exports = {
  spliderUrl,
  bannerTimeout,
  pageWaitTime,
  maxDownloadNUM,
  outCountry,
};
