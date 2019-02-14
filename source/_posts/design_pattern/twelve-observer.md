---
title: Java设计模式(十二)--观察者模式
tags:
  - 设计模式
categories:
  - 设计模式
abbrlink: 48bcf013
date: 2018-10-25 22:00:00
---

本文主要介绍了Java23种设计模式中的观察者模式，并结合实例描述了观察者模式的具体实现和优缺点分析。

<!--more-->

> 更多文章欢迎访问我的个人博客-->[幻境云图](https://www.lixueduan.com/)

## 1. 观察者模式介绍

> 让多个观察者对象同时监听某一个主题对象，这个主题对象在状态上发生变化时，会通知所有观察者对象，使他们能够自动更新自己。
> 在对象之间定义了一对多的依赖，这样一来，当一个对象改变状态，依赖它的对象会收到通知并自动更新。其实就是发布订阅模式，发布者发布信息，订阅者获取信息，订阅了就能收到信息，没订阅就收不到信息。

![](https://github.com/illusorycloud/illusorycloud.github.io/raw/hexo/myImages/design_pattern/twelve-observer.jpeg)

**该模式包含四个角色**

- **抽象被观察者角色**：也就是一个抽象主题，它把所有对观察者对象的引用保存在一个集合中，每个主题都可以有任意数量的观察者。抽象主题提供一个接口，可以增加和删除观察者角色。一般用一个抽象类和接口来实现。
- **抽象观察者角色**：为所有的具体观察者定义一个接口，在得到主题通知时更新自己。
- **具体被观察者角色**：也就是一个具体的主题，在集体主题的内部状态改变时，所有登记过的观察者发出通知。
- **具体观察者角色**：实现抽象观察者角色所需要的更新接口，一边使本身的状态与制图的状态相协调。

## 2. 观察者模式实现

```java
/***
 * 抽象观察者
 * 定义了一个update()方法，当被观察者调用notifyObservers()方法时，观察者的update()方法会被回调。
 *
 */
public interface Observer {
     void update(String message);
}

/***
 * 抽象被观察者接口
 * 声明了添加、删除、通知观察者方法
 */
public interface Observerable {
     void registerObserver(Observer o);

     void removeObserver(Observer o);

     void notifyObserver();
}

/**
 * 具体观察者
 * 实现update方法
 */
public class User implements Observer {
    private String name;
    private int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public void update(String message) {
        System.out.println(age + "岁的" + name + "收到推送的消息：" + message);
    }
}

/**
 * 具体被观察者
 * 实现了Observerable接口，对Observerable接口的三个方法进行了具体实现
 */
public class MyServer implements Observerable {
    private List<Observer> observerList;
    private String message;

    public MyServer() {
        observerList = new ArrayList<Observer>();
    }

    @Override
    public void registerObserver(Observer o) {
        observerList.add(o);
    }

    @Override
    public void removeObserver(Observer o) {
        if (!observerList.isEmpty()) {
            observerList.remove(o);
        }
    }

    @Override
    public void notifyObserver() {
        for (int i = 0; i < observerList.size(); i++) {
            Observer observer = observerList.get(i);
            observer.update(message);
        }
    }

    public void PushMessage(String message) {
        this.message = message;
        System.out.println("推送消息：" + message);
        notifyObserver();
    }
}

//测试
public class Test {

    public static void main(String[] args) {
        MyServer myServer = new MyServer();
        User lillusory = new User("lillusory", 22);
        User Az = new User("Az", 17);
        myServer.registerObserver(lillusory);
        myServer.registerObserver(Az);
        myServer.PushMessage("第一条推送消息");
        System.out.println("-------------------------------");
        myServer.removeObserver(Az);//Az取消注册后就收不到消息
        User yiqixing = new User("意琦行", 999);
        myServer.registerObserver(yiqixing);//新增的观察者只能收到后面的消息
        myServer.PushMessage("第二条推送消息");

    }
}
//输出
        推送消息：第一条推送消息
                22岁的lillusory收到推送的消息：第一条推送消息
                17岁的Az收到推送的消息：第一条推送消息
                -------------------------------
                推送消息：第二条推送消息
                22岁的lillusory收到推送的消息：第二条推送消息
                999岁的意琦行收到推送的消息：第二条推送消息
```

## 3. 总结

**优点：**

1.降低重复代码，使得代码更清晰、更易读、更易扩展

2.解耦，使得代码可维护性更好，修改代码的时候可以尽量少改地方

**应用场景：**

1.对一个对象状态的更新需要其他对象同步更新

2.对象仅需要将自己的更新通知给其他对象而不需要知道其他对象的细节，如消息推送.

**观察者模式在Java中的应用及解读**

JDK是有直接支持观察者模式的，就是java.util.Observer这个接口：

```java
public interface Observer {
    /**
     * This method is called whenever the observed object is changed. An
     * application calls an <tt>Observable</tt> object's
     * <code>notifyObservers</code> method to have all the object's
     * observers notified of the change.
     *
     * @param   o     the observable object.
     * @param   arg   an argument passed to the <code>notifyObservers</code>
     *                 method.
     */
    void update(Observable o, Object arg);
}
```

这就是观察者的接口，定义的观察者只需要实现这个接口就可以了。update()方法，被观察者对象的状态发生变化时，被观察者的notifyObservers()方法就会调用这个方法：

```java
public class Observable {
    private boolean changed = false;
    private Vector obs;
   
    /** Construct an Observable with zero Observers. */

    public Observable() {
    obs = new Vector();
    }

    /**
     * Adds an observer to the set of observers for this object, provided 
     * that it is not the same as some observer already in the set. 
     * The order in which notifications will be delivered to multiple 
     * observers is not specified. See the class comment.
     *
     * @param   o   an observer to be added.
     * @throws NullPointerException   if the parameter o is null.
     */
    public synchronized void addObserver(Observer o) {
        if (o == null)
            throw new NullPointerException();
    if (!obs.contains(o)) {
        obs.addElement(o);
    }
    }
    ...
}
```

这是被观察者的父类，也就是主题对象。

## 4. 参考

`https://www.cnblogs.com/xrq730/p/4908686.html`