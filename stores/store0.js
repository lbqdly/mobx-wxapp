import {observable, action} from "../utils/mobx";

const store = observable({

        //observable
        age: 0,

        //computed
        get say() {
            return `i am ${store.age}.`;
        },

        //action
        add() {
            store.age += 1;
        },
        reset(n){
            store.age = n;
        }
    }
);

export default store;