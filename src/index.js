setTimeout(() => {
    const dodo = () => import('./haha');
    const dodo2 = () => import('./haha2');
    dodo();
    dodo2();
}, 2000)

class Animal {
    constructor(name) {
        this.name = name;
    }
    getName() {
        console.log(this.name);
    }
}

let dog = new Animal('asd');
dog.getName();

import './index.less'
console.log(new Vue())