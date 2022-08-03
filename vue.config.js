/* eslint-disable indent */
// // const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
// vue.config.js
const path = require('path')
module.exports = {
    css: {
        loaderOptions: {
            less: {
                // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
                modifyVars: {
                    // 直接覆盖变量
                    //   'nav-bar-background-color': '#007bff',
                    //   'nav-bar-title-text-color': '#fff'
                    //   或者可以通过 less 文件覆盖（文件路径为绝对路径）
                    // __dirname (2个下划线) 它是node环境下全局内置变量
                    // 当前文件所在文件夹的绝对路径
                    // __dirname 值: D:\最近\140_大神之路\项目_头条移动端\hmtt
                    // path.resolve() 会拼接后面的路径返回一个绝对路径(可以不写前面__dirname)
                    // path.resolve() 拼接的时候, 后面的不用写/

                    // path.join() 会拼接后面的路径(需要你自己写前缀的绝对地址)
                    // path.join() 拼接的时候, 可加可不加/
                    hack: `true; @import "${path.join(__dirname, '/src/styles/cover.less')}";`
                }
            }
        }
    },
    publicPath: './'  // 告诉webpack打包的index.html引入其他资源文件以./开头，不要默认/开头
}
