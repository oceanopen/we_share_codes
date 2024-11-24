const greeter = require('./app.js');
require('./main.less');

document.querySelector('#app').appendChild(greeter());

document.querySelector('#btn').addEventListener('click', () => {
    import('./async.js').then((data) => {
        console.log(data);
    });
});
