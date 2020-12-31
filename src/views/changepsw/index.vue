<template>
  <div style="padding: 15px;">
    <el-form ref="passForm" :model="passForm" :rules="rules" label-width="100px">
      <el-form-item label="原密码" prop="oldPass">
        <el-input v-model="passForm.oldPass" type="password" autocomplete="off" style="width:300px;" />
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input v-model="passForm.pass" type="password" autocomplete="off" style="width:300px;" />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model="passForm.checkPass" type="password" autocomplete="off" style="width:300px;" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('passForm')">确认</el-button>
        <el-button @click="resetForm('passForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { changePsw } from '@/api/user'

export default {
  name: 'ChangePsw',
  components: {

  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.passForm.checkPass !== '') {
          this.$refs.passForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.passForm.checkPass !== '') {
          this.$refs.passForm.validateField('checkPass')
        }
        callback()
      }
    }
    return {
      passForm: {
        pass: '',
        checkPass: '',
        oldPass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validateCheckPass, trigger: 'blur' }
        ],
        oldPass: [
          { validator: validateOldPass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {

  },
  created() {

  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          changePsw(this.passForm).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '修改密码成功,下次登录请使用新密码!',
                duration: 5000
              })
            } else {
              this.$message.error('原密码错误!')
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
