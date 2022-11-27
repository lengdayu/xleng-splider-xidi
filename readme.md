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

- [下载 chrome 浏览器驱动]("https://chromedriver.chromium.org/downloads"),选择对应版本

- 将驱动所在位置添加到系统环境变量中

- npm i xleng-splider-xidi -g

- npm i selenium-webdriver axios commander -g

- xleng create (创建容器文件夹)

- xleng download （获取网站数据）
