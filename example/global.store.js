import { observable, decorate, computed, action } from "./mobx";

class GlobalStore {
  name = "mobx";
  get sname() {
    return this.name.split("").join("-");
  }
}

decorate(GlobalStore, {
  num: observable,
  sname: computed
});

//单例
const globalStore = new GlobalStore();
export default globalStore;
