<template>
  <div style="padding:15px;">
    <div>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="mini">
        <el-form-item label="角色">
          <el-input v-model="queryForm.role_name" placeholder="角色" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmitQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQueryForm('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin: 10px 0;">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="addRoleClick">添加</el-button>
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
        prop="role_name"
        label="角色"
      />
      <el-table-column
        prop="role_code"
        label="角色代码"
      />
      <!-- <el-table-column
        prop="created_uname"
        label="创建人"
      /> -->
      <el-table-column
        prop="created_at"
        :formatter="fmtDate"
        label="创建时间"
      />
      <!-- <el-table-column
        prop="updated_uname"
        label="更新人"
      /> -->
      <el-table-column
        prop="updated_at"
        :formatter="fmtDate"
        label="更新时间"
      />
      <el-table-column
        label="操作"
        width="270"
      >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoleClick(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoleClick(scope.row)">删除</el-button>
          <el-button type="success" icon="el-icon-lock" size="mini" @click="authClick(scope.row)">权限</el-button>
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
        :total="tableRowsTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      :title="editTitle"
      :visible.sync="editDialog"
      width="30%"
    >
      <el-form ref="roleForm" :model="roleForm" :rules="roleFormRules" label-width="100px" class="demo-userForm">
        <el-form-item label="角色" prop="role_name">
          <el-input v-model="roleForm.role_name" />
        </el-form-item>
        <el-form-item label="角色代码" prop="role_code">
          <el-input v-model="roleForm.role_code" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit('roleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="权限"
      :visible.sync="authDialog"
      width="30%"
      top="0"
    >
      <el-tree
        ref="tree"
        :data="treeData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="defaultCheckedKeys"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="authDialog = false">取 消</el-button>
        <el-button type="primary" @click="authDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { roleQuery, typeCreate, typeUpdate, typeDelete } from '@/api/role'
import { getMenuAll, getRoleMenu, setRoleMenu } from '@/api/menu'

export default {
  data() {
    return {
      tableData: [],
      tableRowsTotal: 0,
      page: {
        current: 1,
        num: 10
      },
      queryForm: {},
      editTitle: '',
      editDialog: false,
      roleForm: {},
      roleFormRules: {
        role_name: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        role_code: [
          { required: true, message: '请输入角色代码', trigger: 'blur' }
        ]
      },
      authDialog: false,
      defaultProps: {
        children: 'children',
        label: 'metaTitle'
      },
      treeData: [],
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      curRow: null
    }
  },
  created() {
    this.roleQuery()
    this.getMenuAll()
  },
  methods: {
    roleQuery() {
      roleQuery({ page: this.page, query: this.queryForm }).then(res => {
        this.tableData = res.data.rows
        this.tableRowsTotal = res.data.count
      })
    },
    getMenuAll() {
      getMenuAll().then(res => {
        this.treeData = res.data
      })
    },
    addRoleClick() {
      this.editDialog = true
      this.editTitle = '添加'
      this.roleForm = {}
    },
    editRoleClick(row) {
      this.roleForm = row
      this.editTitle = '编辑'
      this.editDialog = true
    },
    createdSysRole() {
      typeCreate(this.roleForm).then(res => {
        if (!res.success) {
          this.$message.error(res.msg)
          return
        }
        this.editDialog = false
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        this.roleForm = {}
        this.roleQuery()
      })
    },
    updateSysRole() {
      typeUpdate(this.roleForm).then(res => {
        if (!res.success) {
          this.$message.error(res.msg)
          return
        }
        this.editDialog = false
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.roleForm = {}
        this.roleQuery()
      })
    },
    confirmEdit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.editTitle === '添加') {
            this.createdSysRole()
          } else {
            this.updateSysRole()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleteRoleClick(row) {
      const id = row.id
      this.$confirm(`是否删除角色【${row.role_name}】?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        typeDelete({ id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.roleQuery()
        })
      })
    },
    authClick(row) {
      this.curRow = row
      this.authDialog = true
      getRoleMenu({ id: row.id }).then(res => {
        this.$refs.tree.setCheckedKeys([])
        this.defaultExpandedKeys = []
        this.defaultCheckedKeys = []
        this.defaultExpandedKeys = res.data.map(v => {
          if (v.parentId) {
            return v.id
          }
        }).filter(v => {
          return !!v
        })
        this.defaultCheckedKeys = this.defaultExpandedKeys
      })
    },
    authDialogConfirm() {
      const roleAuthIds = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys())
      setRoleMenu({ menus: roleAuthIds, role: this.curRow.id }).then(res => {
        if (res.success) {
          this.authDialog = false
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }
      })
    },
    handleSizeChange(val) {
      this.page.num = val
      this.roleQuery()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.roleQuery()
    },
    onSubmitQuery() {
      this.roleQuery()
    },
    resetQueryForm(formName) {
      this.page = { current: 1, num: 10 }
      this.queryForm = {}
      this.roleQuery()
    },
    fmtDate(row, column) {
      var date = row[column.property]
      if (!date) { return '' }
      return moment(date).format('YYYY-MM-DD HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
