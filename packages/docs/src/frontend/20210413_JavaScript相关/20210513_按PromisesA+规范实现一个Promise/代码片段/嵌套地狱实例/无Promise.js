const fs = require('node:fs');

const filename = './test.txt';

fs.readFile(filename, 'utf8', (err) => {
  if (err) {
    console.error(err);
  }
  else {
    fs.readFile(filename, 'utf8', (err) => {
      if (err) {
        console.error(err);
      }
      else {
        fs.readFile(filename, 'utf8', (err, data) => {
          if (err) {
            console.error(err);
          }
          else {
            console.log(data);
          }
        });
      }
    });
  }
});
