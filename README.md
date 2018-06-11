# mobx-wxapp-example
在微信小程序中使用[mobx](https://github.com/mobxjs/mobx)，`mobx-wxapp`简单的提供了一个`observer`函数，用法如例所示。

#### 用法

js:
```JavaScript
import store0 from '../stores/store0';
import store1 from '../stores/store1';
import {observer} from "../utils/mobx-wxapp";

Page(observer({store0, store1})({
    onLoad() {
    },
    //...
}));

```
wxml:
```xml
<view>name:{{store0.age}}...</view>
```

## License

ISC licensed.

