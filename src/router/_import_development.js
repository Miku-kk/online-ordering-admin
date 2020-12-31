// 开发环境导入组件
module.exports = file => {
  try {
    return require('@/views/' + file + '.vue').default
  } catch (error) {
    return require('@/components/None/index.vue').default
  }
}
