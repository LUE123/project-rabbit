const { defineConfig } = require('@vue/cli-service')

const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭每次保存代码都进行eslint检验
  lintOnSave: false,

  // devServer: {
  //   open: true,
  //   port: 8080,
  //   host: 'localhost'
  // },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      // 那些文件自动引入 使用绝对路径
      // 需要使用path.join来拼接完整路径  __dirname绝对路径 + 现在的路径（根据vue.config.js这个文件的路径往下找）
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less')
      ]
    }
  },
  //   // 小于10kb的图 转化成base64格式
  // chainWebpack: config => {
  //   config.module
  //     .rule('images')
  //     .use('url-loader')
  //     .loader('url-loader')
  //     .tap(options => Object.assign(options, { limit: 10000 }))
  // },

  configureWebpack: {
      // 开启IP域名访问
      devServer: { allowedHosts: ['www.corho.com'] },
      // # 这个是设置外部扩展，模块为qc变量名为QC，导入qc将不做打包。
      externals: {
        qc: 'QC'
      }
  },

    
})
