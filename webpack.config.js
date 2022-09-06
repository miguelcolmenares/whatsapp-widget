const path = require("path");
const PACKAGE = require("./package.json");

module.exports = {
    entry: "./src/ts/index.ts",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.ts$/,
                loader: "string-replace-loader",
                options: {
                    multiple: [
                        { search: "{{package}}", replace: PACKAGE.name },
                        { search: "{{url}}", replace: PACKAGE.cdn },
                        { search: "{{version}}", replace: PACKAGE.version }
                    ]
                }
            },
            {
                test: /\.less$/i,
                exclude: /node_modules/,
                use : [
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        path: path.resolve(__dirname, "dist/js"),
        filename: PACKAGE.name + ".js",
    },
};