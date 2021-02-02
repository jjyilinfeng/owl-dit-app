const path = require('path');

module.exports = {
    output: {
        filename: 'my-first-webpack.bundle.js'
    },
    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, //
                loader: 'url-loader',
                exclude: [resolve('src/assets')],
                options: {
                    limit: 10000,

                }
            },
        ]
    }
};