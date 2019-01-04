---
title: Java设计模式（）--模式
date: 2018-10-08 22:00:00
tags: [设计模式]
categories: [设计模式]
---

本文主要介绍了Java23种设计模式中的原型模式，并结合实例描述了原型模式的具体实现和应用场景，优缺点分析等。

<!--more-->

> 设计模式系列文章
>
> [Java23种设计模式](https://www.lixueduan.com/categories/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/)

## 1. 原型模式介绍

### 1.1 原型模式

![](https://github.com/illusorycloud/illusorycloud.github.io/raw/hexo/myImages/design_pattern/four-prototype.gif)

**原型模式的思想就是将一个对象作为原型，对其进行复制、克隆，产生一个和原对象类似的新对象。**简单地说原型模式就是创建复杂对象的时候使用克隆手段来代替新建一个对象。当创建新的对象实例较为复杂时，使用原型模式可以简化对象的创建过程，通过一个已有实例可以提高新实例的创建效率。

 原型模式主要包含如下三个角色：

* Prototype：抽象原型类。声明克隆自身的接口。 
* ConcretePrototype：具体原型类。实现克隆的具体操作。 
* Client：客户类。让一个原型克隆自身，从而获得一个新的对象。

### 1.2 克隆

我们需要知道，Java中的对象克隆分为浅克隆和深克隆。

* 浅克隆：将一个对象克隆后，基本数据类型的变量都会重新创建，而引用类型，指向的还是原对象所指向的。

* 深克隆：将一个对象克隆后，不论是基本数据类型还有引用类型，都是重新创建的。

简单来说，就是深克隆进行了完全彻底的克隆，而浅克隆不彻底。



## 2.原型模式实现

```java
//实现Cloneable接口浅复制，Serializable接口深复制
public class Book implements Cloneable, Serializable {
    private String title;
    private int page;
    private Author author;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public Author getAuthor() {
        return author;
    }

    public void setAuthor(Author author) {
        this.author = author;
    }

    public Book clone() {
        Book book = null;
        try {
            book = (Book) super.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
        return book;
    }

    public Book deepClone() throws IOException, ClassNotFoundException {
        // 写入当前对象的二进制流
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ObjectOutputStream oos = new ObjectOutputStream(bos);
        oos.writeObject(this);
        // 读出二进制流产生的新对象
        ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
        ObjectInputStream ois = new ObjectInputStream(bis);
        return (Book) ois.readObject();

    }

}
//Author类 Book中引用
public class Author implements Serializable {
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
//测试
    public class FactoryTest {
        public static void main(String[] args) {
            try {
                Author author = new Author();
                author.setAge(22);
                author.setName("illusoryCloud");
                Book book = new Book();
                book.setAuthor(author);
                book.setPage(222);
                book.setTitle("MyBook");
                Book clone = book.clone();
                Book deepClone = book.deepClone();
                //深浅克隆的对象和原型都不是同一个对象
                //浅克隆对象的引用类型和原型相同，浅克隆，指向原来的地址
                System.out.println(book == clone);  // false
                System.out.println(book.getPage() == clone.getPage());   // true
                System.out.println(book.getTitle() == clone.getTitle());  // true
                System.out.println(book.getAuthor() == clone.getAuthor()); // true
                System.out.println("--------------------------------------");
                //深复制对象的引用类型和原型不相同，创建了新的引用对象
                System.out.println(book == deepClone);  // false
                System.out.println(book.getPage() == deepClone.getPage());   // true
                System.out.println(book.getTitle() == deepClone.getTitle());   // false
                System.out.println(book.getAuthor() == deepClone.getAuthor());   // false
            } catch (IOException | ClassNotFoundException e) {
                e.printStackTrace();
            }
        }
    }
```

## 3. 总结

**为什么要用原型模式**

通过复制已有的对象，可以简化对象的创建过程，提高创建对象的效率。

深克隆保存对象状态，实现撤销恢复功能。

**缺点：**

在实现深克隆时需要编写复杂的代码。

需要为每一个类写一个克隆方法，如果要深克隆，则类中的每一层对象的类都得支持深克隆，代码比较复杂。

**应用场景**

创建对象成本高。

当一个系统应该独立于它的产品创建、构成和表示时，要使用原型模式。

当一个类的实例只能有几个不同状态组合中的一种时。建立相应数目的原型并克隆它们可能比每次用合适的状态手工实例化该类更方便一些。

## 4. 参考

`https://www.cnblogs.com/chenssy/p/3313339.html`