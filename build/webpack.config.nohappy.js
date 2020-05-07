const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const config = require('./config')[isDev ? 'dev' : 'build'];
const webpack = require('webpack');
const path = require('path');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const webPackconfig = {
    mode: "development",
    devtool: 'cheap-module-eval-source-map', //开发环境下使用
    entry: {
        index: './src/index.js',
        other: './src/other.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'), //必须是绝对路径
        filename: '[name].[hash].js',
    },
    devServer: {
        port: '3000', //默认是8080
        quiet: false, //默认不启用
        stats: "errors-only", //终端仅打印 error
        compress: true, //是否启用 gzip 压缩
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/ 
            },
            {
                test: /\.(le|c)ss$/,
                use: ['cache-loader', 'style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function () {
                            return [
                                require('autoprefixer')({
                                    "overrideBrowserslist": [
                                        ">0.25%",
                                        "not dead"
                                    ]
                                })
                            ]
                        }
                    }
                }, 'less-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: ['cache-loader',
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240, //10K
                            name: '[name]_[hash:6].[ext]'
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        //数组 放着所有的webpack插件
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html', //打包后的文件名
            minify: {
                removeAttributeQuotes: false, //是否删除属性的双引号
                collapseWhitespace: false, //是否折叠空白
            },
            chunks: ['index'],
            config: config.template
        }),
        new HtmlWebpackPlugin({
            template: './other.html',
            filename: 'other.html', //打包后的文件名
            minify: {
                removeAttributeQuotes: false, //是否删除属性的双引号
                collapseWhitespace: false, //是否折叠空白
            },
            chunks: ['other'],
            config: config.template
        }),
        new webpack.ProvidePlugin({
            Vue: ['Vue', 'default'],
        }),
        new HardSourceWebpackPlugin()
    ]
}

module.exports = smp.wrap(webPackconfig);