const { program } = require("commander");
const { spliderAction } = require("./action");

const spliderOption = () => {
  program
    .command("download")
    .description("爬取xidi网站")
    .action((project, others) => {
      spliderAction();
    });
};
module.exports = spliderOption;
