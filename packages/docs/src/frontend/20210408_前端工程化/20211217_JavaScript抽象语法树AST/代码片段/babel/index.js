const babel = require('@babel/core');

const plugin = require('./plugin/index.js');

const visitor = plugin();

const code = `
    import { Select as MySelect, Pagination } from 'xxx-ui';
    import * as UI from 'xxx-ui';
`;

const result = babel.transform(code, {
    plugins: [
        [
            visitor,
            {
                libraryName: 'xxx-ui',
                camel2DashComponentName: true,
                customSourceFunc: componentName => `xxx-ui/src/components/ui-base/${componentName}/${componentName}`,
            },
        ],
    ],
});

console.log(result.code);
// import MySelect from './xxx-ui/src/components/ui-base/select/select';
// import Pagination from './xxx-ui/src/components/ui-base/pagination/pagination';
// import * as UI from 'xxx-ui';
