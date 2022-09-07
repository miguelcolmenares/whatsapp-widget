const path = require("path");
const PACKAGE = require("./package.json");

module.exports = {
	entry: "./src/ts/index.ts",
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