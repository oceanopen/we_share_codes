const path = require('node:path');
const process = require('node:process');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootDir = process.cwd();

module.exports = {
    entry: path.resolve(rootDir, 'src/index.js'),
    output: {
        path: path.resolve(rootDir, 'dist'),
        filename: 'bundle.[contenthash:8].js',
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                type: 'asset',
            },
            {
                test: /\.(jsx|js)$/,
                use: ['thread-loader', 'babel-loader'],
                include: path.resolve(rootDir, 'src'),
                exclude: /node_modules/,
            },
            {
                test: /\.(le|c)ss$/,
                exclude: /node_modules/,
                use: [
                    'thread-loader',
                    'style-loader',
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [['autoprefixer']],
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(rootDir, 'public/index.html'),
            inject: 'body',
            scriptLoading: 'blocking',
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: '*.js',
                    context: path.resolve(rootDir, 'public/js'),
                    to: path.resolve(rootDir, 'dist/js'),
                },
            ],
        }),
    ],
};
