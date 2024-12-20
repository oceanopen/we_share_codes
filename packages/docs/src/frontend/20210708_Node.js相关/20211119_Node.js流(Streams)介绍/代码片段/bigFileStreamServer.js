const fs = require('node:fs');
const server = require('node:http').createServer();

server.on('request', (req, res) => {
  const src = fs.createReadStream('./big.text');
  src.pipe(res);
});

server.listen(8000);
