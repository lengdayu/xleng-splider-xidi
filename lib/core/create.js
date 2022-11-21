const { program } = require("commander");
const { createAction } = require("./action");
const createCommands = () => {
  program
    .command("create <project> [others...]")
    .description("创建项目")
    .action((project, others) => {
      createAction();
    });
};

module.exports = createCommands;
