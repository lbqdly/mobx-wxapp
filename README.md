# mobx-wxapp

在微信小程序中使用[mobx](https://github.com/mobxjs/mobx)，`mobx-wxapp`简单的提供了一个`inject`函数(替换原observer方式)，用于自动响应被观察数据的更新，用法如例所示。

#### 用法

`npm install mobx-wxapp`

案例使用了 mobx v4

一些store:

```JavaScript
//store.js
import { observable, decorate, computed, action } from "./utils/mobx";

const store = observable({
  //observable
  age: 0,
  //computed
  get say() {
    return `i am ${this.age}.`;
  },
  //action
  add() {
    this.age += 1;
  }
});
/* or */
class AnotherStore {
  age = 18;
  get agex2() {
    return this.age * 2;
  }
  reset() {
    this.age = 0;
  }
}

decorate(AnotherStore, {
  age: observable,
  agex2: computed,
  reset: action
});

export { store, AnotherStore };
```

page:

```JavaScript
//index.js
import { store, AnotherStore } from "../store";
import { inject } from "../utils/mobx-wxapp";

Page({
  onLoad(options) {
    inject(this, {
      store: store,
      another: new AnotherStore()
    });
    //...
  },
  //...
  tapAdd() {
    this.props.store.add();
    this.props.another.reset();
  }
});
```

wxml:

```xml
<view>age: {{store.age}}</view>
<view>{{store.say}}</view>
<view>another: {{another.age}}</view>
<view>{{another.agex2}}</view>
<button bindtap="tapAdd">add</button>
```

## License

ISC licensed.
