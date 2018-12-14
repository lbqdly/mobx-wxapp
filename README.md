# mobx-wxapp

在小程序中使用[mobx](https://github.com/mobxjs/mobx)，`connect`函数可将被观察的数据高效的绑定到小程序视图。

旧的`inject`方式见 [v1](https://github.com/b5156/mobx-wxapp)

### 安装

`npm install mobx-wxapp` 安装项目到本地 或 直接拷贝文件(example/mobx-wxapp.js)到您的项目。

(案例使用了 mobx.js v4.6.0 ,因 mobx5 使用了小程序暂不支持的 ES6 proxy)

### 用法

pages/index.js:

```JavaScript
import { connect } from "../mobx-wxapp";
import globalStore from "../stores/global.store";
import indexStore from "../stores/index.store";

Page({
  onLoad() {
    const mapStateToProps = () =>({
        title: globalStore.title,
        seconds: indexStore.seconds,
        color: indexStore.color
    })
    connect(this,mapStateToProps/*, options */);
  },
  add() {
    indexStore.tick();
  }
});
```
pages/index.wxml:

```xml
<view style="color:{{color}}"> seconds:{{ seconds }} </view>
<button bindtap="add">add</button>
```
stores/global.store.js

```JavaScript
import { observable} from "../mobx";
const globalStore = observable({
  title: "mobx-wxapp example"
});
export default globalStore;
```

stores/index.store.js

```JavaScript
import { observable, computed, action, decorate } from "../mobx";
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
export default new Store();
```



当然，您也可在 Component 中使用:

```JavaScript
Component({
  //..
  ready(){
    this.disposer = connect(this,mapStateToProps,options)
  },

  //请务必在组件生命周期结束前执行销毁器!
  detached(){
    this.disposer();
  }
  //...
})
```

## API

### connect(context,mapStateToProps,options?)
```
//请传入this
context:Object,

//需要绑定到视图的映射值
mapStateToProps:Function 

//可选参数
options:Object
/*{
  delay:30,// setData的执行间隔
  setDataCallback:changed=>{} // setData的执行回调
}*/
```
返回值:`connect`返回一个销毁器函数（在 Page 中使用时将自动在 onUnload 生命周期执行,但在 Component 构造器中使用时请确保在生命周期结束时手动调用此函数）。

## License

ISC licensed.
