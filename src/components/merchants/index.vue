<template>
  <div>
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
        prop="merchant_name"
        label="店铺名称"
      />
      <el-table-column
        prop="phone"
        label="联系方式"
      />
      <el-table-column
        prop="address"
        label="地址"
      />
      <el-table-column
        prop="upt_act"
        label="状态"
      >
        <template slot-scope="scope">
          {{scope.row.upt_act === 'D'?'暂停营业':(scope.row.upt_act === 'U'?'营业中':'强制关闭')}}
        </template>
      </el-table-column>
      <el-table-column
        label="拒绝原因"
        prop="reason"
      >
        <template slot-scope="scope">
          {{ scope.row.reason?scope.row.reason:'允许营业' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="270"
      >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-view" size="mini" @click="view(scope.row)">查看</el-button>
          <el-button v-if="scope.row.upt_act !== 'N'" type="danger" icon="el-icon-delete" size="mini" @click="edit(scope.row)">禁止营业</el-button>
          <el-button v-else type="success" icon="el-icon-edit" size="mini" @click="edit(scope.row)">允许营业</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="查看"
      :visible.sync="editDialog"
      width="40%"
    >
      <div>
        <el-form label-width="120px" class="apply-Form">
          <el-form-item label="店铺名称">
            {{ applyForm.merchant_name }}
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            {{ applyForm.phone }}
          </el-form-item>
          <el-form-item label="运营时间" prop="time" class="time">
            {{ applyForm.time_start }} 至 {{ applyForm.time_end }}
          </el-form-item>
          <el-form-item label="提前多久预约" prop="appointment_time" class="time">
            {{ getTime(applyForm.appointment_time) }}
          </el-form-item>
          <el-form-item label="地址" prop="address">
            {{ applyForm.address }}
          </el-form-item>
          <el-form-item label="平均价格" prop="avg_price">
            {{ applyForm.avg_price }}
          </el-form-item>
          <el-form-item label="店铺图片" prop="store_url">
            <el-image
              style="width: 100%;height: 100%"
              :src="applyForm.store_url"
              :preview-src-list="[applyForm.store_url]"
            />
          </el-form-item>

          <el-form-item label="店铺描述" prop="desc">
            <div>
              {{ applyForm.desc }}
            </div>
          </el-form-item>
          <el-form-item label="拒绝理由" prop="reason">
            <div>
              {{ applyForm.reason?applyForm.reason:'允许营业' }}
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <el-dialog
      title="拒绝原因"
      :visible.sync="reasonDialog"
      width="30%"
    >
      <el-form ref="applyForm" :model="applyForm" :rules="applyFormRules" label-width="100px" class="demo-userForm">
        <el-form-item label="拒绝原因" prop="reason">
          <el-input v-model="applyForm.reason"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reasonDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit('applyForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import {merchantsUpdate} from "@/api/merchants";

export default {
  name: "Apply",
  props: {
    tableData: {
      type: Array,
      default: () => {
      }
    },
    activeName: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      applyForm: '',
      dialogVisible:false,
      dialogImageUrl:'',
      applyFormRules: {
        reason: [
          {required: true, message: '请输入拒绝理由', trigger: ['blur','change']}
        ]
      },
      editDialog: false,
      reasonDialog: false,
    }
  },
  computed:{
    getTime(){
      return (time)=>{
        return time > 60 ? (time / 60 >= 60 ? parseInt(time / 60 / 60) + '小时' + parseInt(time / 60 % 60) + '分钟'
          + (parseInt(time % 60) === 0 ? '' : parseInt(time % 60) + '秒') : parseInt(time / 60 % 60) + '分钟' +
          (parseInt(time % 60) === 0 ? '' : parseInt(time % 60) + '秒')) : time + '秒'
      }
    }
  },
  watch:{
    reasonDialog(v){
      if (!v){
        this.$parent.merchantsQueryAll()
      }
    }
  },
  methods: {
    confirmEdit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.merchantsUpdate()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    merchantsUpdate(){
      if (this.applyForm.upt_act === 'N'){
        this.applyForm.upt_act = 'D'
        this.applyForm.reason = '允许营业'
      }else {
        this.applyForm.upt_act = 'N'
      }
      merchantsUpdate({id:this.applyForm.id,upt_act:this.applyForm.upt_act,reason:this.applyForm.reason}).then(res => {
        this.reasonDialog = false
        if (res.success){
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }else {
          this.$message({
            type: 'error',
            message: '操作失败!'
          })
        }
        this.$parent.merchantsQueryAll()
      })
    },
    view(row) {
      this.applyForm = row
      this.editDialog = true
    },
    edit(row) {
      this.applyForm = row
      this.$confirm(`是否${row.upt_act === 'N'?'允许':'禁止'}【${row.merchant_name}】营业?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.upt_act !== 'N'){
          this.applyForm.reason = ''
          this.reasonDialog = true
        }else {
          this.merchantsUpdate()
        }
      }).catch(()=>{})
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
  }
}
</script>

<style scoped>
</style>
