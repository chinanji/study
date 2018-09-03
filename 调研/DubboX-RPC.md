# RPC框架-DubboX介绍

* [什么是远程过程调用](#1)  
* [RPC框架](#2)  
* [如何发布自己的服务](#3)  
* [RPC框架选美](#4)  
* [DubboX介绍](#5)  
* [Dubbo与Spring方便集成](#6)  
* [Dubbo一个示例](#7)  

---

## <span id="1">什么是RPC</span>

##### 本地调用
写hello world服务类，然后本地调用

##### 远程过程调用
<small>
两个问题：
1）要搭建一个新服务，免不了需要依赖他人的服务，而现在他人的服务都在远端，怎么调用？
2）我们的服务该怎么发布以便他人调用？


</small>

## <span id="2">RPC框架</span>
![](./img/targetRPC.jpg)

RPC框架底层：
![](./img/rpc-procedure.png)

## <span id="3">如何发布自己的服务</span>
```
1. 人肉告知的方式:负载均衡?服务的管理？
2. 自动告知：增添、剔除对调用方透明，调用者不再需要写死服务提供方地址。zookeeper
```

![](./img/522490-20151003183747543-2138843838.png)

<small>
zookeeper可以充当一个服务注册表（Service Registry），让多个服务提供者形成一个集群，让服务消费者通过服务注册表获取具体的服务访问地址（ip+端口）去访问具体的服务提供者。

zookeeper提供了`心跳检测`功能，它会定时向各个服务提供者发送一个请求（实际上建立的是一个 Socket 长连接），如果长期没有响应，服务中心就认为该服务提供者已经“挂了”，并将其剔除，比如100.19.20.02这台机器如果宕机了，那么zookeeper上的路径就会只剩/HelloWorldService/1.0.0/100.19.20.01:16888。

服务消费者会去监听相应路径（/HelloWorldService/1.0.0），一旦路径上的数据有任务变化（增加或减少），zookeeper都会通知服务消费方服务提供者地址列表已经发生改变，从而进行更新。

更为重要的是zookeeper与生俱来的容错容灾能力（比如leader选举），可以确保服务注册表的高可用性。
</small>

### 服务提供方和服务消费方之间的调用关系

![](./img/dubbo-relation.png)

## <span id="4">RPC框架选美</span>

- gRPC是Google最近公布的开源软件
- Thrift由 Facebook 开源的一个 RPC 框架
- Dubbo是阿里集团开源的一个分布式服务框架
- DubboX是当当网对原阿里dubbo2.x的升级
- Motan 新浪开源支撑微博千亿调用的轻量级 RPC 框架 

<small>
淘宝将这个项目开源出来以后，得到了不少同行的支持，包括： 
当当网的扩展版本dubbox：https://github.com/dangdangdotcom/dubbox 京东的扩展版本jd-hydra: http://www.oschina.net/p/jd-hydra 
不过，略有遗憾的是，据说在淘宝内部，dubbo由于跟淘宝另一个类似的框架HSF（非开源）有竞争关系，导致**dubbo团队已经解散**（参见
http://www.oschina.net/news/55059/druid-1-0-9 中的评论），反到是当当网的扩展版本仍在持续发展，墙内开花墙外香。
</small>

![](./img/rpc-better.jpg)

## <span id="5">DubboX介绍</span>
当当根据自身的需求，为Dubbo实现了一些新的功能，包括REST风格远程调用、Kryo/FST序列化等等。并将其命名为Dubbox（即Dubbo eXtensions）。Dubbox主要的新功能包括：

##### 一、支持REST风格远程调用（HTTP + JSON/XML)

<small>
dubbo支持多种远程调用方式，例如dubbo RPC（二进制序列化 + tcp协议）、http invoker（二进制序列化 + http协议，至少在开源版本没发现对文本序列化的支持）、hessian（二进制序列化 + http协议）、WebServices （文本序列化 + http协议）等等，但缺乏对当今特别流行的REST风格远程调用（文本序列化 + http协议）的支持。

在dubbo中支持REST，可以为当今多数主流的远程调用场景都带来好处：

1. 显著简化企业内部的异构系统之间的（跨语言）调用。此处主要针对这种场景：dubbo的系统做服务提供端，其他语言的系统（也包括某些不基于 dubbo的java系统）做服务消费端，两者通过HTTP和文本消息进行通信。即使相比Thrift、ProtoBuf等二进制跨语言调用方 案，REST也有自己独特的优势（详见后面讨论）.  
2. 显著简化对外Open API（开放平台）的开发。既可以用dubbo来开发专门的Open API应用，也可以将原内部使用的dubbo service直接“透明”发布为对外的Open REST API（当然dubbo本身未来最好可以较透明的提供诸如权限控制、频次控制、计费等诸多功能）  
3. 方便服务检测，服务治理的介入。

</small>

![](./img/20141201173407_584.png)

##### 二、支持基于Kryo和FST的Java高效序列化实现
<small>
在dubbo RPC中，同时支持多种序列化方式，例如：

dubbo序列化：阿里尚未开发成熟的高效java序列化实现，阿里不建议在生产环境使用它  
hessian2序列化：hessian是一种跨语言的高效二进制序列化方式。但这里实际不是原生的hessian2序列化，而是阿里修改过的hessian lite，它是dubbo RPC默认启用的序列化方式  
json序列化：目前有两种实现，一种是采用的阿里的fastjson库，另一种是采用dubbo中自己实现的简单json库，但其实现都不是特别成熟，而且json这种文本序列化性能一般不如上面两种二进制序列化。  
java序列化：主要是采用JDK自带的Java序列化实现，性能很不理想。  

在通常情况下，这四种主要序列化方式的性能从上到下依次递减。对于dubbo RPC这种追求高性能的远程调用方式来说，实际上只有1、2两种高效序列化方式比较般配，而第1个dubbo序列化由于还不成熟，所以实际只剩下2可用， 所以dubbo RPC默认采用hessian2序列化。但hessian是一个比较老的序列化实现了，而且它是跨语言的，所以不是单独针对java进行优化的。而 dubbo RPC实际上完全是一种Java to Java的远程调用，其实没有必要采用跨语言的序列化方式（当然肯定也不排斥跨语言的序列化）。
</small>

性能测试：
![](./img/rt1.png)
![](./img/tps.png)

一点简单总结：
<small>

- dubbo RPC（特别是基于高效java序列化方式如kryo，fst）比REST的响应时间和吞吐量都有较显著优势，内网的dubbo系统之间优先选择dubbo RPC。
- 在 REST的实现选择上，仅就性能而言，目前tomcat7和netty最优（当然目前使用的jetty和netty版本都较低）。tjws和sun http server在性能测试中表现极差，平均响应时间超过200ms，平均tps只有50左右（为了避免影响图片效果，没在上面列出）。
- 在REST中JSON数据格式性能优于XML（数据暂未在以上列出）。
- 在REST中启用GZIP对企业内网中的小数据量复杂对象帮助不大，性能反而有下降（数据暂未在以上列出）。

</small>

## <span id="6">Dubbo与Spring方便集成</span>

1. provider示例 pplicationContext-dubbo-provider.xml
```
    <!-- 具体的实现bean -->
    <bean id="demoService" class="com.unj.dubbotest.provider.impl.DemoServiceImpl" />

    <!-- 提供方应用信息，用于计算依赖关系 -->
    <dubbo:application name="xixi_provider" />

    <!-- 使用zookeeper注册中心暴露服务地址 -->
    <dubbo:registry address="zookeeper://localhost:2181" />

    <!-- 用dubbo协议在20880端口暴露服务 -->
    <dubbo:protocol name="dubbo" port="20880" />

    <!-- 声明需要暴露的服务接口 -->
    <dubbo:service interface="com.unj.dubbotest.provider.DemoService"
        ref="demoService" />
```

2. consumer示例：applicationContext-dubbo-consumer.xml
```
    <!-- 消费方应用名，用于计算依赖关系，不是匹配条件，不要与提供方一样 -->
    <dubbo:application name="hehe_consumer" />

    <!-- 使用zookeeper注册中心暴露服务地址 -->
    <dubbo:registry address="zookeeper://10.13.18.121:2181" />

    <!-- 生成远程服务代理，可以像使用本地bean一样使用demoService -->
    <dubbo:reference id="demoService"
        interface="com.unj.dubbotest.provider.DemoService" />
```



## <span id="7">Dubbo一个示例</span>
http://shiyanjun.cn/archives/341.html


## <span id="8">虐你千百遍的问题</span>

### 1.RPC好，还是RESTful好？
这两种风格都是随着架构发展而来。分别适用不同的场景。

##### http vs 高性能二进制协议

http相对更规范，更标准，更通用，无论哪种语言都支持http协议。如果你是对外开放API，例如开放平台，外部的编程语言多种多样，你无法拒绝对每种语言的支持，相应的，如果采用http，无疑在你实现SDK之前，支持了所有语言，所以，现在开源中间件，基本最先支持的几个协议都包含RESTful。

RPC协议性能要高的多，例如Protobuf、Thrift、Kyro等，（如果算上序列化）吞吐量大概能达到http的二倍。响应时间也更为出色。举个例子，做微服务的很多厂商，都传出过为了提升性能而合并服务。

##### 最后建议
对外开放给全世界的API推荐采用RESTful，内部调用推荐采用RPC方式。

### 2.RPC好，还是MQ好？
##### 系统结构

```
RPC系统结构：
+----------+     +----------+
| Consumer | <=> | Provider |
+----------+     +----------+
Consumer调用的Provider提供的服务。


Message Queue系统结构：

+--------+     +-------+     +----------+
| Sender | <=> | Queue | <=> | Receiver |
+--------+     +-------+     +----------+
Sender发送消息给Queue；Receiver从Queue拿到消息来处理。

Message有一个中间结点Message Queue，可以把消息存储。
```

##### 差异
```
消息的特点:
1. Message Queue把请求的压力保存一下，逐渐释放出来，让处理者按照自己的节奏来处理。
2. Message Queue是异步单向的消息。发送消息设计成是不需要等待消息处理的完成。

PRC的特点:
1. 同步调用，对于要等待返回结果/处理结果的场景，RPC是可以非常自然直觉的使用方式。
2. 由于等待结果，Consumer（Client）会有线程消耗。
```

##### 适用场合说明
```
1. 希望同步得到结果的场合，RPC合适。
2. 希望使用简单，则RPC；RPC操作基于接口，使用简单，使用方式模拟本地调用。异步的方式编程比较复杂。
3. 不希望发送端受限于处理端的速度时，使用Message Queue。
```

##### 总结
这两个本身就不是一个层面的东西，RPC是分布式服务之间调用的一种解决方案， 消息系统更多是我们为了解决系统之间的解耦，以及性能问题等方面所考虑的方案！ 


### 3.SOA和RPC的差别？

SOAP和RPC是SOA的具体实现方式。

1. SOAP是基于HTTP和XML的实现，因此会更容易做业务隔离，在系统可维护性和可扩展性上优于RPC。

2. 而RPC是基于TCP或自定义协议的实现，性能会略好于SOAP，但是异构系统间的耦合度会更高，间接增加系统的故障率和排错难度。



### 4.SOA和微服务的差别？

| SOA |  微服务架构 |  
|:----- |:-------|
|企业级，自顶向下开展实施 |团队级，自底向上开展实施  |
|服务由多个子系统组成，粒度大 |一个系统被拆分成多个服务，粒度细  |
|企业服务总线，集中式的服务架构 |无集中式总线，松散的服务架构  |
|集成方式复杂（ESB/WS/SOAP） |集成方式简单（HTTP/REST/JSON）  |


![](./img/soa.png)



