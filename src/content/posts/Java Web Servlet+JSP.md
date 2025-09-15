---
title: Java Web Servlet+JSP
published: 2025-08-02
description: Java Web Servlet+JSP 是 Java EE 技术栈中的重要组成部分，主要用于开发动态网页和 Web 应用程序。Servlet 是运行在服务器端的 Java 类，用于处理 HTTP 请求和响应，而 JSP（JavaServer Pages）则允许开发者使用 HTML 和 Java 代码混合编写动态网页。通过这些技术，开发者可以创建交互式、数据驱动的 Web 应用程序。
category: 指南
tags: [Java Web]
---
详细内容可见这一篇文章，博主在此就不献丑了（主要还是回来敲文字太麻烦）

[java-Web基础之Servlet、Filter、Listener](https://blog.ulna520.top/2025/05/19/java-Web%E5%9F%BA%E7%A1%80_20250519_165356/)

# Maven构建

Java中的Servlet，Filter，Listener等组件需要一定的依赖，所以我们需要在构建工具中进行演示和学习。本文使用Maven项目作为示例。

## 文件项目结构

我们可以通过IDEA直接构建一个Java的maven项目，选择好版本后可直接创建：

![1754369072292](image/JavaWebServlet+JSP/1754369072292.png)

类似这样即可，获得一个初始化的项目

但此时的pom.xml还很简陋，后续我们还需要添加一些依赖：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>servlet-lifecycle-demo</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <dependencies>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version> <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <finalName>servlet-lifecycle-demo</finalName>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>3.3.1</version>
            </plugin>
        </plugins>
    </build>
</project>
```

# Servlet

Servlet 是JavaWeb技术的核心组件，本质上就是运行在服务器端的小程序，用于处理客户端(如浏览器)的请求，生成动态响应。Servlet主要用于处理Http请求，实现动态网页内容生成。

## Servlet 生命周期

Servlet的生命周期由Servlet容器(如Tomcat)管理，主要有以下几个阶段：

> Servlet容器：Web服务器，用于接收HTTP请求并调用你写的Servlet 代码处理请求

### 初始化 `init()`

* 在Servlet第一次被访问时，容器会创建一个Servlet实例，然后调用它的 `init()`方法。
* 通常用来做资源的初始化操作、比如数据库连接、读取配置文件等。

```java
@Override
public void init() throws ServletException {
    System.out.println("Servlet 初始化：init()");
}
```

### 请求处理 `service()`

* 每次有客户端请求Servlet，Tomcat就会调用Servlet实例的 `service()` 方法
* `service()<span> </span>`实例会自动判断请求类型(GET/POST)，然后分发给对应的doGet() 或 doPost()

```java
@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    resp.getWriter().write("处理 GET 请求");
}

@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    resp.getWriter().write("处理 POST 请求");
}

```

### 销毁 `destroy()`

* 当Tomcat关闭、或Servlet被卸载(如热更新时)，容器会调用 `destroy()`方法
* 通常用来释放资源，如关闭数据库连接，停止线程等。

```java
@Override
public void destroy() {
    System.out.println("Servlet 被销毁：destroy()");
}
```

# Interceptor

![1756614042993](image/JavaWebServlet+JSP/1756614042993.png)

配置类：在这里注册并定义拦截路径

![1756614070967](image/JavaWebServlet+JSP/1756614070967.png)

![1756617578190](image/JavaWebServlet+JSP/1756617578190.png)

![1756617904807](image/JavaWebServlet+JSP/1756617904807.png)

```
FirstFilter: Before processing request
LoginCheckInterceptor preHandle
2025-08-31T13:24:17.509+08:00  INFO 5732 --- [Mybatis_test] [nio-8080-exec-5] o.e.m.controller.DeptController          : 查询所有部门信息
Creating a new SqlSession
SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@25bd2d79] was not registered for synchronization because synchronization is not active
2025-08-31T13:24:17.524+08:00  INFO 5732 --- [Mybatis_test] [nio-8080-exec-5] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2025-08-31T13:24:17.795+08:00  INFO 5732 --- [Mybatis_test] [nio-8080-exec-5] com.zaxxer.hikari.pool.HikariPool        : HikariPool-1 - Added connection com.mysql.cj.jdbc.ConnectionImpl@1616aaa
2025-08-31T13:24:17.797+08:00  INFO 5732 --- [Mybatis_test] [nio-8080-exec-5] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
JDBC Connection [HikariProxyConnection@317416479 wrapping com.mysql.cj.jdbc.ConnectionImpl@1616aaa] will not be managed by Spring
==>  Preparing: SELECT * FROM dept
==> Parameters: 
<==    Columns: id, name, create_time, update_time
<==        Row: 1, 教务部, 2025-08-29 21:48:15, 2025-08-29 21:48:15
<==        Row: 2, 教研部, 2025-08-27 09:58:41, 2025-08-27 09:58:41
<==        Row: 3, 工作部, 2025-08-29 09:18:50, 2025-08-29 09:18:51
<==        Row: 4, 财务部, 2025-08-29 21:48:15, 2025-08-29 21:48:15
<==        Row: 5, 人力资源部, 2025-08-29 21:48:15, 2025-08-29 21:48:15
<==        Row: 6, 市场部, 2025-08-29 21:48:15, 2025-08-29 21:48:15
<==        Row: 7, 研发部, 2025-08-29 21:48:15, 2025-08-29 21:48:15
<==      Total: 7
Closing non transactional SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@25bd2d79]
LoginCheckInterceptor postHandle
LoginCheckInterceptor afterCompletion
FirstFilter: After processing request

```
