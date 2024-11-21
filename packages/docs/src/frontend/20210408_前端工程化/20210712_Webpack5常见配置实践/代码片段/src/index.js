import imgPkq from '../public/assets/皮卡丘.png';

class Test {
    constructor() {
        this.renderImg();
    }

    renderImg() {
        const img = document.createElement('img');
        img.src = imgPkq;
        document.body.appendChild(img);
    }
}

// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const test = new Test();
