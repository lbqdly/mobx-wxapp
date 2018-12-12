import { observable} from "./mobx";

const globalStore = observable({
  title: "mobx-wxapp example"
});

export default globalStore;
