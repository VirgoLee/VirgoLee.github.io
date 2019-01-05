---
title: Java设计模式（）--模板方法模式
tags:
  - 设计模式
categories:
  - 设计模式
abbrlink: 57ae709c
date: 2018-10-24 22:00:00
---

本文主要介绍了Java23种设计模式中的模板方法模式，并结合实例描述了模板方法模式的具体实现和优缺点分析。

<!--more-->

> 设计模式系列文章
>
> [Java23种设计模式](https://www.lixueduan.com/categories/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/)

## 1. 模板方法模式介绍

**模板方法模式是类的行为模式。**

>  准备一个抽象类，将部分逻辑以具体方法以及具体构造函数的形式实现，然后声明一些抽象方法来迫使子类实现剩余的逻辑。不同的子类可以以不同的方式实现这些抽象方法，从而对剩余的逻辑有不同的实现。
>
>  这就是模板方法模式的用意。

![](https://github.com/illusorycloud/illusorycloud.github.io/raw/hexo/myImages/design_pattern/eleven-template.png)

　　**抽象模板(Abstract Template)角色有如下责任：**

* 定义了一个或多个抽象操作，以便让子类实现。这些抽象操作叫做基本操作，它们是一个顶级逻辑的组成步骤。

* 定义并实现了一个模板方法。这个模板方法一般是一个具体方法，它给出了一个顶级逻辑的骨架，而逻辑的组成步骤在相应的抽象操作中，推迟到子类实现。顶级逻辑也有可能调用一些具体方法。

　　**具体模板(Concrete Template)角色又如下责任：**

* 实现父类所定义的一个或多个抽象方法，它们是一个顶级逻辑的组成步骤。

* 每一个抽象模板角色都可以有任意多个具体模板角色与之对应，而每一个具体模板角色都可以给出这些抽象方法（也就是顶级逻辑的组成步骤）的不同实现，从而使得顶级逻辑的实现各不相同。

## 2. 模板方法模式实现

```java
假设炒菜有三个步骤，A下菜，B炒菜，C起锅。
那么可以写一个抽象类，因为所有的菜都可以看成这三个步骤。
然后炒菜和起锅这两个步骤也是一样的，当然炒菜可能也不一样╮(╯▽╰)╭。在抽象类中可以直接实现，然后下菜这个步骤应为是不同的菜所以不同。写成抽象类，等子类去实现。
//抽象类
public  abstract class Abstract Class {  
   //模板方法，用来控制炒菜的流程 （炒菜的流程是一样的-复用）
    //申明为final，不希望子类覆盖这个方法，防止更改流程的执行顺序
   public final void cookProcess(){
       this.MethodA();
       this.MethodB();
       this.MethodC();
    }

    //第一步：下菜是不一样的，由子类实现
   public abstract void  MethodA();
    //第二步：是一样的，所以直接实现
    public void MethodB(){
        System.out.println("炒啊炒啊炒~");
    }

    //步骤C 起锅
  public  void MethodC(){
        System.out.println("菜炒好了，起锅~");
    }
}
//具体实现类继承抽象类
//炒白菜
public class ConcreteClass_BaiCai extends test{

    @Override
   public void MethodA() {
        System.out.println("往锅里加的是白菜~");
    }
}
//炒肉
public class ConcreteClass_Meat extends test{

    @Override
  public  void MethodA() {
        System.out.println("往锅里加的是肉~");
    }
}
public class Template Method{
    public static void main(String[] args){

//炒 - 白菜
        ConcreteClass_BaoCai BaiCai = new ConcreteClass_BaoCai();
        BaiCai.cookProcess();
//炒 - 肉
        ConcreteClass_ Meat  meat= new ConcreteClass_Meat();
        meat.cookProcess();
    }
}
//输出
往锅里加的是白菜~
炒啊炒啊炒~
菜炒好了，起锅~
往锅里加的是肉~
炒啊炒啊炒~
菜炒好了，起锅~
```

## 3. 总结

**模板方法模式在Java中的应用**

最常见的就是Servlet了。

**HttpServlet担任抽象模板角色**

　　　　模板方法：由service()方法担任。

　　　　基本方法：由doPost()、doGet()等方法担任。

**MyServlet担任具体模板角色**

自定义的servlet置换掉了父类HttpServlet中七个基本方法中的其中两个，分别是doGet()和doPost()。

## 4. 参考

`https://www.cnblogs.com/qiumingcheng/p/5219664.html`