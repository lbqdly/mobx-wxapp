import { store, AnotherStore } from "../store";
import { inject } from "../utils/mobx-wxapp";

Page({
  onLoad(options) {
    inject(this, {
      store: store,
      another: new AnotherStore()
    });
  },
  //...
  tapAdd() {
    this.props.store.add();
    this.props.another.reset();
  }
});
