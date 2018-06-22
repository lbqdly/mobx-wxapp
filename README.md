# mobx-wxapp-example
在微信小程序中使用[mobx](https://github.com/mobxjs/mobx)，`mobx-wxapp`简单的提供了一个`observer`函数，用法如例所示。

#### 用法
案例使用了mobx v4

store:
```JavaScript
import {observable} from "../utils/mobx";
const store = observable({
        //observable
        age: 0,
        //computed
        get say() {
            return `i am ${store.age}.`;
        },
        //action
        add() {
            store.age += 1;
        }
    }
);
export default store;
```
js:
```JavaScript
import store from '../stores/store';
import {observer} from "../utils/mobx-wxapp";

Page(observer({store/*,otherStore*/})({
    onLoad() {
    },
    //...
    tapAdd(){
        store.add();
    }
}));

```
wxml:
```xml
<view>age: {{store.age}}</view>
<view>{{store.say}}</view>
<button bindtap="tapAdd">add</button>
```

## License

ISC licensed.

