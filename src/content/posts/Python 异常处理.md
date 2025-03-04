---
title: Python 异常处理
published: 2025-03-02
discription: 
categories: 指南
tags: [Python]
---
*There’s no such thing as fair or unfair in battle. There is only victory or in your case, defeat.*——*Dragon Ball Z*

异常是Python对象，表示一个错误，Python无法正常处理程序时就会发生一个异常

## 异常处理

`try/except`语句用来检测 `try`语句块中的错误，从而让 `except`语句捕获异常信息并处理

但和 `elseif`语句一样，`except`语句在不需要跳转（只使用try分发）时也可以被省略

```python
try:
<语句>        #运行别的代码
except <名字>：
<语句>        #如果在try部份引发了'name'异常
except <名字>，<数据>:
<语句>        #如果引发了'name'异常，获得附加的数据
else:
<语句>        #如果没有异常发生

```

try的工作原理是，当开始一个try语句后，python就在当前程序的上下文中作标记，这样当异常出现时就可以回到这里，try子句先执行，接下来会发生什么依赖于执行时是否出现异常

* 如果当 `try`后的语句执行时发生异常，`python`就跳回到 `try`并执行第一个匹配该异常的 `except`子句，异常处理完毕，控制流就通过整个 `try`语句（除非在处理异常时又引发新的异常）。
* 如果在 `try`后的语句里发生了异常，却没有匹配的 `except`子句，异常将被递交到上层的 `try`，或者到程序的最上层（这样将结束程序，并打印默认的出错信息）。
* 如果在 `try`子句执行时没有发生异常，`python`将执行 `else`语句后的语句（如果有 `else`的话），然后控制流通过整个 `try`语句。

在执行代码前为了测试方便，我们可以先去掉 ` testfile` 文件的写权限，命令如下：

```bash
chmod -w testfile
```

再执行代码：

```bash
$ python test.py 
Error: 没有找到文件或读取文件失败
```

## except其他使用

### 使用except而带多种异常类型

```python
try:
    正常的操作
   ......................
except:
    发生异常，执行这块代码
   ......................
else:
    如果没有异常执行这块代码

```

### 使用except而带多种异常类型

```python
try:
    正常的操作
   ......................
except(Exception1[, Exception2[,...ExceptionN]]):
   发生以上多个异常中的一个，执行这块代码
   ......................
else:
    如果没有异常执行这块代码

```

### try-finally 语句

`try-finally` 语句无论是否发生异常都将执行最后的代码

```python
try:
<语句>
finally:
<语句>    #退出try时总会执行
raise

```

可以用于尝试打开文件后的关闭

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

try:
    fh = open("testfile", "w")
    try:
        fh.write("这是一个测试文件，用于测试异常!!")
    finally:
        print "关闭文件"
        fh.close()
except IOError:
    print "Error: 没有找到文件或读取文件失败"
```

## 异常的参数

通过 `except`语句来捕获异常的参数 `Argument`，当 `int(var)` 转换失败时，会抛出 `ValueError` 异常，这个异常实例被赋值给了 `Argument` 变量

```python
try:
    正常的操作
   ......................
except ExceptionType, Argument:
    你可以在这输出 Argument 的值...

```

具体使用方法如下

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

# 定义函数
def temp_convert(var):
    try:
        return int(var)
    except ValueError, Argument:
        print "参数没有包含数字\n", Argument

# 调用函数
temp_convert("xyz")
```
