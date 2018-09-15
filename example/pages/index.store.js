//store
import { observable, decorate, computed, action } from "../mobx";
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
