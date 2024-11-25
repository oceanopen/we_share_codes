export default [
    {
        text: '介绍',
        link: '/backend/',
    },
    {
        text: '单点登录的三种实现方式',
        link: '/backend/20210630_单点登录的三种实现方式/',
    },
    {
        text: '浅谈《凤凰架构》',
        link: '/backend/20240109_浅谈《凤凰架构》/',
    },
    {
        text: 'docker 安装 redis',
        link: '/backend/20230705_docker安装redis/',
    },
    {
        text: '数据库',
        collapsed: false,
        items: [
            {
                text: 'docker 安装 mysql',
                link: '/backend/20210412_数据库/20230705_docker安装mysql/',
            },
            {
                text: '为什么数据库字段建议使用 NOT_NULL',
                link: '/backend/20210412_数据库/20210412_为什么数据库字段建议使用NOT_NULL/',
            },
            {
                text: '常见 MySQL 报错',
                link: '/backend/20210412_数据库/20230704_常见MySQL报错/',
            },
        ],
    },
    {
        text: 'Go 相关',
        collapsed: false,
        items: [
            {
                text: '基于 gin 的 go 项目支持 swagger',
                link: '/backend/20240419_Go相关/20240419_基于gin的go项目支持swagger/',
            },
            {
                text: 'Go 工具库之 cobra',
                link: '/backend/20240419_Go相关/20241009_Go工具库之cobra/',
            },
        ],
    },
    {
        text: '项目实战',
        collapsed: false,
        items: [
            {
                text: 'go-admin 项目本地运行',
                link: '/backend/20230714_项目实战/20230714_go-admin项目本地运行/',
            },
        ],
    },
];
