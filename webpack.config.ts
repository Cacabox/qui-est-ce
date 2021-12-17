import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}

export default function(): Configuration {
    return {
        entry: "./src/index.tsx",
        module: {
            rules: [
                {
                    test    : /\.tsx?$/,
                    use     : "ts-loader",
                    exclude : /node_modules/,
                }, {
                    test      : /\.html$/,
                    type      : "asset/resource",
                    generator : {
                        filename: "[name][ext]",
                    }
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
            filename : "main.js",
            path     : path.resolve(__dirname, "dist")
        },
        plugins: [new MiniCssExtractPlugin()],
        devServer: {
            static: {
                publicPath: path.resolve(__dirname, "dist"),
            },
            allowedHosts : "all",
            compress     : false,
            port         : 3000,
        }
    }
};
