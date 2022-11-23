const fs = require("fs");

const dirName = "./public";

//创建mian html容器文件
async function createDir() {
  //判断文件夹是否存在
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
}

module.exports = {
  createDir,
};
