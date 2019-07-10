const path = require("path");

let config = {
    mode: 'production',
    entry: {
        'index': `./src/index.js`,
    },
    output: {
        path: path.resolve(__dirname, "lib"),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        ['@babel/preset-env', {corejs: '3.1.4', useBuiltIns: "usage",  targets: {ie: 11, edge: 17, firefox: 67, chrome: 74, safari: '12.1', }}],
                    ],
                }
            }
        ],
    },
    devServer: {
        compress: true,
        open: true,
        port: 3000,
        openPage: 'demo/',
    }
};

module.exports = config;