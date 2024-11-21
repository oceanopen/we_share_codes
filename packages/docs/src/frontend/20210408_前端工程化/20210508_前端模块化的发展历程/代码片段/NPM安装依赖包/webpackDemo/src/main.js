const unique = require('uniq');
const greeter = require('./app.js');
require('./main.less');

document.querySelector('#app').appendChild(greeter());

const data = [1, 2, 2, 3, 4, 5, 5, 5, 6];
console.log('unique data:', unique(data));

document.querySelector('#btn').addEventListener('click', () => {
    import('./async.js').then((data) => {
        console.log(data);
    });
});
