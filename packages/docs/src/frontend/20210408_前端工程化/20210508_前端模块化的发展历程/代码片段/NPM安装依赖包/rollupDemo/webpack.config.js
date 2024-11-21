import path from 'node:path';

module.exports = {
    mode: 'development', // development为开发环境，production为生产环境
    entry: path.resolve(__dirname, 'src/main.js'), // 入口文件
    output: {
        path: path.resolve(__dirname, 'dist'), // 打包后的文件存放的地方
        filename: 'bundle-webpack.js', // 打包后输出文件的文件名
        libraryTarget: 'umd',
        library: 'bundleSDK',
    },

    devtool: 'source-map',
};
