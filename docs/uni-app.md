# uni-app

## uniapp 路由页面配置

`pages.json`是一个uniapp项目配置文件，文件的基本结构如下：

alt + w查看文档结构图

![image-20211102194944534](C:\Users\ylf\AppData\Roaming\Typora\typora-user-images\image-20211102194944534.png)

* pages是项目中用到的所有的页面配置，其中第一项是登录app的启动页。

* subpackages是分包加载配置，为小程序准备的。小程序在发布上传代码时对总包大小(目前是16M)有要求，还要示对总包进行分包，每个小分包不能超过2M，这个就要求在这里进行配置分包加载。

* globalStyle是设置全局样式的，一般有统一风格的样式，可以在这里设置，包括导航栏、标题、窗口背景色。

* tabBar相当于一级导航栏。

  最多5项，最少2项，都在list项配置

  ```json
  "tabBar": {
  		"color": "#7A7E83",
  		"selectedColor": "#007AFF",
  		"borderStyle": "black",
  		"backgroundColor": "#F8F8F8",
  		"list": [{
  				"pagePath": "pages/tabBar/component/component",
  				"iconPath": "static/component.png",
  				"selectedIconPath": "static/componentHL.png",
  				"text": "内置组件"
  			},
           ...
      	]
  }
  ```

## 生命周期

### 应用生命周期

### 页面生命周期

### 组件生命周期



## 状态管理

### vuex

和vue一样，唯一要注意

```js
import store from './store/store.js'
```

只能写在`main.js`中，在别处引用都会报错

### uni.storage

状态数据是持久化的，会一直缓存在本地。

### globalData

在`app.vue`页面定义全局变量，具体用法：

```js
<script>  
    export default {  
        globalData: {  
            text: 'text'  
        }
    }  
</script>

//在其他页面调用/修改全局变量
getApp().globalData.text = 'test'
```

## 全局事件

* `uni.$emit(eventName, OBJECT)`

  触发全局的自定事件。附加参数都会传给监听器回调

  | 属性      | 类型   | 描述                   |
  | --------- | ------ | ---------------------- |
  | eventName | String | 事件名                 |
  | OBJECT    | Object | 触发事件携带的附加参数 |

  ```js
  uni.$emit('update', {msg:'页面更新'})
  ```

* `uni.$on(eventName, callback)`

  监听全局的自定义事件。事件可以由 uni.$emit 触发，回调函数会接收所有传入事件触发函数的额外参数。

  | 属性      | 类型     | 描述           |
  | --------- | -------- | -------------- |
  | eventName | String   | 事件名         |
  | callback  | Function | 事件的回调函数 |

  ```js
  uni.$on('update',function(data){
          console.log('监听到事件来自 update ，携带参数 msg 为：' + data.msg);
  })
  ```

* `uni.$once(eventName, callback)`

  监听全局的自定义事件。事件可以由`uni.$emit`触发，但是只触发一次，在第一次出发后移除监听器

* `uni.$off([eventName, callback])`

  - 如果没有提供参数，则移除所有的事件监听器；
  - 如果只提供了事件，则移除该事件所有的监听器；
  - 如果同时提供了事件与回调，则只移除这个回调的监听器；
  - 提供的回调必须跟$on的回调为同一个才能移除这个回调的监听器；

## 接口请求封装

`uni.request(object)`

## 路由跳转

当前页面必须在pages.json中配置好，才能调用这些跳转的api。

