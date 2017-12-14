const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './src/Rest.js',
    output: {
        filename: './dist/Rest.min.js'
    },
    plugins: [
        new UglifyJSPlugin()
    ]
};