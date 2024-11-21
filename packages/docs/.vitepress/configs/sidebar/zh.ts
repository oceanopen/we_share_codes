import backend from './backend';
import frontend from './frontend';
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
};
