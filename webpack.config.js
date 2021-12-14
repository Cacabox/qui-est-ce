require("ts-node").register({
    project: "./tsconfig.tsnode.json",
    transpileOnly: true,
});

module.exports = require("./webpack.config.ts");
