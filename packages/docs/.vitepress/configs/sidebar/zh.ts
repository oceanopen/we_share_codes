import algorithm from './algorithm';
import backend from './backend';
import frontend from './frontend';
import operation from './operation';
import other from './other';
import security from './security';
import tools from './tools';

export const zh = {
    '/guide/': [
        {
            text: '介绍',
            link: '/guide/',
        },
        {
            text: '快速开始',
            link: '/guide/getting-started',
        },
    ],
    '/tools/': tools,
    '/frontend/': frontend,
    '/backend/': backend,
    '/algorithm/': algorithm,
    '/other/': other,
    '/operation/': operation,
    '/security/': security,
};
