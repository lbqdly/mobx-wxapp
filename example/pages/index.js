import { inject } from "../mobx-wxapp";
import { observable, computed, action, decorate } from "../mobx";
import globalStore from "../global";

// store
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

// page
Page({
  onLoad() {
    inject(this, { store: new Store(), globalStore });
  },
  add() {
    const { store, globalStore } = this.props;
    store.tick();
  }
});
