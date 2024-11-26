const crypto = require('node:crypto');
const fs = require('node:fs');
const process = require('node:process');
const zlib = require('node:zlib');

const file = process.argv[2];

const { Transform } = require('node:stream');

const reportProgress = new Transform({
    transform(chunk, encoding, callback) {
        process.stdout.write('.');
        callback(null, chunk);
    },
});

fs.createReadStream(file)
    .pipe(crypto.createDecipheriv('aes192', 'a_secret'))
    .pipe(zlib.createGunzip())
    .pipe(reportProgress)
    .pipe(fs.createWriteStream(file.slice(0, -11)))
    .on('finish', () => console.log('Done'));
