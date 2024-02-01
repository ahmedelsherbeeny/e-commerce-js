const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    mode: "development",
    resolve: {
        modules: ["node_modules"],
        fallback: { crypto: false },
    },
    entry: {
        signUp: "./src/js/sign-up.js",
        index: ["./src/js/index.js", "./src/css/index.css"],
        features: "./src/js/featured.js",
        editProfile: "./src/js/edit-profile.js",
        profile: "./src/js/profile.js",
        signIn: "./src/js/sign-in.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        clean: true,
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist"),
        },
        hot: true,
        open: true,
        historyApiFallback: true,
        compress: true,
        port: 3000,
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "images/", // Output directory for images
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new htmlWebpackPlugin({
            title: "Sign-Up",
            filename: "sign-up.html",
            template: "src/sign-up.html",
            chunks: ["signUp"],
        }),
        new htmlWebpackPlugin({
            title: "FirebaseApp",
            filename: "index.html",
            template: "src/index.html",
            chunks: ["index"],
        }),
        new htmlWebpackPlugin({
            title: "Featured",
            filename: "featured.html",
            template: "src/featured.html",
            chunks: ["features"],
        }),
        new htmlWebpackPlugin({
            title: "Edit-Profile",
            filename: "edit-profile.html",
            template: "src/edit-profile.html",
            chunks: ["editProfile"],
        }),
        new htmlWebpackPlugin({
            title: "Profile",
            filename: "profile.html",
            template: "src/profile.html",
            chunks: ["profile"],
        }),
        new htmlWebpackPlugin({
            title: "Sign-In",
            filename: "sign-in.html",
            template: "src/sign-in.html",
            chunks: ["signIn"],
        }),
        new MiniCssExtractPlugin({
            filename: "[name].bundle.css",
            chunkFilename: "[id].css",
        }),

    ],
};
