plm 微信源码

> for webchat

## 构建step

1. `npm install`
2. `npm run dev`
3. `npm run build`


## 项目介绍

使用vue-cli构建的简单vue项目

微信项目，用户绑定、解绑，任务列表、项目列表，查询、扫码

关键技术: vue、webpack、axios

vue: 组件、数据双向绑定、通信、mixin、指令

webpack: 多入口

## 要点

### 依赖安装

1. babel-plugin-import

`antd` 的按需加载

2. webpack-cli

webpack命令，从webpack中剥离出来(webpack version > 4)

3. babel-preset-env

es6 -> es5

4. babel-preset-react

运行react的babel必须插件

5. css-loader、style-loader

要使用 cssModule ，就需要引入css-loader，因为用到了antd，所以要用到 cssModule