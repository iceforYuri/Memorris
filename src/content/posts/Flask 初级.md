---
title: Flask 初级
published: 2025-03-02
discription: python下的web框架
categories: 指南
tags: [Flask]
---
*Power isn't determined by your size, but the size of your heart and dreams!*——*One Piece*

# Flask 基本知识

### 创建一个Flask 应用

创建一个基本的flask模板如下：

```python
from flask import Flask

app = Flask(__name__)


if __name__ == '__main__':
    app.run(debug = True)
```

`app = Flask(__name__)` :这行代码创建了一个Flask应用实例。其中传入的参数 `__name__` 是python中的一个特殊变量。

若要修改Flask监听的ip地址和端口号，可以在app.run()中传入如下参数：

```python
app.run(debug=True,host='0.0.0.0',port=8000)
```

#### `__name__`变量以及Flask()参数的作用

`__name__` 变量是python中的一个内置变量，与java相似

* 当python解释器直接运行一个模块时，如 `python my_program.py` 时，模块的 `__name__`变量会被设置为字符串：”`__main__`“
* 当一个模块被其他模块导入时，如 `import my_program`，该模块的 `__name__` 变量会被设置为该模块的文件名(不包含.py后缀)，例如：“`my_program`”

#### `__name__`传入Flask()的作用

Flask() 使用 `__name__` 变量来确定应用的跟路径，从而能够找到应用相关资源的位置。

这意味着：

* Flask 应用的根目录是以**创建 Flask 实例的模块所在的目录**为基准的，而不是以当前工作目录为基准
* 即便你从另一个目录启动 Flask 应用，根路径仍然是创建 Flask 实例的模块所在位置

假设有以下模块基本架构：

```stata
myproject/
│
├── app/
│   ├── __init__.py          # 创建应用实例，注册蓝图
│   ├── models/              # 数据模型
│   │   └── __init__.py
│   │
│   ├── static/              # 静态文件(CSS, JS等)
│   │
│   ├── templates/           # HTML模板
│   │   ├── main/           # main蓝图的模板
│   │   └── admin/          # admin蓝图的模板
│   │
│   └── views/              # 视图函数/蓝图
│       ├── __init__.py
│       ├── main.py         # 主要功能蓝图
│       └── admin.py        # 管理功能蓝图
│
├── config.py               # 配置文件
└── run.py                  # 应用入口
```


