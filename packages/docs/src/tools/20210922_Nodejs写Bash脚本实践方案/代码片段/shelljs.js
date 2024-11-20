const shell = require('shelljs');

if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}
else {
    shell.echo('which git:', shell.which('git'));
}

// 遍历文件
shell.cd('./');
shell.ls('*.js').forEach((file) => {
    console.log('filename:', file);
});

shell.echo('run complete');
