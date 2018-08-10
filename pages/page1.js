import store0 from '../stores/store0';
import store1 from '../stores/store1';
import { observer } from '../utils/mobx-wxapp';

Page(
  observer({ store0, store1 })({
    data: {},
    onLoad() {},
    tapReset() {
      store0.reset(0);
    }
  })
);
