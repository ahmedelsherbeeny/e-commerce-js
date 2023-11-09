
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
    mode: "development",
    entry: {
        index: "./src/js/index.js",
        features: "./src/js/featured.js",
        editProfile: "./src/js/edit-profile.js"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].bundle.js"
    },
    watch: true,

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            }
        ],
    },
    plugins: [
        new htmlWebpackPlugin(({
            title: 'FirebaseApp',
            filename: 'index.html',
            template: 'src/index.html',
            chunks: ['index']
        })),
        new htmlWebpackPlugin({
            title: 'Featured',
            filename: 'featured.html',
            template: 'src/featured.html',
            chunks: ['featured']
        }),
        new htmlWebpackPlugin({
            title: 'Edit-Profile',
            filename: 'edit-profile.html',
            template: 'src/edit-profile.html',
            chunks: ['edit-profile']
        })
    ]

};