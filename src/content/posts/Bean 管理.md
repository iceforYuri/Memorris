---
title: Bean 管理
published: 2025-09-03
description: Bean
category: 指南
tags: [('Java', 'Spring')]
---

# 获取bean

默认情况下，Spring项目启动时，会把bean都创建好放在IOC容器中，如果想要主动获取这些bean，可以通过如下方式：

- 根据name获取bean：`Object getBean(String name)`
- 根据类型获取bean：`<T> T getBean(Class<T> requiredType)`
- 根据name获取bean（带类型转换）：`<T> T getBean(String name, Class<T> requiredType)`

注意：

> 上述所说的【Spring项目启动时，会把其中的bean都创建好】还会受到作用域及延迟初始化影响，这里主要针对于 默认的单例非延迟加载的bean而言。


# bean作用域


Spring支持五种作用域，后三种在web环境才生效：

| 作用域          | 说明                                             |
| --------------- | ------------------------------------------------ |
| `singleton`   | 容器内同名称的 bean 只有一个实例（单例）（默认） |
| `prototype`   | 每次使用该 bean 时会创建新的实例（非单例）       |
| `request`     | 每个请求范围内会创建新的实例（web环境中，了解）  |
| `session`     | 每个会话范围内会创建新的实例（web环境中，了解）  |
| `application` | 每个应用范围内会创建新的实例（web环境中，了解）  |



在运行/测试单元中使用 `@Scope("[作用域]")`作为声明：

```java
@Scope("prototype")
@RestController
@RequestMapping("/depts")
public class DeptController {
}
```

### 注意事项

- 默认 `singleton` 的 bean，在容器启动时被创建，可以使用 `@Lazy` 注解来延迟初始化（延迟到第一次使用时）。
- `prototype` 的 bean，每一次使用该 bean 的时候都会创建一个新的实例。
- 实际开发当中，绝大部分的 Bean 是单例的，也就是说绝大部分 Bean 不需要配置 `scope` 属性。

### @Lazy延迟初始化

知道第一次使用时才创建bean对象




# 第三方bean

## `@Bean`

* 如果要管理的bean对象来自于第三方（不是自定义的），是无法用 `@Component` 及衍生注解声明bean的，就需要用到 `@Bean` 注解。
* 若要管理的第三方 bean 对象，建议对这些 bean 进行集中分类配置，可以通过 `@Configuration` 注解声明一个配置类。

```java
@SpringBootApplication
public class SpringbootWebConfig2Application {
    @Bean // 将方法返回值交给IOC容器管理，成为IOC容器的bean对象
    public SAXReader saxReader(){
        return new SAXReader();
    }
}
```

但是其实在开发中并不建议在启动类中使用第三方bean

```java
@Configuration // 配置类
public class CommonConfig {

    // 声明第三方bean
    @Bean // 将当前方法的返回值对象交给IOC容器管理，成为IOC容器bean
          // 通过@Bean注解的name/value属性指定Bean名称，如果未指定，默认是方法名
    public SAXReader saxReader() {
        return new SAXReader();
    }
}
```

在方法中声明比较正确
