// 生产环境导入组件
module.exports = file => () => {
  try {
        import('@/views/' + file + '.vue')
  } catch (error) {
        import('@/components/None/index.vue')
  }
}
