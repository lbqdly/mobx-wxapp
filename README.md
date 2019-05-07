# mobx-wxapp

在小程序中使用[mobx](https://github.com/mobxjs/mobx)，`connect`函数可将被观察的数据高效的绑定到小程序视图。
旧的`inject`方式见[v1](https://github.com/b5156/mobx-wxapp/tree/v1)

### 安装

`npm install mobx-wxapp` 安装项目到本地 或 直接拷贝文件(example/mobx-wxapp.js)到您的项目。

(案例使用了 mobx.js v4.6.0 ,因 mobx5 使用了小程序暂不支持的 ES6 proxy)

### 用法

pages/index.js:

```JavaScript
import { connect, extract } from '../mobx-wxapp'
import { observable } from '../mobx'

const appStore = observable({
  title: 'mobx-wxapp'
})

const store = observable({

  // observable
  seconds: 0,

  // computed
  get color() {
    return this.seconds % 2 ? 'red' : 'green'
  },

  // actions
  tick() {
    this.seconds += 1
  }
})

// page
Page({
  onLoad() {
    connect(this, () => ({
        title: appStore.title,
        color: store.color,
        seconds: store.seconds
        // 或者使用 extract 一次性提取全部属性
        // ...extract(store)
      })
    )
  },
  add() {
    store.tick()
  }
})

```
pages/index.wxml:

```xml
<view>{{ title }} :</view>
<view style="color:{{ color }}"> seconds:{{ seconds }} </view>
<button bindtap="add">add</button>
```

当然，您也可在 Component 中使用:

```JavaScript
Component({
  //..
  ready(){
    this.disposer = connect(this,mapDataToStore,options)
  },

  //请务必在组件生命周期结束前执行销毁器!
  detached(){
    this.disposer();
  }
  //...
})
```

## API

### connect(context,mapDataToStore,options?)
+ context:Object // 请传入this
+ mapDataToStore:Function //需要绑定到视图的映射函数
+ options:Object // 可选参数

```
options = {
  delay:Number,// setData的最小执行间隔,默认30ms
  setDataCallback:Function // setData的执行回调
}
```
返回值:`connect`返回一个销毁器函数（在 Page 中使用时将自动在 onUnload 生命周期执行,但在 Component 构造器中使用时请确保在生命周期结束时手动调用此函数）。

### extract(store)
映射整个store的快捷方式
+ store:Object // 一个被观察的store对象

返回值:一个可被映射到data的对象

## 应用
<img src="http://misc.fapiaoer.cn/wxapp-yunpiaoer2b/yp2bqrcode.jpeg" width = '100' height = '100' />
<img src="http://misc.fapiaoer.cn/wxapp-yunpiaoer2b/rpqrcode.jpeg" width = '100' height = '100' />

## License

ISC licensed.
