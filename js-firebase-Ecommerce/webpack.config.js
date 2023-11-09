
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
    mode: "development",
    resolve: {
        modules: ['node_modules'],
    },
    entry: {
        index: "./src/js/index.js",
        features: "./src/js/featured.js",
        editProfile: "./src/js/edit-profile.js"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].bundle.js",
        clean: true
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        hot: true,
        open: true,
        historyApiFallback: true,
        compress: true,
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },

        ],
    },
    plugins: [
        new htmlWebpackPlugin({
            title: 'FirebaseApp',
            filename: 'index.html',
            template: 'src/index.html',
            chunks: ['index']
        }),
        new htmlWebpackPlugin({
            title: 'Featured',
            filename: 'featured.html',
            template: 'src/featured.html',
            chunks: ['features']
        }),
        new htmlWebpackPlugin({
            title: 'Edit-Profile',
            filename: 'edit-profile.html',
            template: 'src/edit-profile.html',
            chunks: ['editProfile']
        }),

    ]
};