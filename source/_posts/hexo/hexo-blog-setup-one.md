---
title: Hexo个人博客之搭建（一）
date: 2018-12-20 22:00:00
tags: [Hexo]
categories: [Hexo]
---

> 这是一个基于Hexo的个人博客的教程，包含了从博客搭建到主题优化，最后部署到云端的全过程。
>
> [Hexo个人博客之搭建（一）](https://www.lixueduan.com/hexo/hexo-blog-setup-one/)
>
> [Hexo个人博客之优化（二）](https://www.lixueduan.com/hexo/hexo-blog-config-two/)
>
> [Hexo个人博客之部署（三）](https://www.lixueduan.com/hexo/hexo-blog-deploy-three/)
>
> [Hexo个人博客之转移（四）](https://www.lixueduan.com/hexo/hexo-blog-tranfer-four/)

## 1.环境准备

- Git  [Git下载地址](https://git-scm.com/downloads)
- Node.js  [Node.js下载地址](https://nodejs.org/en/)

小白式安装，一直下一步就ok了。

都安装好后就可以开始安装Hexo啦.

## 2.安装Hexo

- 1.新建一个文件夹,用于安装Hexo,以后这个就是放博客文件的.
- 2.在此文件夹右键,`Git Bash Here`,打开Git
- 3.安装Hexo  命令`npm install -g hexo`
- 4.初始化Hexo  命令`hexo init`
- 5.安装组件  命令`npm install`

到此为止,Hexo就算是安装完成了。

## 3.开启服务

- 1.`hexo generate`或者简写`hexo g`  编译,生成静态文件,就是生成一个个html文件.

- 2.开启服务`hexo server`或者`hexo s`   成功开启后就可以在本地访问了。 http://localhost:4000
  - 假如页面一直无法跳转，那么可能端口被占用了。此时我们ctrl+c停止服务器，`hexo server -p 端口号`来改变端口号  
  - 如`hexo server -p 5000`  将端口号换为`5000`,默认是`4000`
- 3.常用命令 
  - `hexo clean`  清除缓存文件  
  - `hexo deploy`或者`hexo d`  部署网站到云端,这个后面再讲。

## 参考

[Hexo官方文档](https://hexo.io/zh-cn/docs/)