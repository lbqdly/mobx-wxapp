import store0 from '../stores/store0';
import { observer } from '../utils/mobx-wxapp';

Page(
  observer({ store: store0 })({
    onLoad() {
      //...
    },
    tapAdd() {
      store0.add();
    }
  })
);
