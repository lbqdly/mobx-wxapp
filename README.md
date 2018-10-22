# mobx-wxapp

在微信小程序中使用[mobx](https://github.com/mobxjs/mobx)，`mobx-wxapp`简单的提供了一个`inject`函数将可观察的数据注入并在数据变化时自动渲染到页面。


#### 用法

`npm install mobx-wxapp`或直接拷贝文件(example/mobx-wxapp.js)到您的项目。

案例使用了 mobx v4

store:

```JavaScript
//global.store.js
import { observable, decorate, computed, action } from "./mobx";
class GlobalStore {
  name = "mobx";
  get sname() {
    return this.name.split("").join("-");
  }
}
decorate(GlobalStore, {
  num: observable,
  sname: computed
});
//导出为单例
const globalStore = new GlobalStore();
export default globalStore;


//index.store.js
import { observable, decorate, computed, action } from "./mobx";
class Store {
  seconds = 0;
  get color() {
    return this.seconds % 2 === 0 ? "red" : "green";
  }
  tick() {
    this.seconds += 1;
  }
}
decorate(Store, {
  seconds: observable,
  color: computed,
  tick: action
});
export default Store;
```

page:

```JavaScript
//pages/index.js
import { inject } from "../mobx-wxapp";
import Store from "./index.store";
import globalStore from "../global.store";

Page({
  onLoad(options) {
    inject(this, {
      store: new Store(),
      globalStore
    });

    this.timer = setInterval(() => {
      this.props.store.tick();
    }, 1000);
  },
  onUnload() {
    clearInterval(this.timer);
  }
  //...
});
```

wxml:

```xml
<!-- pages/index.wxml -->
<view>{{globalStore.sname}}</view>
<view style="color:{{store.color}}">
    seconds:{{store.seconds}}
</view>
```

当然，您也可在 Component 中使用:

```JavaScript
Component({
  //...
  ready(){
    this.disposer = inject(this,{store: store})
  },

  //请务必在组件生命周期结束前执行销毁器!
  detached(){
    this.disposer();
  }
  //...
})
```

## API

### inject(context,Object)

参数：

- context:this
- Object:stores

返回值：disposer:function,一个销毁器函数（在 Page 中使用时将自动在 onUnload 生命周期执行,但在 Component 构造器中使用时请确保在生命周期结束时手动调用此函数）。

## License

ISC licensed.
