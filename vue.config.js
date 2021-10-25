// 后端请求地址 注意[他会根据你环境的不同从而获取的 env 文件不同]
const target = process.env.APP_API_URL;

module.exports = {
  // chainWebpack(config) {
  //   // 在chainWebpack中添加下面的代码
  //   config.entry('main.ts').add('babel-polyfill'); // main是入口js文件
  // },
  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
    host: 'localhost',
    port: 8080,
    https: false,
    open: false,
    hotOnly: true,
    // 所有的接口请求代理
    proxy: {
      '^/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '/api',
        },
        logLevel: 'debug',
      },
    },
  },
};
