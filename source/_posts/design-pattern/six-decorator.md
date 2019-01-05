---
title: Java设计模式（六）--装饰者模式
tags:
  - 设计模式
categories:
  - 设计模式
abbrlink: '75903408'
date: 2018-10-16 22:00:00
---

本文主要介绍了Java23种设计模式中的装饰者模式，并结合实例描述了装饰者模式的具体实现和优缺点分析。

<!--more-->

> 设计模式系列文章
>
> [Java23种设计模式](https://www.lixueduan.com/categories/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/)

## 1. 装饰者模式介绍

在不必改变原类文件和使用继承的情况下，动态地扩展一个对象的功能。

它是通过创建一个包装对象，也就是装饰来包裹真实的对象。是继承关系的一个替代方案。

![](https://github.com/illusorycloud/illusorycloud.github.io/raw/hexo/myImages/design_pattern/six-decorator.png)

**装饰模式由4种角色组成：**
（1）抽象构件（Component）角色：给出一个抽象接口，以规范准备接收附加职责的对象。
（2）具体构件（Concrete Component）角色：定义一个将要接收附加职责的类。
（3）装饰（Decorator）角色：持有一个构件（Component）对象的实例，并实现一个与抽象构件接口一致的接口，从外类来扩展Component类的功能，但对于Component类来说，是无需知道Decorato的存在的。
（4）具体装饰（Concrete Decorator）角色：负责给构件对象添加上附加的职责。

## 2. 装饰者模式具体实现

```java
public interface Component {

    public Double getPrice();//返回价格

    public String getName();//返回商品名
}

public class ConcreteComponent implements Component {
    private String milk = "牛奶";//买了一盒牛奶
    private Double price_milk=5.5;


    @Override
    public Double getPrice() {
        return price_milk;
    }

    @Override
    public String getName() {
        return milk;
    }
}
//抽象装饰角色
public class Decorator implements Component {
    private ConcreteComponent cc;

    public Decorator(ConcreteComponent cc) {
        this.cc = cc;
    }

    @Override
    public Double getPrice() {
        return cc.getPrice();//具体由子类描述
    }

    @Override
    public String getName() {
        return cc.getName();
    }
}

//具体装饰角色1 牛奶不够 加一个面包
public class ConcreteDecorator extends Decorator {
    private String bread = "面包";//又买了一个面包
    private Double price_bread = 6.8;//面包价格

    public ConcreteDecorator(ConcreteComponent cc) {
        super(cc);
    }

    @Override
    public Double getPrice() {
        return super.getPrice() + price_bread;//加面包价格
    }

    @Override
    public String getName() {
        return super.getName() + bread;//加面包
    }
}

//具体装饰角色2 不想喝牛奶 要吃苹果
public class ConcreteDecorator2 extends Decorator {
    private String apple = "苹果";//买了一个苹果
    private Double price_apple = 15.2;

    public ConcreteDecorator2(ConcreteComponent cc) {
        super(cc);
    }

    @Override
    public String getName() {
        return  apple;//只买了苹果 牛奶不要了
    }

    @Override
    public Double getPrice() {
        return  price_apple;
    }
}

    //测试
    public class test {

        public static void main(String[] args) {
            ConcreteComponent cc = new ConcreteComponent();
            ConcreteDecorator cd = new ConcreteDecorator(cc);
            System.out.println("name:" + cd.getName() + "" + "price:" + cd.getPrice());
            System.out.println("------------------------------------");
            ConcreteDecorator2 cd2 = new ConcreteDecorator2(cc);
            System.out.println("name:" + cd2.getName() + "" + "price:" + cd2.getPrice());
        }
    }

  //输出
    name:牛奶面包price:12.3
    -----------------------------------
    name:苹果price:15.2
```

## 3. 总结

**优点**

1.装饰者模式可以提供比继承更多的灵活性。装饰器模式允许系统动态决定贴上一个需要的装饰，或者除掉一个不需要的装饰。继承关系是不同，继承关系是静态的，它在系统运行前就决定了。

2.通过使用不同的具体装饰器以及这些装饰类的排列组合，设计师可以创造出很多不同的行为组合。

**缺点**

由于使用装饰器模式，可以比使用继承关系需要较少数目的类。使用较少的类，当然使设计比较易于进行。但是另一方面，由于使用装饰器模式会产生比使用继承关系更多的对象，更多的对象会使得查错变得困难，特别是这些对象看上去都很像。

**装饰者模式和代理模式对比**

装饰者模式主要对功能进行扩展，代理模式主要是添加一些无关业务的功能，比如日志，验证等

使用代理模式,代理和真实对象之间的关系在编译时就已经确定了,而装饰器者能够在运行时递归的被构造.(代理模式会在代理类中创建真实处理类的一个实例,所以可以确定代理和真实对象的关系,而装饰器模式是将原始对象作为一个参数传给装饰器类)

装饰模式：以对客户端透明的方式扩展对象的功能，是继承关系的一个替代方案；
代理模式：给一个对象提供一个代理对象，并有代理对象来控制对原有对象的引用；

**装饰者模式在Java中的应用**

装饰器模式在Java体系中的经典应用是Java I/O

**抽象构件角色**:`InputStream`

**具体构建角色**:`ByteArrayInputStream`、`FileInputStream`、`ObjectInputStream`、`PipedInputStream`等

**装饰角色**；`FilterInputStream` -->实现了InputStream内的所有抽象方法并且持有一个InputStream的引用

**具体装饰角色**:InflaterInputStream、BufferedInputStream、DataInputStream等

## 4. 参考

`https://www.cnblogs.com/xrq730/p/4908940.html`



