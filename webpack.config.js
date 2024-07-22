const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// move the plubic out 
// look into the html plugin 
module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.ts',
        ImportTasks: './src/GUI/ImportTasks.ts', 
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
                test: /\.(png|jpg|gif|svg)$/,
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
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: './src/GroupsPage.html',
            filename: 'GroupsPage.html',
            chunks: ['GroupsPage'] 
        }),
        new HtmlWebpackPlugin({
            template: './src/HomePage.html',
            filename: 'HomePage.html',
            chunks: ['HomePage']
        }),
        new HtmlWebpackPlugin({
            template: './src/SettingsPage.html',
            filename: 'SettingsPage.html',
            chunks: ['SettingsPage']
        }),
        new HtmlWebpackPlugin({
            template: './src/IndividualGroup.html',
            filename: 'IndividualGroup.html',
            chunks: ['IndividualGroup']
        }),
        new CopyPlugin({
            patterns: [
                { from: 'src/Public', to: 'assets' }
            ]
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,
    },
};
