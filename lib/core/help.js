const { program } = require("commander");
const helpOptions = () => {
  //增加自己的options
  program.option("create ", "补充依赖");
  program.option("download ", "爬取网站");

  program.on("--help", function () {
    console.log("");
    console.log("other:");
    console.log(" other options~");
  });
};

module.exports = helpOptions;
