
<template>

    <el-col :span="24" style="background-color: white" >

        <h2 style="margin-top: 10px;margin-left: 10px;margin-bottom: 15px">
            配置业务表单
        </h2>
        <el-form ref="addForm" :model="addForm"  :rules="rules" label-width="80px" style="margin-top: 20px;margin-bottom: 20px" class="demo-addForm">

            <!--
               <span> {{this.$route.params.routeParams}} </span>
                @ApiModelProperty(value = "模型ID")
                private String modeId;
                @ApiModelProperty(value = "流程名称")
                private String procName;
                @ApiModelProperty(value = "流程版本")
                private String procVersion;
                @ApiModelProperty(value = "流程定义Key")
                private String procDefKey ;
                @ApiModelProperty(value = "表单Code")
                private String formCode;
                @ApiModelProperty(value = "表单URL路径")
                private String formUrl;
                slot="reference"
            -->

            <el-col :span="8" :xs="20">
                <el-form-item label="单据类型">
                    <el-select v-model="addForm.formCode" placeholder="请选择表单类型" size="small" style="width: 95%">
                        <el-option label="请假申请" value="gaoceng"></el-option>
                        <el-option label="报销单" value="zhongceng"></el-option>
                        <el-option label="出差审批" value="jiceng"></el-option>
                        <el-option label="其他" value="qita"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="8" :xs="20">
                <el-form-item label="表单路径" prop="formUrl">
                    <el-input v-model="addForm.formUrl" style="width: 95%" size="small"></el-input>
                </el-form-item>
            </el-col>

            <el-col :span="8" :xs="20" >
                <el-form-item label="流程名"  prop="procName"  >
                    <el-input v-model="addForm.procName"   style="width: 95%" size="small" readOnly  > </el-input>
                </el-form-item>
            </el-col>


            <el-col :span="8" :xs="20" >
                <el-form-item label="流程版本"  prop="procVersion">
                    <el-input v-model="addForm.procVersion" style="width: 95%" size="small"></el-input>
                </el-form-item>
            </el-col>


            <el-col :span="8" :xs="20" >
                <el-form-item label="表单ID"  prop="procName">
                    <el-input v-model="addForm.id"   style="width: 95%" size="small"  readOnly > </el-input>
                </el-form-item>
            </el-col>


            <el-col :span="8" :xs="20" >
                <el-form-item label="流程Key"  prop="procDefKey">
                    <el-input v-model="addForm.procDefKey"   style="width: 95%" size="small" readOnly> </el-input>
                </el-form-item>
            </el-col>

            <el-col :span="8" :xs="20" >
                <el-form-item label="模型ID"  prop="modeId">
                    <el-input v-model="addForm.modeId"   style="width: 95%" size="small" readOnly> </el-input>
                </el-form-item>
            </el-col>







            <el-col :span="8" :offset="10">
                <el-button @click="submitForm('addForm')" type="primary" style="margin-top: 20px;margin-bottom: 10px" >提交</el-button>
                <el-button @click="close()"  style="margin-top: 20px;margin-bottom: 10px" >取消</el-button>
            </el-col>
        </el-form>

    </el-col>

</template>

<script>
  export default {
      name: 'projectManagement-page',
      components: {
      },
      data () {
          return {
              channelTypeData: [],
              /* State: true, */
              addForm: {
                  procName: '',
                  procVersion: '',
                  formCode: '',
                  formUrl: '',
                  modelId: '',
                  procDefKey: '',
                  tempData: ''
              },
              rules: {
                  procName: [
                      { required: true, message: '请输入流程名', trigger: 'change' }
                  ],
                  procVersion: [
                      { required: true, message: '请输入版本号', trigger: 'change' }
                  ],
                  formUrl: [
                      { required: true, message: '请输入表单路径', trigger: 'change' }
                  ],
                  formCode: [
                      { required: true, message: '请选项表单类型', trigger: 'change' }
                  ]
              },
              radio: '1'
          };
      },
      mounted () {
          console.log('自动执行方法');
          if (this.$route.name == 'workFlow/mapping/addForm') {
              console.log('route name === ' + this.$route.name);
              this.backfillData();// 如果使点击修改进来的就回显数据
          }
      },
      methods: {
          submitForm (formName) {
              this.$refs[formName].validate((valid) => {
                  if (valid) {
                      this.saveForm();
                  } else {
                      console.log('error submit!!');
                      return false;
                  }
              });
          },
          saveForm () {
              var _this = this;
              this.$myHttp({
                  method: 'POST',
                  url: this.prefix + '/microarch/activiti/config/setForm',
                  data: {'entity': this.addForm}
              }).then(res => {
                  console.log(res);
                  // 成功回调方法
                  _this.$router.push({
                      name: 'workFlow/formList'
                  });
                  this.$message({
                      showClose: true,
                      message: '保存成功！',
                      type: 'success'
                  });
              });
          },
          close: function () {
              this.$router.push({
                  name: 'workFlow/formList'
              });
          },
          backfillData: function () {
              this.channelTypeData = this.$route.params.routeParams;
              console.log('id==' + this.channelTypeData[0].id);
              console.log('key==' + this.channelTypeData[0].key);
              this.addForm.modeId = this.channelTypeData[0].id;
              this.addForm.procDefKey = this.channelTypeData[0].key;
              this.addForm.procName = this.channelTypeData[0].name;
              this.addForm.procVersion = this.channelTypeData[0].version;
              if (this.channelTypeData) {
                  this.$myHttp({
                      method: 'post',
                      url: this.prefix + '/microarch/activiti/config/getForm',
                      data: {
                          'entity': {
                              'modeId': this.channelTypeData[0].id
                          }
                      }
                  }).then(res => {
                      console.log('resources--------', res);
                      if (res.data) {
                          var getData = res.data;
                          this.addForm.formUrl = getData.form_url;
                          this.addForm.formCode = getData.form_code;
                          this.addForm.id = getData.id;
                      }
                  });
              }

              // addForm.procName=rs[0].name;
          }

      },
      created () {

      }
  };
</script>








<style>

</style>
