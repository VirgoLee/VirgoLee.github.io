---
title: Git入门教程
tags:
  - Hexo
categories:
  - Hexo
abbrlink: 410e3cfa
date: 2018-12-22 22:00:00
---

本文主要记录了Git常用的一些命令，和Git基本使用教学，包括了版本库的创建、代码提交、推送、拉去、版本回回退、撤销等操作。

<!--more-->

> 更多文章欢迎访问我的个人博客-->[幻境云图](https://www.lixueduan.com/)

## 1. 简介

### 1.1 Git简介

Git(读音为/gɪt/。)是一个开源的分布式版本控制系统，可以有效、高速地处理从很小到非常大的项目版本管理。 [1]  Git 是 Linus Torvalds 为了帮助管理 Linux 内核开发而开发的一个开放源码的版本控制软件。

### 1.2 Git工作区概念

Git本地有四个工作区域：`工作目录（Working Directory`）、`暂存区(Stage/Index`)、`版本库(Repository或Commit History)`、`远程仓库(Remote Directory)`。文件在这四个区域之间的转换关系如下：



* **Working Directory**： 工作区，就是你平时存放项目代码的地方，大概就是一个文件夹。

* **Index / Stage**： 暂存区，用于临时存放你的改动，事实上它只是一个文件，保存即将提交到文件列表信息

* **Repository**： 仓库区（或版本库），就是安全存放数据的位置，这里面有你提交到所有版本的数据。其中HEAD指向最新放入仓库的版本

* **Remote**： 远程仓库，托管代码的服务器，可以简单的认为是你项目组中的一台电脑用于远程数据交换

#### 2、工作流程

git的工作流程一般是这样的：

１、在工作目录中添加、修改文件；

２、将需要进行版本管理的文件放入暂存区域；

３、将暂存区域的文件提交到git仓库。

因此，git管理的文件有三种状态：已修改（modified）,已暂存（staged）,已提交(committed)

####    3、文件的四种状态

版本控制就是对文件的版本控制，要对文件进行修改、提交等操作，首先要知道文件当前在什么状态，不然可能会提交了现在还不想提交的文件，或者要提交的文件没提交上。

GIT不关心文件两个版本之间的具体差别，而是关心文件的整体是否有改变，若文件被改变，在添加提交时就生成文件新版本的快照，而判断文件整体是否改变的方法就是用

SHA-1算法计算文件的校验和。

![img](https://img2018.cnblogs.com/blog/1090617/201810/1090617-20181008212040668-1339848607.png)

**Untracked:**   未跟踪, 此文件在文件夹中, 但并没有加入到git库, 不参与版本控制. 通过git add 状态变为Staged.

 **Unmodify:**   文件已经入库, 未修改, 即版本库中的文件快照内容与文件夹中完全一致. 这种类型的文件有两种去处, 如果它被修改, 而变为Modified.

​                   如果使用git rm移出版本库, 则成为Untracked文件

  **Modified:** 文件已修改, 仅仅是修改, 并没有进行其他的操作. 这个文件也有两个去处, 通过git add可进入暂存staged状态, 使用git checkout 则丢弃修改过,

​                返回到unmodify状态, 这个git checkout即从库中取出文件, 覆盖当前修改

​    **Staged:** 暂存状态. 执行git commit则将修改同步到库中, 这时库中的文件和本地文件又变为一致, 文件为Unmodify状态. 执行git reset HEAD filename取消暂存,

​               文件状态为Modified

 下面的图很好的解释了这四种状态的转变：

![img](https://img2018.cnblogs.com/blog/1090617/201810/1090617-20181008212245877-52530897.png)

新建文件--->Untracked

使用add命令将新建的文件加入到暂存区--->Staged

使用commit命令将暂存区的文件提交到本地仓库--->Unmodified

如果对Unmodified状态的文件进行修改---> modified

如果对Unmodified状态的文件进行remove操作--->Untracked

## 2. 使用

### 2.1 本地操作

使用之前首先要设置账号的。

```git
git config --global user.name  //git中你的用户名 在查看提交历史等地方用到 一般为真实姓名 xxx
git config --global user.email //你的邮箱 一般为公司邮箱xxx@xxx.com
```

查看Git配置信息

```git
git config --list
```

### 2.2 创建仓库

#### 本地初始化

```git
git init
```

用 git init 在目录中创建新的 Git 仓库。 你可以在任何时候、任何目录中这么做，完全是本地化的。执行后会在当前文件夹中多出一个`.git`文件夹，Git相关信息都在里面。

#### 远程拉取

当然，也可以在远程服务器上拉取代码，拷贝一个 Git 仓库到本地

```git
git clone [url]
例如
git clone git@github.com:illusorycloud/design-pattern.git   
```

### 2.3 代码提交

