const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        Groups: './src/assets/scripts/Groups.ts',
        IndividualGroup: './src/assets/scripts/IndividualGroup.ts',
        Settings: './src/assets/scripts/Settings.ts'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: [],
        }),
        new HtmlWebpackPlugin({
            template: './src/GroupsPage.html',
            filename: 'GroupsPage.html',
            chunks: ['Groups'],
        }),
        new HtmlWebpackPlugin({
            template: './src/SettingsPage.html',
            filename: 'SettingsPage.html',
            chunks: ['Settings'],
        }),
        new HtmlWebpackPlugin({
            template: './src/IndividualGroup.html',
            filename: 'IndividualGroup.html',
            chunks: ['IndividualGroup'],
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'static' }
            ]
        })
    ],
    devServer: {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,
    },
    cache: true
};
