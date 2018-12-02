import { observable} from "./mobx";

const globalStore = observable({
  name: "mini program"
});

export default globalStore;
