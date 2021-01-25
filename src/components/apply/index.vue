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
        prop="user_name"
        label="联系人"
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
          {{scope.row.upt_act === 'D'?'拒绝':(scope.row.upt_act === 'A'?'同意':'未完成')}}
        </template>
      </el-table-column>
      <el-table-column
        v-if="activeName === 'D'"
        label="拒绝原因"
        prop="reason"
      />
      <el-table-column
        label="操作"
        width="270"
      >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-view" size="mini" @click="view(scope.row)">查看</el-button>
          <el-button type="success" v-if="scope.row.upt_act === 'W'" icon="el-icon-check" size="mini" @click="operation(scope.row,'A')">同意</el-button>
          <el-button type="danger" v-if="scope.row.upt_act === 'W'" icon="el-icon-close" size="mini" @click="operation(scope.row,'D')">拒绝</el-button>
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
          <el-form-item label="联系人" prop="user_name">
            {{ applyForm.user_name }}
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            {{ applyForm.phone }}
          </el-form-item>
          <el-form-item label="身份证号码" prop="id_card">
            {{ applyForm.id_card }}
          </el-form-item>
          <el-form-item label="店铺类型" prop="type_name">
            {{ applyForm.type_name }}
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
          <el-form-item label="营业执照(正面)" prop="license_front_url">
            <el-image
              style="width: 100%;height: 100%"
              :src="applyForm.license_front_url"
              :preview-src-list="[applyForm.license_front_url]"
            />
          </el-form-item>
          <el-form-item label="营业执照(背面)" prop="license_bg_url">
            <el-image
              style="width: 100%;height: 100%"
              :src="applyForm.license_bg_url"
              :preview-src-list="[applyForm.license_bg_url]"
            />
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
          <el-form-item label="拒绝理由" v-if="applyForm.reason" prop="reason">
            <div>
              {{ applyForm.reason }}
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
import {applyUpdate} from "@/api/apply";

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
    parent(){
      return this.$parent.$parent.$parent
    },
    getTime(){
      return (time)=>{
        return time > 60 ? (time / 60 >= 60 ? parseInt(time / 60 / 60) + '小时' + parseInt(time / 60 % 60) + '分钟'
          + (parseInt(time % 60) === 0 ? '' : parseInt(time % 60) + '秒') : parseInt(time / 60 % 60) + '分钟' +
          (parseInt(time % 60) === 0 ? '' : parseInt(time % 60) + '秒')) : time + '秒'
      }
    }
  },
  methods: {
    confirmEdit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          applyUpdate({apply_id:this.applyForm.apply_id,upt_act:'D'}).then(res => {
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
            this.parent.applyQuery()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    view(row) {
      this.applyForm = row
      this.editDialog = true
      console.log(this.applyForm)
    },
    operation(row,type) {
      this.applyForm = row
      this.$confirm(`是否${type === 'D'?'拒绝':'同意'}【${row.merchant_name}】的开店请求?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 'A'){
          applyUpdate({apply_id:row.apply_id,upt_act:type}).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.parent.applyQuery()
          })
        }else {
          this.reasonDialog = true
        }

      })
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
