require("ts-node").register({
    project: "./tsconfig.tsnode.json",
    transpileOnly: true,
});

module.exports = require("../tools/clean/cli.ts");
