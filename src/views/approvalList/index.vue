<template>
  <div style="padding:15px;">
    <div>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="mini">
        <el-form-item label="联系方式">
          <el-input v-model="queryForm.phone" placeholder="联系方式" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmitQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQueryForm('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all">
        <apply :table-data="tableData" :active-name="activeName" />
      </el-tab-pane>
      <el-tab-pane label="未完成" name="W">
        <apply :table-data="tableData" :active-name="activeName" />
      </el-tab-pane>
      <el-tab-pane label="同意" name="A">
        <apply :table-data="tableData" :active-name="activeName" />
      </el-tab-pane>
      <el-tab-pane label="拒绝" name="D">
        <apply :table-data="tableData" :active-name="activeName" />
      </el-tab-pane>
    </el-tabs>

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


  </div>
</template>

<script>
import {applyQuery} from "@/api/apply";
import Apply from "@/components/apply";

export default {
  components: {Apply},
  data() {
    return {
      activeName: 'all',
      tableData: [],
      tableRowsTotal: 0,
      page: {
        current: 1,
        num: 999
      },
      queryForm: {},

    }
  },
  created() {
    this.applyQuery()
  },
  methods: {
    applyQuery() {
      applyQuery({ page: this.page, query: this.queryForm }).then(res => {
        // console.log(res)
        this.tableData = res.data.rows
        this.tableRowsTotal = res.data.count
      })
    },
    handleSizeChange(val) {
      this.page.num = val
      this.applyQuery()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.applyQuery()
    },
    onSubmitQuery() {
      this.applyQuery()
    },
    resetQueryForm(formName) {
      this.page = { current: 1, num: 10 }
      this.queryForm = {}
      this.handleClick()
      this.applyQuery()
    },
    handleClick() {
      if (this.activeName !== 'all'){
        this.queryForm.upt_act = this.activeName
      }else {
        delete this.queryForm.upt_act
      }
      this.page = {
        current: 1,
          num: 10
      }
      this.applyQuery()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
