---
title: Java设计模式(十三)--组合模式
tags:
  - 设计模式
categories:
  - 设计模式
abbrlink: a340063f
date: 2018-10-08 22:00:00
---

本文主要介绍了Java23种设计模式中的 模式，并结合实例描述了 模式的具体实现和性能分析测试。

<!--more-->

> 更多文章欢迎访问我的个人博客-->[幻境云图](https://www.lixueduan.com/)

## 1. 组合模式介绍

**组合模式：将对象组合成树形结构以表示”部分-整体”的层次结构。组合模式使得用户对单个对象和组合对象的使用具有一致性**。 

> **所谓组合模式，其实说的是对象包含对象的问题，通过组合的方式（在对象内部引用对象）来进行布局**
>
> 以Windows文件系统为例，文件夹下可能有文件，也可能还有一个文件夹。
> 文件夹可以包含文件和文件夹，但文件却没有这些功能。所以实现的时候需要单独实现。
> 如果用组合模式的话，将文件和文件夹看成一个整体。都是文件。当做抽象的文件。

## 2. 组合模式实现

```java
//抽象文件类 
public abstract class AbstractFiles {
  public abstract void add(AbstractFiles af);
  public abstract void remove(AbstractFiles af);
  public abstract AbstractFiles get(int  i);
  public abstract void killVirus();
}
//具体文件类型 图片文件 没有的方法就不实现 叶子节点
public class ImageFile extends AbstractFiles {
	private String name;
	public ImageFile(String name) {
		this.name=name;
	}
	@Override
	public void add(AbstractFiles af) {
			System.out.println("不支持该方法");
	}
	@Override
	public void remove(AbstractFiles af) {
		System.out.println("不支持该方法");
	}
	@Override
	public AbstractFiles get(int i) {
		System.out.println("不支持该方法");
		return null;
	}
	@Override
	public void killVirus() {
		System.out.println("开始进行--"+name+"--文件杀毒");
	}
}
//文件夹类型的文件 实现所有方法 树枝节点
public class Folder extends AbstractFiles {
	//文件夹类，所有的都可以用
	private ArrayList<AbstractFiles> list = new ArrayList<AbstractFiles>();
	private String name;
	public Folder(String name) {
		this.name=name;
	}
	@Override
	public void add(AbstractFiles af) {
		list.add(af);
		System.out.println("添加成功");
	}
	@Override
	public void remove(AbstractFiles af) {
		// TODO Auto-generated method stub
		if(list.remove(af)) {
			System.out.println("删除成功");
		}else{
			System.out.println("删除失败");
		}	
	}
	@Override
	public AbstractFiles get(int i) {
		return list.get(i);
	}
	@Override
	public void killVirus() {
		// TODO Auto-generated method stub
		System.out.println("对文件夹"+name+"进行杀毒");
		//递归调用
		for(Object o:list) {
		((AbstractFiles)o).killVirus();
		}
	}
}
//测试代码
public class Client {
	public static void main(String[] args) {
		//创建一个文件类型
		AbstractFiles f1 = new Folder("主文件夹");
		//创建文件
		AbstractFiles file1= new ImageFile("孙悟空。png");
		AbstractFiles file2= new ImageFile("龙珠.jpg");
		AbstractFiles file3= new ImageFile("帅哥威.gif");
		f1.add(file1);
		f1.add(file2);
		f1.add(file3);
		f1.killVirus();
		file1.killVirus();
	}

```

## 参考

`https://blog.csdn.net/qq_40709468/article/details/81990084`