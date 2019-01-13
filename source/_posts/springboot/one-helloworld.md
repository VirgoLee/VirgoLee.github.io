---
title: SpringBoot入门系列（一）之HelloWorld
tags:
  - SpringBoot
categories:
  - SpringBoot
abbrlink: 22f8f0ac
date: 2018-12-22 22:00:00
---

本文主要介绍了SpringBoot是什么、怎么使用和为什么要用SpringBoot。使用Spring boot ，可以轻松的创建独立运行的程序，非常容易构建独立的服务组件，是实现分布式架构、微服务架构利器。Spring boot简化了第三方包的引用，通过提供的starter，简化了依赖包的配置。

<!--more-->

## 1. SpringBoot介绍

**Spring boot的优点**

- 轻松创建独立的Spring应用程序。
- 内嵌Tomcat、jetty等web容器，不需要部署WAR文件。
- 提供一系列的“starter” 来简化的Maven配置。
- 开箱即用，尽可能自动配置Spring。

## 2.创建SpringBoot项目

如果使用的是IDEA则非常方便的创建SpringBoot项目，在新建项目的时候选择Spring initializr填写一些基本信息后就可以了。

 Eclipse的话就需要去官网构建。

**maven构建项目**

1、访问`http://start.spring.io/`

2、选择构建工具Maven Project、Spring Boot版本等一些工程基本信息

3、点击Generate Project下载项目压缩包

4、解压后，使用eclipse，Import -> Existing Maven Projects -> Next ->选择解压后的文件夹-> Finsh，OK！

### 2. controller

@SpringBootApplication 

SpringBoot启动类注解

### 3 hello

```java
@Controller
public class HelloController {
    @RequestMapping("/gethello")
    @ResponseBody
    public Map<String, Object> getHello() {
        Map<String, Object> map = new HashMap<>();
        map.put("msg", "hello");
        return map;
    }
}
```

## 3. 整合Servlet

### 3.1 方式一 扫描注解注册Servlet

```java
@WebServlet(name = "FirstServlet",urlPatterns = "/first")
public class FirstServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doGet(req, resp);
    }
}
```

**@WebServlet(name = "FirstServlet",urlPatterns = "/first") 相当于web.xml中的以下配置**

```xml
<servlet>
      <servlet-name>FirstServlet</servlet-name>
      <servlet-class>com.demo.FirstServlet</servlet-class>
  </servlet>
  <servlet-mapping>
      <servlet-name>FirstServlet</servlet-name>
      <url-pattern>/firse</url-pattern>
  </servlet-mapping>
```

**@ServletComponentScan  让SpringBoot在启动时扫描@WebServlet注解**

```Java
@SpringBootApplication
@ServletComponentScan
public class HelloApplication {

    public static void main(String[] args) {
        SpringApplication.run(HelloApplication.class, args);
    }

}
```

### 3.2 方式二 通过方法注册Servlet

该方式 创建servlet后不用任何注解，直接在启动器中注册servlet

```java
@SpringBootApplication
public class app {
    public static void main(String[] args) {
        SpringApplication.run(app.class, args);
    }
    
    @Bean
    public ServletRegistrationBean Register(){
        ServletRegistrationBean bean=new ServletRegistrationBean(new FirstServlet());
        bean.addUrlMappings("/first");
        return bean;
    }
}
```

## 4. 整合Filter

### 4.1 方式一 扫描注解注册Filter

```
@WebFilter(filterName = "firstFilter",urlPatterns ="/first")
public class FirstFilter implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("进入Filter");
        filterChain.doFilter(servletRequest,servletResponse);
        System.out.println("放行Filter");
    }
}
```

**@WebFilter(filterName = "firstFilter",urlPatterns ="/first")**

### 4.2 方式二 通过方法注册Servlet

```
@Bean
public FilterRegistrationBean RegisterFilter() {
    FilterRegistrationBean bean = new FilterRegistrationBean<>(new FirstFilter());
    bean.addUrlPatterns("/first");
    return bean;
}
```



## 5. 整合Listener

### 5.1 方式一 扫描注解注册Listener

```java
@WebListener
public class FirstListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        
    }
}
```

**@WebListener**

### 5.2 方式二 通过方法注册Listener

```java
@Bean
public ServletListenerRegistrationBean<FirstListener> registerListener() {
    ServletListenerRegistrationBean<FirstListener> bean = new 		             ServletListenerRegistrationBean<>(new FirstListener());
    return bean;
}
```

## 6. 访问静态资源

**1.从classpath/static目录下（名称必须是static）**

2.ServletContext根目录下

**src/main/webapp(名称必须是webapp)**

访问路径：localhost:8080/filename

## 7.文件上传

#### 页面

```html
<body>
<form action="fileuploadController" method="post" enctype="multipart/form-data">
    上传文件<input type="file" name="filename"><br>
    <input type="submit" value="上传">
</form>
</body>
```

#### controller

```java
//@Controller
@RestController //对方法返回值会自动做json格式转换 不用@responseBody了
public class fileuploadController {
    @RequestMapping("/fileuploadController")
    public Map<String,Object> fileUpload(MultipartFile filename) throws IOException {
        System.out.println(filename.getOriginalFilename());
        filename.transferTo(new File("e:/"+filename.getOriginalFilename()));
        Map<String,Object> map=new HashMap<>();
        map.put("msg","ok");
        return map;
    }
}

```

#### 文件大小限制

application.properties

```properties
spring.servlet.multipart.max-request-size=200MB
spring.servlet.multipart.max-file-size=200MB
```



## 8.总结

### 8.1注解方式

- **Servlet**   @WebServlet(name = "FirstServlet",urlPatterns = "/first")
- **Filter**       @WebFilter(filterName = "firstFilter",urlPatterns ="/first")
- **Listener** @WebListener
- 启动器     @ServletComponentScan

### 8.2 方法注册

不用加注解

```java
//---------Servlet------------------   
@Bean
    public ServletRegistrationBean Register(){
        ServletRegistrationBean bean=new ServletRegistrationBean(new FirstServlet());
        bean.addUrlMappings("/first");
        return bean;
    }
//---------Filter------------------   
@Bean
public FilterRegistrationBean RegisterFilter() {
    FilterRegistrationBean bean = new FilterRegistrationBean<>(new FirstFilter());
    bean.addUrlPatterns("/first");
    return bean;
}
//---------Linster------------------  
@Bean
public ServletListenerRegistrationBean<FirstListener> registerListener() {
    ServletListenerRegistrationBean<FirstListener> bean = new 		             ServletListenerRegistrationBean<>(new FirstListener());
    return bean;
}
```



