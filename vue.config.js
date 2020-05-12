// const JSEncodePlugin = require('./jjencode.js')
console.log(process.env.NODE_ENV)
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? 'https://webres.psy-1.com/sgy/dist' : './', // /cosleep/teacher/    ./ https://webres.psy-1.com/sgy/dist
  assetsDir: './'
  // configureWebpack: {
  //   plugins: [
  //     new JSEncodePlugin({
  //       global: '$',
  //       jsReg: /^app\..+\.js/,
  //       assetsPath: './dist/js'
  //     })
  //   ]
  // },
}
