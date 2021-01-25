<template>
  <div style="padding:15px;">
    <div>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="mini">
        <el-form-item label="分类">
          <el-input v-model="queryForm.type_name" placeholder="分类" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmitQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQueryForm('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin: 10px 0;">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="addSortClick">添加</el-button>
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
        prop="type_name"
        label="分类"
      />
      <el-table-column
        prop="created_at"
        :formatter="fmtDate"
        label="创建时间"
      />
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
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editTypeClick(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTypeClick(scope.row)">删除</el-button>
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
      <el-form ref="typesForm" :model="typesForm" :rules="typesFormRules" label-width="100px" class="demo-userForm">
        <el-form-item label="分类" prop="type_name">
          <el-input v-model="typesForm.type_name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit('typesForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import {applyQuery,typeCreate,typeDelete,typeUpdate} from "@/api/types";

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
      typesForm: {},
      typesFormRules: {
        type_name: [
          { required: true, message: '请输入分类名', trigger: 'blur' }
        ]
      },
      authDialog: false,
      treeData: [],
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      curRow: null
    }
  },
  created() {
    this.typesQuery()
  },
  methods: {
    typesQuery() {
      applyQuery({ page: this.page, query: this.queryForm }).then(res => {
        this.tableData = res.data.rows
        this.tableRowsTotal = res.data.count
      })
    },
    addSortClick() {
      this.editDialog = true
      this.editTitle = '添加'
      this.typesForm = {}
    },
    editTypeClick(row) {
      this.typesForm = row
      this.editTitle = '编辑'
      this.editDialog = true
    },
    createdSysRole() {
      typeCreate(this.typesForm).then(res => {
        if (!res.success) {
          this.$message.error(res.msg)
          return
        }
        this.editDialog = false
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        this.typesForm = {}
        this.typesQuery()
      })
    },
    updateSysRole() {
      typeUpdate(this.typesForm).then(res => {
        if (!res.success) {
          this.$message.error(res.msg)
          return
        }
        this.editDialog = false
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.typesForm = {}
        this.typesQuery()
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
    deleteTypeClick(row) {
      const id = row.type_id
      this.$confirm(`是否删除分类【${row.type_name}】?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        typeDelete({ id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.typesQuery()
        })
      })
    },
    handleSizeChange(val) {
      this.page.num = val
      this.typesQuery()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.typesQuery()
    },
    onSubmitQuery() {
      this.typesQuery()
    },
    resetQueryForm(formName) {
      this.page = { current: 1, num: 10 }
      this.queryForm = {}
      this.typesQuery()
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
