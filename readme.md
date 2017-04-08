<!-- （一句话简介）使用 AngularJS 编写的仿简书的单页多人博客 -->

# BaiShu Blog(Suger)

## 前言

### 项目的起源

最近入门了 AngularJS 。一边跟着 Coursera 上的一个 NG 课程[学习基础](https://github.com/baishusama/coursera)，一边上着慕课网的 NG 课程实战演练，对 NG 有了初步的认识。为了更好的学习 NG ，也为了填填之前挖过的项目坑，我决定动手写一个多人博客。

### 项目的名字

在下的网名之一是“白薯”。“白薯的部落格”的简写，就是本站目前使用的名字——“薯格”。英文写作“Suger”，念做“Sugar”。（下文统一唤作 Suger 。）

> 对，我就一个喜好甜食的南方人。

### 项目的雏形

雏形一：一个仿百度新闻的 PHP 为主的传统。
雏形二：PHP 搭建自己的 MVC。
雏形三：一个使用 NG 仿拉勾的移动端 WebApp

> 没错，上面三个项目都坑了。

### 项目的意外

但是，在进一步参考各大网站（cnblogs、CSDN、掘金、SF、简书）后，随着需求的逐渐具体、开发的不断进行，慢慢地， Suger 越来越向简书靠拢了。

为了挽回局面，后期等 todolist 上的需求逐个实现之后，会不断添加新的需求。

> 不过，还是很喜欢简书的书写体验的【早知道一开始不如做个简书仿站 Orz

## 技术栈：

1. 前端：
    * Angular 实现 SPA
    * ui-router 实现前端路由
    * ngCookies 管理 cookie
    * LESS
2. 前端相关：
    * 前端模块管理：bower
    * node 模块管理：npm
    * 自动化构建：gulp
3. 非前端：
    * 后端：PHP
    * 数据库：MySQL

## 需求 & 进度

### 已经完成的 & 开发中的部分

* 登录模块
    - [x] 注册
    - [x] 激活
    - [x] 登录
    - [x] 登出
* 文章模块
    - 文集
        + [x] 新建
        + [ ] 修改文集名称
        + [ ] 丢弃
        + [ ] 删除
    - 文章
        + [x] 新建
        + [x] 修改 & 保存
        + [x] 图片上传
        + [x] 发布/取消发布
        + [x] 丢弃
        + [x] 恢复
        + [ ] 修改所属文集
        + [x] 删除（包括相关图片文件的删除）
* 文章页
    - [x] 文章的渲染（比较基本的 MD -> HTML）
    - [ ] 文章的渲染（代码块 MD -> HTML，特别是语言和高亮。。）
* 文章列表（@首页@个人主页）
    - [x] 链接到作者页和文章页
    - [ ] 日期的 filter
    - [ ] 加载更多
* [x] 页脚 & 站点信息页
* 区别开不同的状态
    - [x] 激活/未激活
    - [x] 登录/未登录

### 计划完成的部分 todo

* 登录模块
    - [ ] 验证码（含时效）
    - [ ] 邮箱激活的时效
* 用户模块
    - [ ] 个人信息的展示和修改（自定义头像、头像编辑、上传大小限制等）
    - [ ] 我的喜欢、我的收藏、我的成就等
* 文章模块
    - 文章
        + [ ] 查找
        + [ ] 图片上传的大小限制
        + [ ] 浏览量
    - [ ] 编辑器的实时预览
* 文章列表（@首页@个人主页）
    - [ ] header 下拉一定距离时半透明
* 搜索页
    - [ ] 搜索文章
    - [ ] 搜索作者
* 文章页
    - [ ] 评论系统
* ...
* 响应式
* webapp
* PWA
* php
    - RESTful 风格接口
    - MVC

## 文件结构

```
.
├─ build                      // 开发目录
├─ data                       // 用于存放其他数据
│  ├─ md                      // 用于存放静态的 markdown 文件数据
│  └─ sql                     // 用于存放快速建表用的和数据库存档的 sql 文件
├─ dist                       // 生产目录
├─ src                        // 源文件
│  ├─ api                     // PHP API
│  │  ├─ article              // 用于存放 article 表相关的 PHP 文件
│  │  ├─ book                 // 用于存放 book 表相关的 PHP 文件
│  │  ├─ config               // 用于存放通用的 PHP 文件
│  │  ├─ image                // 用于存放 image 表相关的 PHP 文件
│  │  └─ user                 // 用于存放 user 表相关的 PHP 文件
│  ├─ image                   // 图片存放目录
│  │  ├─ default              // 用于存放系统图片
│  │  └─ user                 // 用于存放用户上传的图片
│  ├─ script                  // JS 脚本
│  │  ├─ config               // 用于存放配置文件
│  │  │  └─ router.js         // 路由 js 文件
│  │  ├─ controller           // 用于存放 NG 控制器
│  │  ├─ directive            // 用于存放 NG 指令
│  │  ├─ service              // 用于存放 NG 服务
│  │  └─ app.js               // 应用的依赖、初始化、根 scope
│  ├─ style                   // LESS 样式表
│  ├─ view                    // HTML 文档
│  └─ index.html              // 项目入口 HTML 文件
├─ .git                       // git 仓库相关文件
├─ .gitignore                 // git 忽略配置文件
├─ .jshintrc                  // jshint 语法检查配置文件
├─ bower.json                 // bower 依赖配置文件
├─ gulpfile.js                // gulp 自动化构建配置文件
├─ package.json               // npm 依赖配置文件
└─ readme.md                  // 说明文档
```

## 已上线 SAE

[点我进入 Suger ～](baishu.applinzi.com/blog)
