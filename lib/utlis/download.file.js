// url 是图片地址
// filepath 是文件下载的本地目录
// name 是下载后的文件名
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = async function downloadFile(url, filepath, name) {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
  }
  const mypath = path.resolve(filepath, name);
  const writer = fs.createWriteStream(mypath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);
};
