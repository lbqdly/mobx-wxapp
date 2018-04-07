import {observable, action} from "../utils/mobx";

const store = observable({

        name: 'aaron',

        age: 18,

        firends: ['max', 'roy', 'haskell'],

        get sayHi() {
            return `name is ${this.name},i am ${this.age}.`;
        },

        old() {
            this.age += 1;
        }
    }
);

export default store;