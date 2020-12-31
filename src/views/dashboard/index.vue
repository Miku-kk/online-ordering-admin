<template>
  <div class="dashboard-container">
    <h3>欢迎您 {{ name }}</h3>
    角色代码：{{ rolecode }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCurUser } from '@/api/user'

export default {
  name: 'Dashboard',
  components: {

  },
  data() {
    return {
      user: {}
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'rolecode'
    ])
  },
  created() {
    // this.getCurUser()
    this.$router.push({ path: '/' })
  },
  methods: {
    getCurUser() {
      getCurUser().then(res => {
        this.user = res.data.user
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
  .box-card {
    width: 480px;
  }

</style>
