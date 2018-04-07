# mobx-wxapp-example
在微信小程序中使用mobx，`mobx-wxapp`简单的提供一个`observer`函数，用法如例所示。

#### 用法

js:
```JavaScript
import userStore from '../stores/user';
import otherStore from '../stores/other';
import {observer} from "../utils/mobx-wxapp";

Page(observer({userStore, otherStore})({
    onLoad() {
    },
    //...
}));

```
wxml:
```xml
<view>name:{{userStore.name}}...</view>
```

## License

MIT licensed.

