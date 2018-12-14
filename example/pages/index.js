import { connect } from "../mobx-wxapp";
import globalStore from "../stores/global.store";
import indexStore from "../stores/index.store";

// page
Page({
  onLoad() {
    connect(this,() => ({
        title: globalStore.title,
        seconds: indexStore.seconds,
        color: indexStore.color
      }),{
        setDataCallback: changed => {
          console.log(changed);
        }
      }
    );
  },
  add() {
    indexStore.tick();
  }
});
