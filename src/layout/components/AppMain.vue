<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <div class="app-main-view">
        <router-view :key="key" />
      </div>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*减去头部*/
  min-height: calc(100vh - 90px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
.app-main-view {
  margin: 0 10px 10px;
  /* background: #fff; */
  min-height: calc(100vh - 100px);
  /* padding: 5px; */
  /* border-radius: 4px; */
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
