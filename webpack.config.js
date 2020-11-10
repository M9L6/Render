const path = require("path");

module.exports = {
    entry: {
        index: path.join(__dirname, "main.ts"),
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: path.resolve(__dirname, "./tsconfig.json"),
                    },
                },
            },
        ],
    },
    output: {
        path: path.join(__dirname, "./dist"),
        filename: "[name]-bundle.js",
    },
};
