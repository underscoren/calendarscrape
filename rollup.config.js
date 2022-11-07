const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const { uglify } = require("rollup-plugin-uglify");

module.exports = {
    input: "src/main.js",
    output: {
        file: "dist/bundle.min.js",
        format: "iife",
        name: "bundle",
        sourcemap: true
    },
    plugins: [
        nodeResolve({
            browser: true
        }),
        commonjs(),
        uglify()
    ]
};