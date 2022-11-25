# 目录结构

- lib // "xleng 脚手架文件"
  - core // "xleng 脚手架核心代码"
    - action // 具体的指令操作
    - create // 项目创建指令
    - help // 帮助指令
    - splider // 爬虫指令
  - utils // "爬虫方法"

# commander

文档：https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md#commanderjs

- 主文件入口配置 shebang
  - #!/usr/bin/env node
  - package.json 配置 `"bin" ：{ "xleng": "main.js" }`

# 创建实例

- npm i xleng -D

- npm i -D

- npm link(外层目录下执行)

- xleng create (创建容器文件夹)

- xleng download （获取网站数据）
