const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// move the plubic out 
// look into the html plugin 
module.exports = {
    mode: 'development',
    entry: {
        Groups: './src/GUI/Groups.ts',
        HelpOptions: './src/GUI/ImportHelpOptions.ts',
        IndividualGroup: './src/GUI/IndividualGroup.ts'
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
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/GroupsPage.html',
            filename: 'GroupsPage.html',
            chunks: ['Groups'],
        }),
        new HtmlWebpackPlugin({
            template: './src/SettingsPage.html',
            filename: 'SettingsPage.html',
            chunks: ['SettingsPage'],
        }),
        new HtmlWebpackPlugin({
            template: './src/IndividualGroup.html',
            filename: 'IndividualGroup.html',
            chunks: ['IndividualGroup'],
        }),
        new CopyPlugin({
            patterns: [
                { from: 'src/Public', to: 'assets' }
            ]
        }),
    ],
    devtool:'source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,
    },
};
