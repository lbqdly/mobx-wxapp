import { inject } from "../mobx-wxapp";
import Store from "./index.store";
import globalStore from "../global.store";

// page
Page({
  onLoad(options) {
    inject(this, {
      store: new Store(),
      globalStore
    });

    //tick
    this.timer = setInterval(() => {
      this.props.store.tick();
    }, 1000);
  },
  onUnload() {
    clearInterval(this.timer);
  }
  //...
});
