# mobx-wxapp

在小程序中使用[mobx](https://github.com/mobxjs/mobx)，`inject`函数可将被观察的数据绑定到视图，现在您可以在小程序中使用强大的mobx了。
+ 简单，仅有一个api
+ 灵活，自由组织您的store
+ 高效，高性能的setData机制


### 安装

`npm install mobx-wxapp`安装项目到本地 或 直接拷贝文件(example/mobx-wxapp.js)到您的项目。

(案例使用了 mobx.js v4.6.0 ,因mobx5使用了小程序暂不支持的ES6 proxy)

### 用法
#### 局部store
page:

```JavaScript
//pages/index.js
import { observable, computed, action, decorate } from "../mobx"
import { inject } from "../mobx-wxapp"

// store
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
})

// page
Page({
  onLoad() {
    inject(this, { store: new Store(),/*支持多个 store */ })
    const { store } = this.props
    setInterval(store.tick, 1000)
  }
  //...
})
```

wxml:

```xml
<!-- pages/index.wxml -->
<view style="color:{{store.color}}">
    seconds:{{store.seconds}}
</view>
```

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

#### 全局store
您也可以定义一个全局store，然后注入到page。
```JavaScript
// global.store.js
// 定义一个全局store
const globalStore = ({
  title:'mini program'
})
export default globalStore
```
```JavaScript
// pageA.js
import globalStore from './global'

Page({
  onLoad() {
    inject(this, { globalStore,/*store : new Store() */ });
    // ...
  }
  //...
})
```
```xml
// pageA.wxml
<view>{{globalStore.title}}</view>
```


#### store 联动
某些时候局部的store需要依赖其他store，为了能联动多个store，您可以这样做：
```JavaScript
// pageA.js
import globalStore from './global'

let disposer
class Store{
  constructor(){
    // 在构造函数中建立依赖
    disposer = autorun(()=>{
      this.title = globalStore.title
    })
  }

  get myTitle(){
    return `my ${this.title}`
  }
}
decorate(Store, {
  title: observable,
  myTitle: computed,
})

Page({
  onUnload(){
    // 在卸载页面时销毁 globalStore.title 依赖
    disposer()
  },
  onLoad() {
    inject(this, { store: new Store()})
    // ...
  }
  //...
})
```

-------
## API

### inject(context,Object)

参数：

- context:this
- Object:stores

返回一个销毁器函数（在 Page 中使用时将自动在 onUnload 生命周期执行,但在 Component 构造器中使用时请确保在生命周期结束时手动调用此函数）。

感谢[westore](https://github.com/Tencent/westore)共享的JSON Diff库代码。

## License

ISC licensed.
