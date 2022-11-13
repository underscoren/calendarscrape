const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const terser = require("@rollup/plugin-terser");

module.exports = {
    input: "src/manual.js",
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
        terser()
    ]
};