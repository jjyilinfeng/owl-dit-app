const webpack = require('webpack');

module.exports={
    devServer: {
      host:"0.0.0.0",
      port:8088,
        proxy:{
          '/api':{
              target:'http://localhost:8000/',
              secure:false,
              ws:true,
              changeOrigin:true,
              pathRewrite:{
                  '^/api':''
              }
          }
        },
    },
    configureWebpack:{
        plugins: [
            new webpack.ProvidePlugin({
                $:"jquery",
                jQuery:"jquery",
                "windows.jQuery":"jquery"
            })
        ]
    },
    publicPath: './',

}