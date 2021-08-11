const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        main: './src/bundle.js',
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: './',
        filename: 'scripts/bundle-[name].js',
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 4200
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        },
        {
            test: /\.s[ac]ss$/i,
            use: [
                MiniCssExtractPlugin.loader,
                { loader: "css-loader", options: { url: false } },
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                require('autoprefixer')
                            ],
                        },
                    },
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sassOptions: {
                            outputStyle: 'expanded',
                        },
                    },
                },
            ],
        },
        {
            test: /\.css$/i,
            use: [
                MiniCssExtractPlugin.loader,
                { loader: "css-loader", options: { url: false } },
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                require('postcss-fixes'),
                                require('postcss-import'),
                                require('tailwindcss'),
                                require('autoprefixer')
                            ]
                        },
                    },
                }
            ],
        },
        {
            test: /\.(png|jpe?g|gif|svg)$/,
            use: [{
                loader: "file-loader",
                options: {
                    outputPath: 'imgs',
                    name: '[name].[ext]'
                }
            }]
        },
        {
            test: /\.(eot|ttf|woff|woff2)$/,
            use: [{
                loader: "file-loader",
                options: {
                    outputPath: 'fonts',
                    name: '[name].[ext]'
                }
            }]
        }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/img',
                    to: 'imgs'
                },
            ]
        }),
        new ImageMinimizerPlugin({
            minimizerOptions: {
                plugins: [
                    ['mozjpeg', { quality: 80 }],
                    ['pngquant'],
                    [
                        'svgo',
                        {
                            plugins: [
                                {
                                    removeViewBox: false,
                                },
                            ],
                        },
                    ],
                ],
            },
        }),
    ],
};