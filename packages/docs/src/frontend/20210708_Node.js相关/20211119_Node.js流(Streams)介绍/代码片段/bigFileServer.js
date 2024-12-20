const fs = require('node:fs');
const server = require('node:http').createServer();

server.on('request', (req, res) => {
  fs.readFile('./big.text', (err, data) => {
    if (err) { throw err; }
    res.end(data);
  });
});
server.listen(8000);
