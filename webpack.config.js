const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    devtool: 'source-map',
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, './js/'),
        filename: 'spinny-widget.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader'
                }]
            }
        ]
    },
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true
        })
    ]
};
