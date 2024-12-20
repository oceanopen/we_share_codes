const { execSync } = require('node:child_process');

try {
  const stdout = execSync('ls -la');
  console.log(`stdout: ${stdout}`);
}
catch (err) {
  console.log(`err: ${err}`);
}

console.log('sync run');
