import { Configuration as WebpackConfiguration, DefinePlugin } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import SentryCliPlugin from "@sentry/webpack-plugin";

import path from "path";

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}

const packageJSON = require("./package.json");

export default (_: any, argv: { mode: "development" | "production" }): Configuration => {
    const config: Configuration =  {
        entry: "./src/index.tsx",
        module: {
            rules: [
                {
                    test    : /\.tsx?$/,
                    use     : "ts-loader",
                    exclude : /node_modules/,
                }, {
                    test      : /\.(avif|png|svg|ttf|webp|woff2)$/,
                    type      : "asset/resource",
                    generator : {
                        filename: "assets/[name][ext]",
                    }
                }, {
                    test      : /favicon\.png$/,
                    type      : "asset/resource",
                    generator : {
                        filename: "[name][ext]",
                    }
                }, {
                    test    : /\.css$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader"]
                }
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
            plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })]
        },
        output: {
            filename : "main-[chunkhash].js",
            path     : path.resolve(__dirname, "dist")
        },
        devtool: "source-map",
        plugins: [
            new HtmlWebpackPlugin({
                template: "src/index.html",
            }),
            new MiniCssExtractPlugin(),
            new DefinePlugin({
                "process.env.CONFIG_FILE": JSON.stringify(argv.mode === "production" ? "config.json" : "config.dev.json"),
            }),
        ],
        devServer: {
            static: {
                publicPath: path.resolve(__dirname, "dist"),
            },
            allowedHosts : "all",
            compress     : false,
            port         : 3000,
        }
    }

    if (argv.mode === "production") {
        config.plugins?.push(new SentryCliPlugin({
            authToken  : process.env.SENTRY_AUTH_TOKEN,
            org        : "cacabox",
            project    : "qui-est-ce",
            release    : packageJSON.version,
            include    : ".",
            ignoreFile : ".sentrycliignore",
            ignore     : ["node_modules", "webpack.config.js", "webpack.config.ts"],
            configFile : "sentry.properties",
        }));
    }

    return config;
};
