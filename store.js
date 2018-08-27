import { observable, decorate, computed, action } from "./utils/mobx";

const store = observable({
  //observable
  age: 0,
  //computed
  get say() {
    return `i am ${this.age}.`;
  },
  //action
  add() {
    this.age += 1;
  }
});

class AnotherStore {
  age = 18;
  get agex2() {
    return this.age * 2;
  }
  reset() {
    this.age = 0;
  }
}

decorate(AnotherStore, {
  age: observable,
  agex2: computed,
  reset: action
});

export { store, AnotherStore };
