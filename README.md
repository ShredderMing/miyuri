# Miyuri（みゆり）

[![npm version](https://img.shields.io/npm/v/miyuri.svg?style=flat)](https://www.npmjs.com/package/miyuri)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

## 安装

**npm**
``` sh
npm install miyuri
```
**yarn**
``` sh
yarn add miyuri
```

## 用法

``` js
import { h, Component } from 'preact';
import Image from 'miyuri';

export default ExamplePage extends Component {
  render() {
    return (
	  <ul>
	    <li><Image src="1.jpg" placeholder="1.svg" /></li>
		<li><Image src="2.jpg" placeholder="2.svg" /></li>
		<li><Image src="3.jpg" placeholder="3.svg" /></li>
		// ...
	  </ul>
    );
  }
}
```

## 属性

| 属性        | 描述                                                                                      |
|-------------|-------------------------------------------------------------------------------------------|
| `src`         | 图片链接                                                                                  |
| `placeholder` | 如果是`string`那么使用 `<img src={placeholder} />`  作为placeholder，否则使用 `<placeholder />` |
| `errorholder` | 如果是`string`那么使用 `<img src={errorholder} />` 作为errorholder，否则使用 `<errorholder />` |

## 其它

### 原理

使用`IntersectionObserver`实现。
- [**MDN**](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [**阮一峰老师的文章**](http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html)
- [**Polyfill**](https://github.com/w3c/IntersectionObserver/tree/master/polyfill)

### 为什么不用fetch

- 如果需要跨域的话需要图片服务器设置
- blob对象作为src的值在保存图片时文件名不友好

### 关于placeholder

可以使用[**SQIP**](https://github.com/technopagan/sqip)创建placeholder
#### ArchLinux上安装SQIP

``` sh
# 1.安装go
~$ yaourt -S go go-tools
# 2.设置环境变量（如果使用fish）
~$ vim .config/fish/config.fish # 添加：set -gx PATH /home/用户名/go/bin $PATH
# 3.安装primitive
~$ go get -u github.com/fogleman/primitive
# 4.安装SQIP
~$ npm i -g sqip

```

### 图片服务器

- [**cloudinary**](https://cloudinary.com/)
- [**FastDFS**](https://github.com/happyfish100/fastdfs)(自己搭建)

### 以后要做的事

- Photo Gallery 功能
