---
title: Java设计模式（）--模式
date: 2018-10-08 22:00:00
tags: [设计模式]
categories: [设计模式]
---

本文主要介绍了Java23种设计模式中的 模式，并结合实例描述了 模式的具体实现和性能分析测试。

<!--more-->

> 设计模式系列文章
>
> [Java23种设计模式](https://www.lixueduan.com/categories/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/)

## 1. 代理模式介绍

> **给某一对象提供一个代理对象，并由代理对象控制对原对象的引用**。

**代理模式的结构**

有些情况下，一个客户不想或者不能够直接引用一个对象，可以通过代理对象在客户端和目标对象之间起到中介作用。代理模式中的角色有：

1、抽象对象角色

声明了目标对象和代理对象的共同接口，这样一来在任何可以使用目标对象的地方都可以使用代理对象

2、目标对象角色

定义了代理对象所代表的目标对象

3、代理对象角色

代理对象内部含有目标对象的引用，从而可以在任何时候操作目标对象；代理对象提供一个与目标对象相同的接口，以便可以在任何时候替代目标对象

## 2. 静态代理

```
由程序员创建或特定工具自动生成源代码，也就是在编译时就已经将接口，被代理类，代理类等确定下来。在程序运行之前，代理类的.class文件就已经生成。

代理类和被代理类必须实现同一个接口
```

```java
//代理类和被代理类需要实现的接口
public interface Person {
    public void sayHello(String str);
}

//学生 被代理类
public class Student implements Person {
    @Override
    public void sayHello(String str) {
        System.out.println(str);
    }
}

//代理类
public class PersonProxy implements Person {
    //被代理的对象
    private Person person;

    //通过构造方法赋值
    public PersonProxy(Person person) {
        this.person = person;
    }

    @Override
    public void sayHello(String str) {
        //在执行代理方法前后可以执行其他的方法 代理模式的一个很大的优点
        System.out.println("Before");
        //在代理类的方法中 间接访问被代理对象的方法
        person.sayHello(str);
        System.out.println("After");

    }
}

      //测试代码
            public class ProxyTest {
                public static void main(String[] args) {
                    //被代理的对象
                    Student student = new Student();
                    //将被代理对象传递给代理对象
                    PersonProxy personProxy = new PersonProxy(student);
                    //代理对象调用方法
                    personProxy.sayHello("hello proxy");
                }
            }
   //输出结果
            Before
            hello proxy
            After
```

## 3. 动态代理

> 代理类在程序运行时创建的代理方式被成为动态代理。

```java
public class JDKProxy implements InvocationHandler{
	//引入被增强类的实例
	private UserDao userDao;
	public JDKProxy (UserDao userDao) {
		this.userDao=userDao;
	}
	public UserDao createProxy() {
		UserDao userDaoProxy=(Demo.UserDao) Proxy.newProxyInstance(userDao.getClass().getClassLoader(),
				userDao.getClass().getInterfaces(), this);//直接用当前类实现InvocationHandler接口
		return userDaoProxy;
	}
	////调用被代理对象的任何方法都相当于在调用这个方法
	public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
		if ("想要增强的方法".equals(method.getName())) {//判断是不是想要增强的方法
			//是想增强的方法 则对方法进行增强
			System.out.println("before");
			method.invoke(UserDao, args);
			System.out.println("after");
		}
		//普通方法就正常执行
		return method.invoke(UserDao, args);
	}
}


//比较重要的两个地方 
1..InvocationHandler
InvocationHandler 是一个接口，官方文档解释说，每个代理的实例都有一个与之关联的 InvocationHandler 实现类，如果代理的方法被调用，那么代理便会通知和转发给内部的 InvocationHandler 实现类，由它决定处理。

public interface InvocationHandler {
    public Object invoke(Object proxy, Method method, Object[] args)
        throws Throwable;
}
InvocationHandler 内部只是一个 invoke() 方法，正是这个方法决定了怎么样处理代理传递过来的方法调用。
//对代理对象的增强就在这里进行 实现该接口 重写此方法 可以用匿名内部类或者直接用生成代理的那个类实现该接口
-proxy 代理对象
-method 代理对象调用的方法
-args 调用的方法中的参数
因为，Proxy 动态产生的代理会调用 InvocationHandler 实现类，所以 InvocationHandler 是实际执行者。
需要创建一个类实现InvocationHandler接口

 2..生成代理对象
    Proxy.newProxyInstance(classLoader, interfaces, dynamicInvocationHandler);
第三个参数就要用到InvocationHandler接口的实现类
//参数1  类加载器  增强哪个对象就写哪个类的类加载器 myCar.getClass().getClassLoader();
//	告诉虚拟机用哪个字节码加载器加载内存中创建出来的字节码文件 一般是application类加载器

//参数2 字节码数组 被代理类实现的所有接口的字节码数组 
//   告诉虚拟机内存中正在你被创建的字节码文件中应该有哪些方法

//参数3 一个InvocationHandler对象，表示的是当我这个动态代理对象在调用方法的时候，会关联到哪一个InvocationHandler对象上  、
//  告诉虚拟机字节码上的那些方法如何处理 （用户自定义增强操作等 写在实现InvocationHandler接口的那个类中）
```

同样是上边的Person接口 和Student被代理类

```java
 //测试代码
            public class DynamicTest {
                public static void main(String[] args) {
                //创建一个实例对象，这个对象是被代理的对象
                Student studentB = new Student();
                //获取被代理对实现的所有接口的字节码
                Class[] interfaces = Student.class.getInterfaces;
                //创建一个与代理对象相关联的InvocationHandler 将被代理对象传过去
                DynamicInvocationHandler dynamicInvocationHandler = new DynamicInvocationHandler(studentB);
				//获取被代理对象的类加载器
                ClassLoader classLoader = StudentB.getClass().getClassLoader();
         //生成代理对象 返回的时Object类型 只能强转为接口类型（Person） 不能强转为子类类型(Student)
                Person person = (Person) Proxy.newProxyInstance(classLoader, interfaces, dynamicInvocationHandler);//这里需要创建一个类实现InvocationHandler接口 重写invoke方法
                //代理对象调用方法
                person.sayHello("hello Dynamic");
                }
            }            

   //输出结果
            Before
            hello Dynamic
            After
```

**小结：** 

```java
 1.通过 Proxy.newProxyInstance(classLoader, interfaces, dynamicInvocationHandler);生成代理对象，
 2.创建InvocationHandler接口实现类 重写invoke方法 实现具体的方法增强
 3.调用对象的方法最后都是调用InvocationHandler接口的invoke方法
 4.只能增强接口中有的方法
```

## 4. CGLIB动态代理

> JDK代理要求被代理的类必须实现接口，有很强的局限性。
>
> 而CGLIB动态代理则没有此类强制性要求。简单的说，CGLIB会让生成的代理类继承被代理类，并在代理类中对代理方法进行强化处理(前置处理、后置处理等)。在CGLIB底层，其实是借助了ASM这个非常强大的Java字节码生成框架。
>
> cglib原理是通过字节码技术为一个类创建子类，并在子类中采用方法拦截的技术拦截所有父类方法的调用，顺势织入横切逻辑。由于是通过子类来代理父类，因此不能代理被final字段修饰的方法。

```java
public class CglibProxy implements MethodInterceptor{
	//引入被增强类的实例
	private UserDao userDao;
	public CglibProxy (UserDao userDao) {
		this.userDao=userDao;
	}
	
	public UserDao createProxy() {
		//1.创建Cglib的核心类对象
		Enhancer enhancer=new Enhancer();
		//2.设置父类 Cglib采用继承方式实现代理  所以需要设置父类
		enhancer.setSuperclass(userDao.getClass());
		//3.设置回调(类似于invocationhandler)
		enhancer.setCallback(this);//还是直接用当前类去实现MethodInterceptor接口 
		//4.创建代理对象
		UserDao proxy = (UserDao) enhancer.create();
		return proxy;
		
	}
	//类似于JDK动态代理的invoke方法 在这里对方法实现增强
	//调用被代理对象的任何方法都相当于在调用这个方法
	public Object intercept(Object Proxy, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
		if ("save".equals(method.getName())) {//判断是不是想要增强的方法
			//是想增强的方法 则对方法进行增强
			System.out.println("before");
			methodProxy.invoke(Proxy, args);
			System.out.println("after");
		}
		return methodProxy.invoke(Proxy, args);
		
	}
}
```

## 5. 代理模式比较

| 代理方式      | 实现                                                         | 优点                                                         | 缺点                                                         | 特点                                                       |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ---------------------------------------------------------- |
| JDK静态代理   | 代理类与委托类实现同一接口，并且在代理类中需要硬编码接口     | 实现简单，容易理解                                           | 代理类需要硬编码接口，在实际应用中可能会导致重复编码，浪费存储空间并且效率很低 | 好像没啥特点                                               |
| JDK动态代理   | 代理类与委托类实现同一接口，主要是通过代理类实现InvocationHandler并重写invoke方法来进行动态代理的，在invoke方法中将对方法进行增强处理 | 不需要硬编码接口，代码复用率高                               | 只能够代理实现了接口的委托类                                 | 底层使用反射机制进行方法的调用                             |
| CGLIB动态代理 | 代理类将委托类作为自己的父类并为其中的非final委托方法创建两个方法，一个是与委托方法签名相同的方法，它在方法中会通过super调用委托方法；另一个是代理类独有的方法。在代理方法中，它会判断是否存在实现了MethodInterceptor接口的对象，若存在则将调用intercept方法对委托方法进行代理 | 可以在运行时对类或者是接口进行增强操作，且委托类无需实现接口 | 不能对final类以及final方法进行代理                           | 底层将方法全部存入一个数组中，通过数组索引直接进行方法调用 |



## 6.参考

`https://www.cnblogs.com/xrq730/p/4907999.html`