如果在 [`__init__.py`](vscode-file://vscode-app/c:/Users/XXY/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) 中使用 `app = Flask(__name__)`，则：

* 应用的根路径将是 `/project/app/`
* 模板将从 `/project/app/templates/` 查找
* 静态文件将从 `/project/app/static/` 查找

即使你从 `/project/` 目录运行 `python run.py`，根路径仍然是 `/project/app/`。

## 请求request和响应response

```
from flask import Flask, request, Response
```


#### 请求对象的主要属性和方法

* 请求方法和URL
  * `request.method` - 获取 HTTP 请求方法（GET, POST, PUT, DELETE 等）
  * `request.url` - 完整的请求 URL
  * `request.path` - URL 路径部分
  * `request.base_url` - URL 不带查询参数的部分
  * `request.host_url` - 只含有主机和协议的 URL 部分
* 获取请求数据
  * `request.args` - 获取 URL 查询参数（例如 `?key=value` 部分）
  * `request.form` - 获取表单数据（POST 或 PUT 请求提交的表单）
  * `request.values` - 结合了 `args` 和 `form` 数据
  * `request.files` - 获取上传的文件
  * `request.json` - 获取 JSON 格式的请求主体（当请求头 Content-Type 为 application/json）
  * `request.data` - 原始请求数据，适用于其他内容类型
* 请求头和Cookies
  * `request.headers` - 获取所有请求头
  * `request.cookies` - 获取请求中的 Cookie
* 其他常用属性
  * `request.environ` - 原始 WSGI 环境
  * `request.is_secure` - 检查是否是 HTTPS 请求
  * `request.is_xhr` - 检查是否是 AJAX 请求（XMLHttpRequest）
  * `request.remote_addr` - 客户端 IP 地址

通过创建一个空字典准备储存请求信息，我们可以获取以下的Get信息

```python
from flask import Flask, request
import json

app = Flask(__name__)

@app.route('/')
def hello_world():
    # 创建一个字典存储请求信息
    request_info = {}
    request_info['method'] = request.method
    request_info['url'] = request.url
    request_info['base_url'] = request.base_url
    request_info['path'] = request.path
    request_info['args'] = request.args.to_dict()
    request_info['request.remote_addr'] = request.remote_addr
    return json.dumps(request_info)

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=8000)
```

此时访问终端给出的 `127.0.0.0.0:8000`或者本地ipv4地址，有类似以下html信息

```json
{
    "method": "GET",
    "url": "http://10.29.242.80:8000/?key=123456", 
    "base_url": "http://10.29.242.80:8000/", 
    "path": "/", 
    "args": {"key": "123456"}, 
    "request.remote_addr": "10.29.242.80"
}
```

我们可以通过改变返回类型调整输出

```python
from flask import jsonify	# 注意引头文件

return json.dumps(request_info) , 200, {'Content-Type': 'application/json'}
return jsonify(data)
```


#### 使用Response 对象

首先需要从flask中导入response对象：

```python
from flask import Flask, Response
```

使用Response手动创建响应对象：

```python
@app.route('/custom')
def custom_response():
    content = "<h1>自定义响应</h1>"
    response = Response(
        response=content,    #响应体
        status=200,    #响应状态码
        mimetype="text/html"    #响应类型
    )
    encoded_value = base64.b64encode("自定义头部值".encode('utf-8')).decode('ascii')
    response.headers["Custom-Header"] = f"=?utf-8?b?{encoded_value}?="
    return response
```

不过其中不允许使用中文的utf-8解码，转化成了ascii之后才能正常显示

## 模板

Flask 使用 Jinja2 模板引擎来渲染 HTML 模板。模板允许你将 Python 代码嵌入到 HTML 中，从而动态生成网页。

#### Flask动态参数路由

Flask支持将url中的部分内容当作动态参数传递给调用的视图函数，如之前文件下载中的路由路径：

```python
@app.route('/downloads/<filename>')
```

其中的 `<filename>` 就是一个动态参数，当用户访问：`/downloads/xxx.png` 时，就会将 `xxx.png` 作为参数 `filename`传递给调用的视图函数。

如果指定其他参数时，相对于对输入的目录样式做了一个过滤，只能访问相同类型目录下的内容（调用视图函数）

例如有如下两个路由：

```python
@app.route('/user/<int:user_id>')   # 只匹配整数
```

```python
@app.route('/user/<string:user_name>')  # 只匹配字符串
```


当我们访问路径 `/user/123456` 时，会调用第一个路由

当我们访问路径 `/user/username` 时，会调用第二个路由

#### Jinja2语法

由于html允许使用双大括号来在文本中嵌入变量的值：

```html
<p>用户名: {{ username }}</p>
<p>年龄: {{ age }}</p>
```

因此我们可以通过普通的传参将输入的目录转换成内部字符串

```python
@app.route('/user/<string:user_name>')  # 只匹配字符串
def show_user_name(user_name):
    return f'User name is {user_name}'
```


## 蓝图

蓝图（Blueprint）是 Flask 提供的一种组织更大型 Flask 应用的方式，允许你将应用按照功能划分为多个组件或者模块。蓝图可以被视为是应用的子应用，但不是真正独立的应用，它们依赖于应用实例来进行注册。

上面的传入部分有基本的蓝图项目结构，之后也会复述，这里不再细讲


## Flask中的静态文件

静态文件是指不需要动态生成的内容，如 CSS 样式表、JavaScript 脚本、图片、字体等资源。Flask 提供了一种简单的方式来处理和提供这些静态文件。

### 静态文件存储位置

```
/your_app/
  ├── app.py
  └── static/
      ├── css/
      │   └── style.css
      ├── js/
      │   └── script.js
      └── images/
          └── logo.png
```

静态文件统一存放在Flask应用目录下的static目录下，可以再使用文件夹对各种静态文件进行分类，也可以直接放在static文件夹下。

#### url_for()函数

url_for()函数可以根据访问连接动态生成URL。它接受视图函数的名称及任何相关参数，并返回相应的 URL 路径。这个函数是 Flask URL 路由系统的重要组成部分，提供了许多优势和灵活性。

主要参数：

* **第一个参数** ：目标端点名（视图函数的名称/static等）
* **关键字参数** (根据视图函数自定)：路由中的动态部分或查询参数
* **_external=True** ：生成包含完整域名的绝对 URL
* **_scheme** ：指定 URL 协议（如 ‘https’）
* **_anchor** ：添加 URL 片段标识符（锚点）

##### 通过url_for函数访问静态文件

在模板或代码中，推荐使用url_for()函数生成静态文件的url：

```html
<!-- 在 HTML 模板中 -->
<link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
<script src="{{ url_for('static', filename='js/script.js') }}"></script>
<img src="{{ url_for('static', filename='images/logo.png') }}" alt="Logo">
```

```python
# 在 Python 代码中
from flask import url_for

css_url = url_for('static', filename='css/style.css')
```
