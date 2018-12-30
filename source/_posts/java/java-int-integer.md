---
title: Int与Integer比较
tags: Java
categories: Android
---
## Int与Integer比较

如果说Integer与int的区别：估计大多数人只会说道两点，Ingeter是int的包装类，int的初值为0，Ingeter的初值为null。

如果说Integer与int的区别：估计大多数人只会说道两点，Ingeter是int的包装类，int的初值为0，Ingeter的初值为null。如果说Integer与int的区别：估计大多数人只会说道两点，Ingeter是int的包装类，int的初值为0，Ingeter的初值为null。如果说Integer与int的区别：估计大多数人只会说道两点，Ingeter是int的包装类，int的初值为0，Ingeter的初值为null.如果说Integer与int的区别：估计大多数人只会说道两点，Ingeter是int的包装类，int的初值为0，Ingeter的初值为null。如果说Integer与int的区别：估计大多数人只会说道两点，Ingeter是int的包装类，int的初值为0，Ingeter的初值为null。如果说Integer与int的区别：估计大多数人只会说道两点，Ingeter是int的包装类，int的初值为0，Ingeter的初值为null。如果说Integer与int的区别：估计大多数人只会说道两点，Ingeter是int的包装类，int的初值为0，Ingeter的初值为null。如果说Integer与int的区别：估计大多数人只会说道两点，Ingeter是int的包装类，int的初值为0，Ingeter的初值为null。如果说Integer与int的区别：估计大多数人只会说道两点，Ingeter是int的包装类，int的初值为0，Ingeter的初值为null。如果说Integer与int的区别：估计大多数人只会说道两点，Ingeter是int的包装类，int的初值为0，Ingeter的初值为null。如果说Integer与int的区别：估计大多数人只会说道两点，Ingeter是int的包装类，int的初值为0，Ingeter的初值为null。如果说Integer与int的区别：估计大多数人只会说道两点，Ingeter是int的包装类，int的初值为0，Ingeter的初值为null。





```java
    public class TestInteger {
        public static void main(String[] args) {
            int i = 128;
            Integer i2 = 128;
            Integer i3 = new Integer(128);
            //Integer会自动拆箱为int，所以为true
            System.out.println(i == i2);
            System.out.println(i == i3);
            System.out.println("——————————————————————");
            //java在编译的时候,被翻译成-> Integer i5 = Integer.valueOf(127);
            Integer i5 = 127;
            Integer i6 = 127;
            System.out.println(i5 == i6);//true
            //Integer i5 = 128;
            //Integer i6 = 128;
            //System.out.println(i5 == i6);//false
            Integer ii5 = new Integer(127);
            System.out.println(i5 == ii5); //false
            Integer i7 = new Integer(128);
            Integer i8 = new Integer(123);
            System.out.println(i7 == i8);  //false
        }
    }
```

其实java在编译Integer i5 = 127 的时候,被翻译成-> Integer i5 = Integer.valueOf(127);

所以关键就是看valueOf()函数了，只要看看valueOf()函数的源码就会明白了。

JDK源码的valueOf函数式这样的：

```java
 public static Integer valueOf(int i) {
         assert IntegerCache.high >= 127;
         if (i >= IntegerCache.low && i <= IntegerCache.high)
             return IntegerCache.cache[i + (-IntegerCache.low)];
         return new Integer(i);
     }
```

看一下源码大家都会明白，对于-128到127之间的数，会进行缓存，Integer i5 = 127时，会将127进行缓存，下次再写Integer i6 = 127时，就会直接从缓存中取，就不会new了。所以22行的结果为true，而25行为false。

对于27行和30行，因为对象不一样，所以为false。

## 结论：

- ①无论如何，Integer与new Integer不会相等。i3的引用指向堆，而i4指向专门存放他的内存（常量池），他们的内存地址不一样，所以为false
- ②两个都是非new出来的Integer，如果数在-128到127之间，则是true,否则为false, java在编译Integer i2 = 128的时候,被翻译成-> Integer i2 = Integer.valueOf(128);而valueOf()函数会对-128到127之间的数进行缓存
- ③两个都是new出来的,则为false
- ④int和integer(无论new否)都为true，因为会把Integer自动拆箱为int。

 ![int-Integer](https://github.com/lillusory/lillusory.github.io/raw/master/images/posts/Java/Java_int_Integer.jpg)