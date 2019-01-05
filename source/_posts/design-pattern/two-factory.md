---
title: Java设计模式（二）--工厂模式
tags:
  - 设计模式
categories:
  - 设计模式
abbrlink: 34710
date: 2018-10-10 22:00:00
---

本章主要介绍了设计模式中的工厂模式，并结合实例描述了工厂模式的具体实现和使用场景。包括：`普通工厂模式`、`工厂方法模式`、`抽象工厂模式`等。

<!--more-->

> 设计模式系列文章
>
> [Java23种设计模式](https://www.lixueduan.com/categories/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/)

## 1. 工厂模式介绍

工厂模式可以分为普通工厂模、工厂方法模式和抽象工厂模式。

**简单工厂模式：**建立一个工厂类，根据传入的参数对实现了同一接口的一些类进行实例的创建。

**工厂方法模式：**是对普通工厂方法模式的改进，提供多个工厂方法，分别创建对象。

**抽象工厂模式：**创建多个工厂类，这样一旦需要增加新的功能，直接增加新的工厂类就可以了，不需要修改之前的代码。

**工厂模式优点：**

(1) `解耦 `：把对象的创建和使用的过程分开

(2)`减少重复代码`: 若创建对象的过程很复杂，有一定的代码量，且很多地方都要用到，那么就会有很多重复代码。

(3) `降低维护成本` ：创建过程都由工厂统一管理，发生业务逻辑变化，只需要在工厂里修改即可。

**适用场景**

（1）需要创建的对象较少。

（2）客户端不关心对象的创建过程。

## 2. 简单工厂模式

![](https://github.com/illusorycloud/illusorycloud.github.io/raw/hexo/myImages/design_pattern/two-factory-static.png)

```java
public interface Fruit {
    void eat();
}

public class Apple implements Fruit {
    @Override
    public void eat() {
        System.out.println("Apple");
    }
}
public class Orange implements Fruit {
    @Override
    public void eat() {
        System.out.println("Orange");
    }
}
//水果工厂 根据不同参数创建不同的水果对象
public class FruitFactory {
 public static Fruit creatFruit(String fruit){
     if (fruit.equals("Apple")) {
         return new Apple();
     } else if (fruit.equals("Orange")) {
         return new Orange();
     } else {
         System.out.println("error unknow fruit ~");
         return null;
     }
 }
}


public class FactoryTest {
    @Test
    public void testFactory() {
        Fruit apple = FruitFactory.creatFruit("Apple");
        apple.eat();
    }
}
```



## 3. 工厂方法模式

```java
public interface ThreadFactory {

    /**
     * Constructs a new {@code Thread}.  Implementations may also initialize
     * priority, name, daemon status, {@code ThreadGroup}, etc.
     *
     * @param r a runnable to be executed by new thread instance
     * @return constructed thread, or {@code null} if the request to
     *         create a thread is rejected
     */
    Thread newThread(Runnable r);
}
```

> 具体的线程工厂可以implements这个接口并实现newThread(Runnable r)方法，来生产具体线程工厂想要生产的线程。
>
>

```java
//抽象水果工厂
public interface FruitFactory {
    Fruit creatFruit();
}
//苹果工厂
public class AppleFactory implements FruitFactory{

    @Override
    public Fruit creatFruit() {
        return new Apple();
    }
}
//橘子工厂
public class OrangeFactory implements FrutiFactory {

    @Override
    public Fruit creatFruit() {
        return new Orange();
    }
}
//测试
public class FactoryTest {
    @Test
    public void testFactory() {
        AppleFactory appleFactory = new AppleFactory();
        Fruit apple = appleFactory.creatFruit();
        apple.eat();
        OrangeFactory orangeFactory = new OrangeFactory();
        Fruit orange = orangeFactory.creatFruit();
        orange.eat();
    }
}
```

## 4. 抽象工厂模式

![](https://github.com/illusorycloud/illusorycloud.github.io/raw/hexo/myImages/design_pattern/two-factory-abstract.gif)

> 工厂方法模式有一个问题就是，类的创建依赖工厂类，也就是说，如果想要拓展程序，必须对工厂类进行修改，这违背了闭包原则，所以，从设计角度考虑，有一定的问题，如何解决？就用到抽象工厂模式，创建多个工厂类，这样一旦需要增加新的功能，直接增加新的工厂类就可以了，不需要修改之前的代码。

```java
//两个接口 Fruit Juice
public interface Fruit {
    void eat();
}
public interface Juice {
    void drink();
}
//四个对象 苹果 橘子 苹果汁 橘子汁
public class Apple implements Fruit {
    @Override
    public void eat() {
        System.out.println("Apple");
    }
}

public class Orange implements Fruit {
    @Override
    public void eat() {
        System.out.println("Orange");
    }
}

public class AppleJuice implements Juice {
    @Override
    public void drink() {
        System.out.println("AppleJuice");
    }
}

public class OrangeJuice implements Juice {
    @Override
    public void drink() {
        System.out.println("OrangeJuice");
    }
}

//抽象工厂 生产水果和果汁
public interface AbstractFactory {
     Fruit creatFruit();

     Juice creatJuice();
}
//具体工厂 生产苹果相关产品
public class AppleFactory implements AbstractFactory {
    @Override
    public Fruit creatFruit() {
        return new Apple();
    }

    @Override
    public Juice creatJuice() {
        return new AppleJuice();
    }
}
//具体工厂 生产橘子相关产品
public class OrangeFactory implements AbstractFactory {
    @Override
    public Fruit creatFruit() {
        return new Orange();
    }

    @Override
    public Juice creatJuice() {
        return new OrangeJuice();
    }
}

//测试
    @Test
    public void testFactory(){
        AppleFactory appleFactory=new AppleFactory();
        Fruit apple =  appleFactory.creatFruit();
        Juice appleJuice=  appleFactory.creatJuice();
        apple.eat();
        appleJuice.drink();
        OrangeFactory orangeFactory=new OrangeFactory();
        Fruit orange=  orangeFactory.creatFruit();
        Juice orangeJuice=  orangeFactory.creatJuice();
        orange.eat();
        orangeJuice.drink();
    }
```

## 5. 总结

**工厂模式的优点？为什么要使用工厂模式**

- 工厂都是用来封装对象的具体创建过程，减少重复代码，降低对象变化时的维护成本，将对象创建过程和使用相解耦。 
- 工厂方法模式使用继承，抽象工厂使用对象组合；两者利用抽象的原则，将具体的实例化过程延迟到子类。 
- 工厂利用的最重要和基本的原则——依赖抽象，不要依赖具体类。

**应用场景**

简单工厂：适合创建同一级别的不同对象。

工厂方法：为每种产品提供一个工厂类，通过不同的工厂实例来创建不同的产品。

抽象工厂模式：一个对象族（或是一组没有任何关系的对象）都有相同的约束，则可以使用抽象工厂模式。

**工厂模式在Java中的应用**

`简单工厂模式`

JDK中的简单工厂模式有很多应用，比较典型的比如线程池。我们使用线程池的时候，可以使用ThreadPoolExecutor，根据自己的喜好传入corePoolSize、maximumPoolSize、keepAliveTimem、unit、workQueue、threadFactory、handler这几个参数，new出一个指定的ThreadPoolExecutor出来。

`工厂方法模式`

```java
public interface ThreadFactory {

    /**
     * Constructs a new {@code Thread}.  Implementations may also initialize
     * priority, name, daemon status, {@code ThreadGroup}, etc.
     *
     * @param r a runnable to be executed by new thread instance
     * @return constructed thread, or {@code null} if the request to
     *         create a thread is rejected
     */
    Thread newThread(Runnable r);
}
```

这是一个生产线程的接口,具体的线程工厂可以implements这个接口并实现newThread(Runnable r)方法，来生产具体线程工厂想要生产的线程。

## 6. 参考

`https://blog.csdn.net/d1562901685/article/details/77623237`

`https://www.cnblogs.com/xrq730/p/4905578.html`

