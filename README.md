# mobx-wxapp

在小程序中使用[mobx](https://github.com/mobxjs/mobx)，`inject`函数可将被观察的数据高效的绑定到小程序视图,现在您可以在小程序中使用的mobx的所有能力了。


### 安装

`npm install mobx-wxapp` 安装项目到本地 或 直接拷贝文件(example/mobx-wxapp.js)到您的项目。

(案例使用了 mobx.js v4.6.0 ,因mobx5使用了小程序暂不支持的ES6 proxy)

### 用法

pages/index.js:

```JavaScript

import { observable, computed, action, decorate } from "../mobx"
import { inject } from "../mobx-wxapp"

// 定义一个 store
class Store {
  seconds = 0;
  get color() {
    return this.seconds % 2 === 0 ? "red" : "green";
  }
  tick = () => {
    this.seconds += 1;
  };
}
decorate(Store, {
  seconds: observable,
  color: computed,
  tick: action
});


Page({
  onLoad() {
    // 在此注入store
    inject(this, { store: new Store() });
  },
  add() {
    // 可从 props 获取引用
    const { store } = this.props;
    store.tick();
  }
});

```

pages/index.wxml:

```xml
<view style="color:{{color}}"> seconds:{{ seconds }} </view>
<button bindtap="add">add</button>
```
----------

#### 全局store
您也可以定义一个全局store，然后绑定到page。

global.js:
```JavaScript
// 定义一个全局store
import { observable} from "./mobx";

const globalStore = observable({
  title: "mobx-wxapp example"
});

export default globalStore;
```


pages/index.js:
```JavaScript
+ import globalStore from '../global'

Page({
  onLoad() {
    // 值得注意的是多个store中重名的属性将被覆盖
    + inject(this, { store: new Store(), globalStore });
  }
})
```
```xml
+ <view>{{ title }}</view>
```
-------
当然，您也可在 Component 中使用:

```JavaScript
Component({
  //..
  ready(){
    this.disposer = inject(this,{store: new Store()})
  },

  //请务必在组件生命周期结束前执行销毁器!
  detached(){
    this.disposer();
  }
  //...
})
```


-------
## API

### inject(context,props)

返回一个销毁器函数（在 Page 中使用时将自动在 onUnload 生命周期执行,但在 Component 构造器中使用时请确保在生命周期结束时手动调用此函数）。

## License

ISC licensed.
