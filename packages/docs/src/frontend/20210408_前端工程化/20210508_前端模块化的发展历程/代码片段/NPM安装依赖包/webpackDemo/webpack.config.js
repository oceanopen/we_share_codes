import path from 'node:path';

module.exports = {
  mode: 'development', // development为开发环境，production为生产环境
  entry: path.resolve(__dirname, 'src/main.js'), // 入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 打包后的文件存放的地方
    filename: 'bundle.js', // 打包后输出文件的文件名
  },
  optimization: {
    // 配置详见：https://webpack.docschina.org/plugins/split-chunks-plugin/
    splitChunks: {
      chunks: 'async',
      minSize: 500,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        // 第三方开源库单独打包
        commons: {
          chunks: 'all',
          // 当 webpack 处理文件路径时，它们始终包含 Unix 系统中的 / 和 Windows 系统中的 \。这就是为什么在 {cacheGroup}.test 字段中使用 [\\/] 来表示路径分隔符的原因。{cacheGroup}.test 中的 / 或 \ 会在跨平台使用时产生问题。
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          // cacheGroupKey here is `commons` as the key of the cacheGroup
          name(module, chunks, cacheGroupKey) {
            return `${cacheGroupKey}`;
          },
          filename: '[name].bundle.js',
        },
        // 业务项目公共代码单独打包
        vendors: {
          chunks: 'all',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
          // cacheGroupKey here is `vendors` as the key of the cacheGroup
          name(module, chunks, cacheGroupKey) {
            return `${cacheGroupKey}`;
          },
          filename: '[name].bundle.js',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css/,
        use: ['style-loader', { loader: 'css-loader' }],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ['style-loader', { loader: 'css-loader' }, { loader: 'less-loader' }],
      },
    ],
  },
};
