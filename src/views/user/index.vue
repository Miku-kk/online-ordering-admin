<template>
  <div class="user-index" style="padding: 15px;">
    <div>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="mini">
        <el-form-item label="登录账号">
          <el-input v-model="queryForm.username" placeholder="登录账号" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="queryForm.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="queryForm.role" placeholder="角色">
            <el-option v-for="item in roleArr" :key="item.random" :value="item.id" :label="item.role_name" @change="roleChange(item.id)" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmitQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQueryForm('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin: 10px 0;">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="createUser">添加</el-button>
    </div>

    <el-table
      stripe
      border
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{
        'font-size':'17px',
        'font-weight':500,
        'color': '#64B5FF'
      }"
    >
      <el-table-column fixed label="#" width="50" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="username"
        label="登录账号"
      />
      <el-table-column
        prop="name"
        label="姓名"
      />
      <el-table-column
        prop="phone"
        label="电话号码"
        width="110"
      />
      <el-table-column
        prop="address"
        label="地址"
      />
      <el-table-column
        prop="role_name"
        label="角色"
        width="100"
      />
      <el-table-column
        prop="created_at"
        :formatter="fmtDate"
        label="创建时间"
        width="140"
      />
      <el-table-column
        label="操作"
        width="270"
      >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row)">删除</el-button>
          <el-dropdown style="margin-left: 10px;" trigger="click" @visible-change="dropdownChange(scope.row)" @command="handleCommand">
            <el-button size="mini">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="resetpsw" icon="el-icon-refresh">重置密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0;text-align:center;">
      <el-pagination
        background
        :current-page="page.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="usersTblTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      :title="editTitle"
      :visible.sync="editDialog"
      width="30%"
      top="40px"
    >
      <el-form ref="userForm" size="mini" :model="userForm" :rules="userFormRules" label-width="100px" class="demo-userForm">
        <el-form-item label="登录账号" prop="username">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" />
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item label="角色" prop="userRole">
          <el-select v-model="userForm.userRole" placeholder="角色" @change="$set(roleArr, index, roleArr[index])">
            <el-option
              v-for="item in roleArr"
              :key="item.id"
              :label="item.role_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="userForm.address" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit('userForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import moment from 'moment'
import md5 from 'blueimp-md5'
import { queryPage, createUser, updateUser, deleteUser, resetPsw } from '@/api/user'
import { roleQuery } from '@/api/role'

export default {
  data() {
    return {
      roleArr: [],
      userForm: {},
      userFormRules: {
        username: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        // phone: [
        //   { required: true, message: '请输入电话号码', trigger: 'blur' }
        // ],
        userRole: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      tableData: [],
      editTitle: '',
      editDialog: false,
      queryForm: {},
      page: {
        current: 1,
        num: 10
      },
      usersTblTotal: 0,
      curRow: {},
      studentGradeArr: [] // 学生年级
    }
  },
  created() {
    this.queryPage()
    this.roleQuery()
  },
  methods: {
    queryPage() {
      queryPage({ page: this.page, query: this.queryForm }).then(res => {
        this.tableData = res.data.rows
        this.usersTblTotal = res.data.count
      })
    },
    createUser() {
      this.editTitle = '添加'
      this.userForm = {}
      this.editDialog = true
    },
    editUser(row) {
      row.password = ''
      this.userFormRules.password[0].required = false
      this.editTitle = '修改'
      this.userForm = row
      this.userForm.userRole = parseInt(row.role_id)
      this.editDialog = true
    },
    confirmEdit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.editTitle === '添加') {
            createUser(this.userForm).then(res => {
              if (!res.success) {
                this.$message.error(res.msg)
                return
              }
              this.editDialog = false
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.queryPage()
            })
          } else {
            if (this.userForm.password === '') {
              delete this.userForm.password
            } else {
              this.userForm.password = md5(this.userForm.password)
            }

            updateUser(this.userForm).then(res => {
              this.editDialog = false
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.queryPage()
            })
          }
        } else {
          return false
        }
      })
    },
    deleteUser(row) {
      const id = row.id
      this.$confirm(`是否删除用户【${row.username}】?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({ id }).then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.queryPage()
          } else {
            this.$message.error('删除失败!')
          }
        })
      })
    },
    roleQuery() {
      roleQuery({ page: { current: 1, num: 9999 }}).then(res => {
        this.roleArr = res.data.rows
      })
    },
    roleChange(val) {
      // 如果存在则删除，不存在则添加
      const arr = this.userForm.roleCode
      if (arr && arr.includes(val)) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === val) {
            arr.splice(i, 1)
            break
          }
        }
      } else {
        this.userForm.roleCode.push(val)
      }
    },
    onSubmitQuery() {
      this.queryPage()
    },
    handleSizeChange(val) {
      this.page.num = val
      this.queryPage()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.queryPage()
    },
    resetQueryForm(formName) {
      this.page = { current: 1, num: 10 }
      this.queryForm = {}
      this.queryPage()
    },
    // 更多下拉菜单出现的时候，赋值到curRow，以便后续操作
    dropdownChange(row) {
      this.curRow = row
    },
    handleCommand(command) {
      if (command === 'resetpsw') {
        this.$confirm(`是否重置用户【${this.curRow.username}】的密码?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resetPsw({ id: this.curRow.id }).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '密码重置成功!'
              })
            }
          })
        })
      }
    },
    fmtDate(row, column) {
      var date = row[column.property]
      if (date === undefined) { return '' }
      return moment(date).format('YYYY-MM-DD HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
.user-index {
  .el-select {
    width: 100%;
  }
}

</style>

