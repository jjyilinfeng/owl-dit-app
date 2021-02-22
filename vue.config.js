const webpack = require('webpack');

module.exports={
    devServer: {
      host:"0.0.0.0",
        //public:"192.168.43.108:8088",
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
    outputDir: "dist",
    // 静态资源存放的文件夹(相对于ouputDir)
    assetsDir: "assets",
    // eslint-loader 是否在保存的时候检查(果断不用，这玩意儿我都没装)
    lintOnSave:false,
    productionSourceMap: true, // 不需要生产环境的设置false可以减小dist文件大小，加速构建

}