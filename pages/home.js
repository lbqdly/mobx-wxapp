import userStore from '../stores/user';
import otherStore from '../stores/other';
import {observer} from "../utils/mobx-wxapp";

Page(observer({userStore, otherStore})({
    onLoad() {
    },
    tapButton() {
        userStore.old();
    }
}));


