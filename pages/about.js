import userStore from '../stores/user';
import {observer} from "../utils/mobx-wxapp";

Page(observer({userStore})({
    data: {},
    onLoad() {
    },
    tapReset() {
        userStore.age = 18;
    }
}));