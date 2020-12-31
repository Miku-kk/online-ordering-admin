<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    document.title = this.$route.meta.title ? this.$route.meta.title : '在线订餐系统后台'
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))))
    }
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  }
}
</script>

<style>
  body {
    background: #EDF0F4;
    min-width: 1366px;
  }
  /* 解决element-ui的table表格控件表头与内容列不对齐问题 */
  .el-table th.gutter{
    display: table-cell!important;
  }

  /* 解决element-ui的table表格控件表头下边框消失 */
  .el-table td, .el-table th.is-leaf {
    bottom: 1px !important;
  }
</style>

