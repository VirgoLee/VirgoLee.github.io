---
title: ZooKeeper入门教程(三)---Watcher与分布式锁
tags:
  - ZooKeeper
categories:
  - ZooKeeper
abbrlink: 4975d97e
date: 2019-03-03 22:00:00
---

write here

前面写摘要

<!--more-->

> 更多文章欢迎访问我的个人博客-->[幻境云图](https://www.lixueduan.com/)

## 1. ZooKeeper的watch监听

### 1.1 简介

 在 ZooKeeper 中，引入了 Watcher 机制来实现这种分布式的通知功能。ZooKeeper 允许客户端向服务端注册一个 Watcher 监听，当服务器的一些特定事件触发了这个 Watcher，那么就会向指定客户端发送一个事件通知来实现分布式的通知功能。

 同样，其watcher是监听数据发送了某些变化，那就一定会有对应的事件类型, 
 和状态类型。

### 1.2  事件类型

与节点相关。

* EventType.NodeCreated 
* EventType.NodeDataChanged 
* EventType.NodeChildrenChanged 
* EventType.NodeDeleted 

### 1.3 状态类型

与客户端实例相关。

- KeeperState.Oisconnected 
- KeeperState.SyncConnected 
- KeeperState.AuthFailed 
- KeeperState.Expired

### 1.4 持续监听

ZooKeeper中有很多个节点，客户端也也可以new多个watcher，会开一个新的线程分别监听不同的节点，当监听的节点发送变化后，客户端就可以收到消息。
其中watch可以看成是一个动作，是一次性的，watch一次就只能收到一次监听，节点别修改两次也只能收到第一次的通知。

两种持续监听方案：

* 1.收到变化后将Boolean值手动赋为true，表示下一次还要监听
* 2.再new一个watcher去监听

 ### 1.5 测试代码

```java
    @Test
    public void testWatch() throws KeeperException, InterruptedException, IOException {
        Watcher watcher = new Watcher() {
            @Override
            public void process(WatchedEvent event) {
                Event.EventType type = event.getType();
                Event.KeeperState state = event.getState();
                String path = event.getPath();
                switch (state) {
                    case SyncConnected:
                        System.out.println("state: SyncConnected");
                        System.out.println("path: " + path);
                        waitZooKeeperConnOne.countDown();
                        break;
                    case Disconnected:
                        System.out.println("state: Disconnected");
                        System.out.println("path: " + path);
                        break;
                    case AuthFailed:
                        System.out.println("state: AuthFailed");
                        System.out.println("path: " + path);
                        break;
                    case Expired:
                        System.out.println("state: Expired");
                        System.out.println("path: " + path);
                        break;
                    default:
                        System.out.println("state: default");
                }
                System.out.println("------------------------");
                switch (type) {
                    case None:
                        System.out.println("type: None");
                        System.out.println("path: " + path);
                        break;
                    case NodeCreated:
                        System.out.println("type: NodeCreated");
                        System.out.println("path: " + path);
                        break;
                    case NodeDataChanged:
                        System.out.println("type: NodeDataChanged");
                        System.out.println("path: " + path);
                        break;
                    case DataWatchRemoved:
                        System.out.println("type: DataWatchRemoved");
                        System.out.println("path: " + path);
                        break;
                    case ChildWatchRemoved:
                        System.out.println("type:child watch被移除");
                        System.out.println("path: " + path);
                        break;
                    case NodeChildrenChanged:
                        System.out.println("type: NodeChildrenChanged");
                        System.out.println("path: " + path);
                        break;
                    case NodeDeleted:
                        System.out.println("type: NodeDeleted");
                        System.out.println("path: " + path);
                        break;
                    default:
                        System.out.println("type: default");
                }
                System.out.println("------------------------");
            }

        };
        String childPath = "/cloud/test5";
        String childPath2 = "/cloud/test6";
        String parentPath = "/cloud";
        //创建时watch一次 1次
        ZooKeeper z = new ZooKeeper(CONN_ADDR, SESSION_TIMEOUT, watcher);
        waitZooKeeperConnOne.await();
        //这里也watch一次 2次
        z.exists(childPath, true);
        z.create(childPath, "cloud".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
        //watch一下父节点 即/cloud  3次
        z.getChildren(parentPath, true);
        z.create(childPath2, "cloud".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
        //再watch一次子节点  4次
        z.exists(childPath, true);
        z.setData(childPath, "a".getBytes(), -1);
        Thread.sleep(1000);
    }
```

### 1.5 watcher小结

ZooKeeper 的 Watcher 具有以下几个特性。

#### 1. 一次性

无论是服务端还是客户端，一旦一个 Watcher 被触发，ZooKeeper 都会将其从相应的存储中移除。因此，在 Watcher 的使用上，需要反复注册。这样的设计有效地减轻了服务端的压力。

#### 2. 客户端串行执行

客户端 Watcher 回调的过程是一个串行同步的过程，这为我们保证了顺序，同时，需要注意的一点是，一定不能因为一个 Watcher 的处理逻辑影响了整个客户端的 Watcher 回调，所以，我觉得客户端 Watcher 的实现类要另开一个线程进行处理业务逻辑，以便给其他的 Watcher 调用让出时间。

#### 3. 轻量 

WatcherEvent 是 ZooKeeper 整个 Watcher 通知机制的最小通知单元，这个数据结构中只包含三部分内容：通知状态、事件类型和节点路径。也就是说，Watcher 通知非常简单，只会告诉客户端发生了事件，而不会说明事件的具体内容。

例如针对 NodeDataChanged 事件，ZooKeeper 的Watcher 只会通知客户端指定数据节点的数据内容发生了变更，而对于原始数据以及变更后的新数据都无法从这个事件中直接获取到，而是需要客户端主动重新去获取数据——这也是 ZooKeeper 的 Watcher 机制的一个非常重要的特性。

## 2. ZooKeeper分布式锁

### 2.1 为什么需要分布式锁

并发相关的各种锁只能限制当前服务器上只能有一个用户或者线程访问加锁的资源，在单机部署环境下确实是没问题的，但是在有多台服务器的分布式环境下，并发相关的锁就不管用了，Nginx负载均衡将用户请求分到多台服务器上，每台服务器上都会有一个用户能访问到加锁的资源，这样就出现了并发问题，所以为了解决在分布式环境下的并发问题就出现了分布式锁。

### 2.2 总体思路
* 1.在获取分布式锁的时候在父节点(假设为locker)下创建临时顺序节点，释放锁的时候删除该临时节点。
* 2.客户端调用createNode方法在locker下创建临时顺序节点，然后调用getChildren(“locker”)来获取locker下面的所有子节点，注意此时不用设置任何Watcher。
* 3.客户端获取到所有的子节点path之后，如果发现自己创建的子节点序号最小，那么就认为该客户端获取到了锁。
* 4.如果发现自己创建的节点并非locker所有子节点中最小的，说明自己还没有获取到锁，此时客户端需要找到比自己小的那个节点，然后对其调用exist()方法，同时对其注册事件监听器。
* 5.之后，让这个被关注的节点删除，则客户端的Watcher会收到相应通知，此时再次判断自己创建的节点是否是locker子节点中序号最小的，如果是则获取到了锁，如果不是则重复以上步骤继续获取到比自己小的一个节点并注册监听。

### 2.3 相关概念

#### 1. 有序节点

如果创建的是有序节点，那么zookeeper在生成子节点时会根据当前的子节点数量自动添加整数序号，也就是说如果是第一个创建的子节点，那么生成的子节点为`/locker/node-0000000000`，下一个节点则为`/locker/node-0000000001`，依次类推。

#### 2. 临时节点

ZooKeeper的临时节点时本次会话有效，等客户端执行完业务代码后关闭会话，临时节点就自动删除掉了。

#### 3. 事件监听



在读取数据时，我们可以同时对节点设置事件监听，当节点数据或结构变化时，zookeeper会通知客户端。当前zookeeper有如下四种事件:

* 1.节点创建
* 2.节点删除
* 3.节点数据修改
* 4.子节点变更

就是上一篇文章中讲的watcher。

### 2.4 例子

ZooKeeper可以通过依赖于临时节点实现分布式锁。
假设有两台服务器 一台8888 一台8889，都部署了同一个web程序。

此刻同时来了两个请求 一个被分到了8888服务器，一个被分到了8889服务器上。
两个请求都要去修改数据库中的User表里的ID 为666的用户的信息(例如都是把age属性+1 假设当前age为22）

**没加锁前**：
 用户A查询到age为22 ++后变成23
 用户B也查询到是22  ++后也变成23
 其中这里两个++后应该变成24的，由于没加锁出现了数据异常

**加锁后** ：
 用户A先在ZooKeeper中创建临时有序节点假设为`/locker/node-0000000009`，创建之后会`getChildren`查看`/locker`节点下的所有子节点，如果自己的编号是最小的，说明自己是最先创建的，则获取到了锁，如果不是就等待前面的节点被自动删除(即前面的用户释放了锁)。
此时用户B也来访问，也要临时有序节点，假设为`/locker/node-00000000010`，接着`getChildren`查看`/locker`节点下的所有子节点，发现自己不是最小的，那么就会等待在这里。
 最终A和B只有一个人能成功创建节点并修改数据，
A获取到锁后开始执行业务代码，那么A将age ++后变成23了 然后数据库持久化 8888中的age就是23了 8889中还是22
 接着服务器8888和8889之间执行进行数据同步 同步成功后A关闭会话，临时节点失效，锁释放了。

此时B用户创建的节点是最小的，就获取到了锁，开始执行业务代码，去修改数据 此时获取到age=23  ++后变成了24 持久化后 再次进行8888 8889服务期间进行数据同步。
 这样就不会出现数据异常。

 问题：为什么要用临时节点，创建持久化节点然后执行完后删除不行吗？
 答：临时节点性能高



## 3. 参考

`https://blog.csdn.net/qiangcuo6087/article/details/79067136`