const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  //防止样式重复显示
  devServer: {
    client: {
      overlay: false,
    },
  },
})
