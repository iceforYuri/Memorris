---
title: Flask 表单处理
published: 2025-03-06
discription: 处理表单数据涉及到接收、验证和处理用户提交的表单
category: 指南
tags: [Flask]
---
*Raise your head, Wabisuke.*——*Bleach*

## 创建表单

首先在templates/form.html创建html文件类似以下：

```html
<!DOCTYPE html>
<html>
<head>
    <title>Form Example</title>
</head>
<body>
    <form action="/submit" method="post">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name">
        <br>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email">
        <br>
        <input type="submit" value="Submit">
    </form>
</body>
</html>
```

**action="/submit"**：表单数据提交到 /submit 路径（这里似乎代指路由的路径：这行代码中的 `/submit` 表示表单数据将被提交到服务器上的 `/submit` 路径）

**method="post"**：使用 POST 方法提交数据。

### 处理表单

```python
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def form():
    return render_template('form.html')

@app.route('/submit', methods=['POST'])	#设置form提交数据的路由
def submit():
    name = request.form.get('name') #这里填入参数对应html中的name属性
    email = request.form.get('email')#这里填入参数对应html中的name属性
    return f'Name: {name}, Email: {email}'  #提交表单后自动跳转到/submit路径

if __name__ == '__main__':
    app.run(debug=True)
```

提交表单后，浏览器会自动跳转到 `/submit`路径，同时触发 `submit`视图函数。若不需要让用户看自己提交的数据，可以使用重定向回到主页，或者你需要的位置

```python
@app.route('/submit', methods=['POST'])	#设置form提交数据的路由
def submit():
    name = request.form.get('name') #这里填入参数对应html中的name属性
    email = request.form.get('email')#这里填入参数对应html中的name属性
    return redirect(url_for('/'))	#重定向到首页
```

## 文件上传

```html
<!DOCTYPE html>
<html>
<head>
    <title>Upload File</title>
</head>
<body>
    <form action="/upload" method="post" enctype="multipart/form-data">
        <label for="file">File:</label>
        <input type="file" id="file" name="file">
        <br>
        <input type="submit" value="Upload">
    </form>
</body>
</html>
```

* `enctype="multipart/form-data"`:表示不对字符编码，用于文件上传
  * `application/x-www-form-urlencoded`（默认值）- 所有字符会被编码

```python
from flask import Flask, request, redirect, url_for,render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('upload.html')

@app.route('/upload', methods=['POST'])
def upload():
    try:
        file = request.files['file']  # 直接访问，如果不存在会抛出异常
        filename = file.filename
        if filename:  # 检查文件名是否为空
            file.save(f'app/uploads/{filename}')
            return f'File uploaded successfully: {filename}'
        else:
            return 'Empty filename not allowed'
    except KeyError:  # 当 'file' 不在 request.files 中时触发
        return 'No file uploaded'
    except Exception as e:  # 捕获其他可能的异常
        return f'Error uploading file: {str(e)}'

if __name__ == '__main__':
    app.run(debug=True)


```
