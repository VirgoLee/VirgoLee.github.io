---
title: Java设计模式（三）--建造者模式
date: 2018-10-12 22:00:00
tags: [设计模式]
categories: [设计模式]
---

本文主要介绍了Java23种设计模式中的`建造者模式`，并结合实例描述了建造者模式的具体实现和优缺点及建造者模式和工厂模式的差别分析等。

<!--more-->

> 设计模式系列文章
>
> [Java23种设计模式](https://www.lixueduan.com/categories/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/)

## 1. 建造者模式介绍

> 建造者模式是将一个复杂的对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。。

建造者模式通常包括下面几个角色：

（1） `Builder`：给出一个抽象接口，以规范产品对象的各个组成成分的建造。这个接口规定要实现复杂对象的哪些部分的创建，并不涉及具体的对象部件的创建。

（2） `ConcreteBuilder`：实现Builder接口，针对不同的商业逻辑，具体化复杂对象的各部分的创建。 在建造过程完成后，提供产品的实例。

（3）`Director`：调用具体建造者来创建复杂对象的各个部分，在指导者中不涉及具体产品的信息，只负责保证对象各部分完整创建或按某种顺序创建。

（4）`Product`：要创建的复杂对象

## 2. 建造者模式实例

以创建一个Person为例：

Product（要创建的对象）：

```java
//首先创建一个Person对象，简单的一些属性和get，set方法
public class Person {
    private String name;
    private String address;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

}
```

Builder（给出一个抽象接口，以规范产品对象的各个组成成分的建造 ）

```java
//然后创建一个接口 建造对象的标准
public interface Builder {
    void builderName();

    void builderAddress();

    void builderAge();

    Person builderPerson();
}
```

ConcreteBuilder（实现Builder接口，针对不同的商业逻辑，具体化复杂对象的各部分的创建）

```java
//接着创建一个构造具体对象的类，实现前面的标准（接口）
public class BuildMe implements Builder {
    Person person;

    //构造方法创建一个对象
    public BuildMe() {
        person = new Person();
    }

    //然后为对象添加各种属性
    @Override
    public void builderName() {
        person.setName("lillusory");
    }

    @Override
    public void builderAddress() {
        person.setAddress("重庆");
    }

    @Override
    public void builderAge() {
        person.setAge(22);
    }

    //最后返回该对象
    @Override
    public Person builderPerson() {
        return person;
    }
}

//这里可以根据不同的逻辑或需求，实现不同的（产品）
public class BuildZhangSan implements Builder {
    Person person;

    public BuildZhangSan() {
        person = new Person();
    }

    @Override
    public void builderName() {
        person.setName("张三");
    }

    @Override
    public void builderAddress() {
        person.setAddress("北京");
    }

    @Override
    public void builderAge() {
        person.setAge(20);
    }

    @Override
    public Person builderPerson() {
        return person;
    }
}
```

Director（调用具体建造者来创建复杂对象的各个部分，在指导者中不涉及具体产品的信息，只负责保证对象各部分完整创建 ）

```java
//最后创建一个Director指导者？类来创建对象
//只负责保证对象各部分完整创建 不知道具体细节
public class Director {
    public Person construcPerson(Builder builder) {
        builder.builderName();
        builder.builderAddress();
        builder.builderAge();
        return builder.builderPerson();
    }
}
```

测试

```java
public class FactoryTest {
    public static void main(String[] args) {
        Director director = new Director();
        Person person = director.construcPerson(new BuildMe());
        System.out.println(person.getName());
        System.out.println(person.getAddress());
        System.out.println(person.getAge());

        cPerson zhangSan = director.construcPerson(new BuildZhangSan());
        System.out.println(zhangSan.getName());
        System.out.println(zhangSan.getAddress());
        System.out.println(zhangSan.getAge());
    }
}
//输出
        lillusory
        重庆
        22
        张三
        北京
        20
```

## 3. 总结

**建造者模式优点：**

1.将对象本身与对象的创建过程解耦，使得相同的创建过程可以创建不同的对象。

2.可以更加精细地控制产品的创建过程

3.增加新的具体建造者无须修改原有类库的代码，符合开闭原则 

**与工厂模式的区别：**

工厂模式注重的是整体对象的创建方法，只为了获取对象，关注整体

建造者模式注重的是部件构建的过程，旨在通过一步一步地精确构造创建出一个复杂的对象，关注细节。