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

    <Merchants :table-data="tableData" :active-name="activeName" />

    <div style="padding: 10px 0;text-align:center;">
      <el-pagination
        background
        :current-page="page.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>


  </div>
</template>

<script>
import {merchantsQueryAll} from "@/api/merchants";
import Merchants from "@/components/merchants";

export default {
  components: {Merchants},
  data() {
    return {
      activeName: 'all',
      tableData: [],
      queryForm: {},
      page: {
        current: 1,
        num: 10,
        total: 0
      },
    }
  },
  async created() {
    await this.merchantsQueryAll()
  },
  methods: {
    merchantsQueryAll() {
      merchantsQueryAll({ page: this.page, query: this.queryForm }).then(async res => {
        // console.log(res)
        this.tableData = res.data.rows
        this.page.total = res.data.count
      })
    },
    onSubmitQuery() {
      console.log(this.queryForm)
      this.merchantsQueryAll()
    },
    resetQueryForm(formName) {
      this.page = { current: 1, num: 10 }
      this.queryForm = {}
      this.merchantsQueryAll()
    },
    handleSizeChange(val) {
      this.page.num = val
      this.merchantsQueryAll()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.merchantsQueryAll()
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
      this.merchantsQueryAll()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
