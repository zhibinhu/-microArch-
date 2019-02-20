const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const package = require('../package.json');

fs.open('./env.js', 'w', function(err, fd) {
    const buf = 'export default "development";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

module.exports = merge(webpackBaseConfig, {
    // devtool: '#source-map', #eval , #cheap-eval-source-map
    devtool: '#eval',
    output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            title: 'Protal' + package.version,
            filename: '../index.html',
            template: './src/template/index.ejs',
            inject: false
        }),
        /* /build/webpack.dev.conf.js: */
        // new webpack.DefinePlugin({
        //     // 源码中所有 process.env 都会被替换为
        //     // '../config/dev.env'这个module export出来的东西
        //     'process.env': require('../config/dev.env')
        // })
    ]
});