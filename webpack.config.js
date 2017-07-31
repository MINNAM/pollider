var path = require('path');

module.exports = [{
    entry: './client/app.js',
    output: {
        filename: 'app.js',
        path: path.join('public/javascripts/')
    },

    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'es2016', 'stage-2' ]
                }
            }
        ],
    }


},{
    entry: './public/theme/default/browser.js',
    output: {
        filename: 'blog.js',
        path: path.join( __dirname + '/public/javascripts/')
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'es2016', 'stage-2' ]
                }
            }
        ],
    }
}];
