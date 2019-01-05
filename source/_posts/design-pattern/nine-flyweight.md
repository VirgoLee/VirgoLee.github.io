---
title: Java设计模式（）--享元模式
tags:
  - 设计模式
categories:
  - 设计模式
abbrlink: 34e634e7
date: 2018-10-22 22:00:00
---

本文主要介绍了Java23种设计模式中的享元模式，并结合实例描述了享元模式的具体实现，具体优缺点和单例模式的对波。

<!--more-->

> 设计模式系列文章
>
> [Java23种设计模式](https://www.lixueduan.com/categories/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/)

## 1. 享元模式介绍

享元模式：“享”就是分享之意，指一物被众人共享，而这也正是该模式的终旨所在。

> 享元模式有点类似于单例模式，都是只生成一个对象来被共享使用。存储这些共享实例对象的地方称为**享元池** 。享元对象能做到共享的关键是区分了**内部状态(Intrinsic State)**和**外部状态(Extrinsic State)**。
>
>  **内部状态是存储在享元对象内部并且不会随环境改变而改变的状态，内部状态可以共享**。如围棋中的的黑棋白棋，不会随外部环境的变化而变化，无论在任何环境下黑棋始终是黑棋。
>
> **外部状态是随环境改变而改变的、不可以共享的状态**。享元对象的外部状态通常由客户端保存，并在享元对象被创建之后，需要使用的时候再传入到享元对象内部。比如每颗棋子的位置是不同的。

围棋中的黑棋和白棋可以是共享的对象，不用每次都创建一个新的对象。这样就只需要创建黑棋和白棋两个对象了。颜色是不会变得，所以是内部状态。落下得位置是随机的，所以作为外部状态。

![](https://github.com/illusorycloud/illusorycloud.github.io/raw/hexo/myImages/design_pattern/nine-flyweight.jpg)

## 2. 单纯享元模式

　　在单纯的享元模式中，所有的享元对象都是可以共享的。

　　单纯享元模式所涉及到的角色如下：

　　●　　**抽象享元(Flyweight)角色 ：**给出一个抽象接口，以规定出所有具体享元角色需要实现的方法。

　　●　　**具体享元(ConcreteFlyweight)角色：**实现抽象享元角色所规定出的接口。如果有内蕴状态的话，必须负责为内蕴状态提供存储空间。

　　**●　　享元工厂(FlyweightFactory)角色** ：本角色负责创建和管理享元角色。本角色必须保证享元对象可以被系统适当地共享。当一个客户端对象调用一个享元对象的时候，享元工厂角色会检查系统中是否已经有一个符合要求的享元对象。如果已经有了，享元工厂角色就应当提供这个已有的享元对象；如果系统中没有一个适当的享元对象的话，享元工厂角色就应当创建一个合适的享元对象。

```java
//围棋棋子类：抽象享元类  
abstract class IgoChessman {  
    public abstract String getColor();  
    public void display(Coordinates coord){  
        System.out.println("棋子颜色：" + this.getColor() + "，棋子位置：" + coord.getX() + "，" + coord.getY() );    
    }  
}  
//黑色棋子类：具体享元角色A
class BlackIgoChessman extends IgoChessman {  
    public String getColor() {  
        return "黑色";  
    }     
}  
//白色棋子类：具体享元角色B 
class WhiteIgoChessman extends IgoChessman {  
    public String getColor() {  
        return "白色";  
    }  
}  
//围棋棋子工厂类：享元端角色，享元工厂类 使用单例模式进行设计  
class IgoChessmanFactory {  
    private static IgoChessmanFactory instance = new IgoChessmanFactory();  
    private static Hashtable ht; //使用Hashtable来存储享元对象，充当享元池
    private IgoChessmanFactory() {  
        ht = new Hashtable();  
        IgoChessman black,white;  
        black = new BlackIgoChessman();  
        ht.put("b",black);  
        white = new WhiteIgoChessman();  
        ht.put("w",white);  
    }  
    //返回享元工厂类的唯一实例  
    public static IgoChessmanFactory getInstance() {  
        return instance;  
    }   
    //通过key来获取存储在Hashtable中的享元对象  
    public static IgoChessman getIgoChessman(String color) {  
        return (IgoChessman)ht.get(color);    
    }  
}  
//坐标类
class Coordinates {  
    private int x;  
    private int y;  
    public Coordinates(int x,int y) {  
        this.x = x;  
        this.y = y;  
    }  
    public int getX() {  
        return this.x;  
    }  
    public void setX(int x) {  
        this.x = x;  
    }  
    public int getY() {  
        return this.y;  
    }  
    public void setY(int y) {  
        this.y = y;  
    }  
}   
//测试代码
class Client {  
    public static void main(String args[]) {  
        IgoChessman black1,black2,black3,white1,white2;  
        IgoChessmanFactory factory;  
        //获取享元工厂对象  
        factory = IgoChessmanFactory.getInstance();  
        //通过享元工厂获取三颗黑子  
        black1 = factory.getIgoChessman("b");  
        black2 = factory.getIgoChessman("b");  
        black3 = factory.getIgoChessman("b");  
        System.out.println("判断两颗黑子是否相同：" + (black1==black2));  
        //通过享元工厂获取两颗白子  
        white1 = factory.getIgoChessman("w");  
        white2 = factory.getIgoChessman("w");  
        System.out.println("判断两颗白子是否相同：" + (white1==white2));  
        //显示棋子，同时设置棋子的坐标位置  
        black1.display(new Coordinates(1,2));  
        black2.display(new Coordinates(3,4));  
        black3.display(new Coordinates(1,3));  
        white1.display(new Coordinates(2,5));  
        white2.display(new Coordinates(2,4));  
    }  
}  
//输出
判断两颗黑子是否相同：true
判断两颗白子是否相同：true
棋子颜色：黑色，棋子位置：1，2
棋子颜色：黑色，棋子位置：3，4
棋子颜色：黑色，棋子位置：1，3
棋子颜色：白色，棋子位置：2，5
棋子颜色：白色，棋子位置：2，4
```

## 3. 复合享元模式

　　在单纯享元模式中，所有的享元对象都是单纯享元对象，也就是说都是可以直接共享的。还有一种较为复杂的情况，将一些单纯享元使用合成模式加以复合，形成复合享元对象。这样的复合享元对象本身不能共享，但是它们可以分解成单纯享元对象，而后者则可以共享。

　　复合享元角色所涉及到的角色如下：

　　●　　**抽象享元(Flyweight)角色 ：**给出一个抽象接口，以规定出所有具体享元角色需要实现的方法。

　　●　　**具体享元(ConcreteFlyweight)角色：**实现抽象享元角色所规定出的接口。如果有内蕴状态的话，必须负责为内蕴状态提供存储空间。

　　**●　  复合享元(ConcreteCompositeFlyweight)角色** ：复合享元角色所代表的对象是不可以共享的，但是一个复合享元对象可以分解成为多个本身是单纯享元对象的组合。复合享元角色又称作不可共享的享元对象。

　　**●　  享元工厂(FlyweightFactory)角色** ：本角 色负责创建和管理享元角色。本角色必须保证享元对象可以被系统适当地共享。当一个客户端对象调用一个享元对象的时候，享元工厂角色会检查系统中是否已经有 一个符合要求的享元对象。如果已经有了，享元工厂角色就应当提供这个已有的享元对象；如果系统中没有一个适当的享元对象的话，享元工厂角色就应当创建一个 合适的享元对象。

```java
//抽象享元角色类
public interface Flyweight {
    //一个示意性方法，参数state是外部状态
    public void operation(String state);
}
//具体享元角色类
public class ConcreteFlyweight implements Flyweight {
    private Character intrinsicState = null;
    /**
     * 构造函数，内部状态作为参数传入
     * @param state
     */
    public ConcreteFlyweight(Character state){
        this.intrinsicState = state;
    }


    /**
     * 外部状态作为参数传入方法中，改变方法的行为，
     * 但是并不改变对象的内部状态。
     */
    @Override
    public void operation(String state) {
        System.out.println("Intrinsic State = " + this.intrinsicState);
        System.out.println("Extrinsic State = " + state);
    }

}
//复合享元角色
public class ConcreteCompositeFlyweight implements Flyweight {

    private Map<Character,Flyweight> files = new HashMap<Character,Flyweight>();
    /**
     * 增加一个新的单纯享元对象到聚集中
     */
    public void add(Character key , Flyweight fly){
        files.put(key,fly);
    }
    /**
     * 外部状态作为参数传入到方法中
     */
    @Override
    public void operation(String state) {
        Flyweight fly = null;
        for(Object o : files.keySet()){
            fly = files.get(o);
            fly.operation(state);
        }

    }

}
//工厂类
public class FlyweightFactory {
    private Map<Character,Flyweight> files = new HashMap<Character,Flyweight>();
    /**
     * 复合享元工厂方法
     */
    public Flyweight factory(List<Character> compositeState){
        ConcreteCompositeFlyweight compositeFly = new ConcreteCompositeFlyweight();

        for(Character state : compositeState){
            compositeFly.add(state,this.factory(state));
        }

        return compositeFly;
    }
    /**
     * 单纯享元工厂方法
     */
    public Flyweight factory(Character state){
        //先从缓存中查找对象
        Flyweight fly = files.get(state);
        if(fly == null){
            //如果对象不存在则创建一个新的Flyweight对象
            fly = new ConcreteFlyweight(state);
            //把这个新的Flyweight对象添加到缓存中
            files.put(state, fly);
        }
        return fly;
    }
}
//测试代码
public class Client {

    public static void main(String[] args) {
        List<Character> compositeState = new ArrayList<Character>();
        compositeState.add('a');
        compositeState.add('b');
        compositeState.add('c');
        compositeState.add('a');
        compositeState.add('b');

        FlyweightFactory flyFactory = new FlyweightFactory();
        Flyweight compositeFly1 = flyFactory.factory(compositeState);
        Flyweight compositeFly2 = flyFactory.factory(compositeState);
        compositeFly1.operation("Composite Call");

        System.out.println("---------------------------------");
        System.out.println("复合享元模式是否可以共享对象：" + (compositeFly1 == compositeFly2));

        Character state = 'a';
        Flyweight fly1 = flyFactory.factory(state);
        Flyweight fly2 = flyFactory.factory(state);
        System.out.println("单纯享元模式是否可以共享对象：" + (fly1 == fly2));
    }
}
```

## 4. 总结

**优点：**

节约系统的开销，可以少创建对象。
外部状态不会影响内部状态，可以在不同环境下进行共享哦。
**缺点：**

享元模式使逻辑变得更加复杂，需要将享元对象分出内部状态和外部状态。

并且为了使对象可以共享，外部状态在很多情况下是必须有的，当读取外部状态时明显会增加运行时间。

**享元模式使用的场景：**

当我们项目中创建很多对象，而且这些对象存在许多相同模块，这时，我们可以将这些相同的模块提取出来采用享元模式生成单一对象，再使用这个对象与之前的诸多对象进行配合使用，这样无疑会节省很多空间。

**与单例模式的区别：**

享元模式的目的是共享，避免多次创建耗费资源，减少不会要额内存消耗 。

单例模式的目的是限制创建多个对象以避免冲突等 。

## 5. 参考

`http://blog.csdn.net/lovelion>`

`https://blog.csdn.net/Hmily_hui/article/details/80917975`