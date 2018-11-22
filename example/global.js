import { observable} from "./mobx";

const globalStore = observable({
  name: "mobx example"
});

export default globalStore;
