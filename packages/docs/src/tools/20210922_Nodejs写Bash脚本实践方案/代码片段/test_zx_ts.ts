#!/usr/bin/env node

import { $ } from 'zx';
// Or
// import 'zx/globals'

void (async function () {
    console.log('start');

    await Promise.all([$`sleep 1; echo 1`, $`sleep 2; echo 2`, $`sleep 3; echo 3`]);

    console.log('end');
})();
