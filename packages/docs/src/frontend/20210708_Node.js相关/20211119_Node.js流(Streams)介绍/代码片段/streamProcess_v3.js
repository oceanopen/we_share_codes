const fs = require('node:fs');
const process = require('node:process');
const zlib = require('node:zlib');

const file = process.argv[2];

const { Transform } = require('node:stream');

const reportProgress = new Transform({
  transform(chunk, encoding, callback) {
    process.stdout.write('.');
    this.push(chunk);
    callback();
  },
});

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(`${file}.gzip`))
  .on('finish', () => console.log('Done'));
