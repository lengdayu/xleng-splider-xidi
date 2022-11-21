const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);
const spilder = require("../utlis/splider");

const createAction = async () => {
  const { error, stdout, stderr } = await exec("npm install -D");
  //传给回调的 stdout 和 stderr 参数将包含子进程的标准输出和标准错误的输出
  if (error) {
    console.error(`exec error: ${error}`);
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
};

const spliderAction = () => {
  spilder();
};

module.exports = { createAction, spliderAction };
