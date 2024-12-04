import { getPackageJsonVersion } from '../../utils/index';

const currentVersion = getPackageJsonVersion();

export const zh = [
    {
        text: '简介',
        link: '/guide/',
        activeMatch: '/guide/',
    },
    {
        text: '工具',
        link: '/tools/',
        activeMatch: '/tools/',
    },
    {
        text: '前端',
        link: '/frontend/',
        activeMatch: '/frontend/',
    },
    {
        text: '后端',
        link: '/backend/',
        activeMatch: '/backend/',
    },
    {
        text: '算法',
        link: '/algorithm/',
        activeMatch: '/algorithm/',
    },
    {
        text: '运维',
        link: '/operation/',
        activeMatch: '/operation/',
    },
    {
        text: '安全',
        link: '/security/',
        activeMatch: '/security/',
    },
    {
        text: 'AI',
        link: '/ai/',
        activeMatch: '/ai/',
    },
    {
        text: '杂项',
        link: '/other/',
        activeMatch: '/other/',
    },
    {
        text: `v${currentVersion}`,
        items: [
            {
                text: '更新日志',
                link: 'https://github.com/oceanopen/we_share_codes/blob/main/CHANGELOG.md',
            },
            {
                text: 'New issue',
                link: 'https://github.com/oceanopen/we_share_codes/issues/new/choose',
            },
        ],
    },
];
