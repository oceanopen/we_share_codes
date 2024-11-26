const fs = require('node:fs');

const filename = './test.txt';

function readFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}

readFile(filename)
    .then(() => {
        return readFile(filename);
    })
    .then(() => {
        return readFile(filename);
    })
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });
