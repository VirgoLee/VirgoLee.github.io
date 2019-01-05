---
title: Java设计模式（）--模式
date: 2018-10-08 22:00:00
tags: [设计模式]
categories: [设计模式]
---

本文主要介绍了Java23种设计模式中的策略模式，并结合实例描述了策略模式的具体实现和策略模式的优缺点分析。

<!--more-->

> 设计模式系列文章
>
> [Java23种设计模式](https://www.lixueduan.com/categories/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/)

## 1. 策略模式介绍

> **策略模式是对算法的包装**
>
> 策略模式定义了一系列的算法，并将每一个算法封装起来，而且它们还可以相互替换。策略模式让算法独立于使用它的客户而独立变化。

　　这个模式涉及到三个角色：

　　●　　环境(Context)角色：持有一个Strategy的引用。

　　●　　抽象策略(Strategy)角色：这是一个抽象角色，通常由一个接口或抽象类实现。此角色给出所有的具体策略类所需的接口。

　　●　　具体策略(ConcreteStrategy)角色：包装了相关的算法或行为。

## 2. 策略模式实现

```java
//定义一个接口抽象策略 定义一个两个整数间的计算方法
public interface Strategy {
    public abstract int calculate(int a, int b);
}

//具体策略A 加法
public class ConcreteStrategyA implements Strategy {
    @Override
    public int calculate(int a, int b) {
        return a + b;
    }
}

//具体策略B 减法
public class ConcreteStrategyB implements Strategy {
    @Override
    public int calculate(int a, int b) {
        return a - b;
    }
}

//具体策略C 乘法
public class ConcreteStrategyC implements Strategy {
    @Override
    public int calculate(int a, int b) {
        return a * b;
    }
}

//具体策略D 除法
public class ConcreteStrategyD implements Strategy {
    @Override
    public int calculate(int a, int b) {
        if (b != 0) {
            return a / b;
        } else {
            throw new RuntimeException("除数不能为零");
        }
    }
}
//定义具体的环境角色，持有Strategy接口的引用
// 并且有get和set方法可以完成策略更换
// 在环境角色中调用接口的方法完成动作。
public class Context {
    private Strategy strategy;

    public Context(Strategy strategy) {
        this.strategy = strategy;
    }

    public Strategy getStrategy() {
        return strategy;
    }

    public void setStrategy(Strategy strategy) {
        this.strategy = strategy;
    }

    public int calculate(int a, int b) {
        return strategy.calculate(a, b);
    }
}
//测试
    public class StrategyTest {

        public static void main(String[] args) {
            //加
            Context contextA = new Context(new ConcreteStrategyA());
            System.out.println(contextA.calculate(10, 2));
            //减
            Context contextB = new Context(new ConcreteStrategyB());
            System.out.println(contextB.calculate(10, 2));
            //乘
            Context contextC = new Context(new ConcreteStrategyC());
            System.out.println(contextC.calculate(10, 2));
            //除
            Context contextD = new Context(new ConcreteStrategyD());
            System.out.println(contextD.calculate(10, 2));
        }

    }
    //输出
    12
    8
    20
    5
```

## 3. 总结

**策略模式的重心不是如何实现算法**（就如同工厂模式的重心不是工厂中如何产生具体子类一样），而是如何组织、调用这些算法，从而让程序结构更灵活，具有更好的维护性和扩展性。

**优点**

1.让代码更优雅，避免了多重条件if...else语句。

2.策略模式提供了管理相关算法簇的办法，恰当使用继承可以把公共代码移到父类，从而避免了代码重复。

**缺点**

1.客户端必须知道所有的策略类，并自行决定使用 哪一个策略，这意味着客户端必须理解这些算法的区别，以便选择恰当的算法

2.如果备选策略很多，对象的数据会很多

## 4. 参考

`https://www.cnblogs.com/xrq730/p/4906313.html`

