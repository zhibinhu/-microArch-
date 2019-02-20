
<template>

    <el-col :span="24">

        <el-form ref="ruleForm" :model="ruleForm"  :rules="rules" label-width="80px" style="margin-top: 0px;margin-bottom: 20px" class="demo-ruleForm">
            <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                    <template slot="title">
                        <div class="moduleTit">
                            <h3>
                                <span class="infoTit">岗位管理</span>
                            </h3>
                        </div>
                    </template>
                    <el-col :span="8"><div class="grid-content bg-purple">
                        <el-form-item label="岗位编码:">
                            {{ruleForm.postCode}}
                        </el-form-item>
                    </div></el-col>

                    <el-col :span="8"><div class="grid-content bg-purple">
                        <el-form-item label="岗位名称:">
                            {{ruleForm.postName}}
                        </el-form-item>
                    </div></el-col>

                    <el-col :span="8"><div class="grid-content bg-purple">
                        <el-form-item label="排序号:">
                            {{ruleForm.orderNum}}
                        </el-form-item>
                    </div></el-col>

                    <el-col :span="8"><div class="grid-content bg-purple">
                        <el-form-item label="岗位类型:">
                            {{ruleForm.postType}}
                        </el-form-item>
                    </div></el-col>

                    <el-col :span="8" :xs="20">
                        <el-form-item label="岗位状态">
                            <el-switch
                                    v-model="ruleForm.status"
                                    active-text="启用"
                                    inactive-text="禁用"
                                    :disabled="true">
                            </el-switch>
                        </el-form-item>

                    </el-col>
                </el-collapse-item>
            </el-collapse>
            <div style="text-align:center;position: fixed;width:calc(100% - 235px);;bottom:20px;">
                <el-button @click="close()" icon="el-icon-back" round style="margin-top: 20px;margin-bottom: 10px" size="small">返回</el-button>
            </div>
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
              ruleForm: {
                  postCode: '',
                  postName: '',
                  orderNum: '',
                  status: true,
                  postType: ''
              },
              rules: {
                  postCode: [
                      { required: true, message: '请输入岗位编码', trigger: 'change' }
                  ],
                  postName: [
                      { required: true, message: '请输入岗位名称', trigger: 'change' }
                  ],
                  orderNum: [
                      { required: true, message: '请输入岗位序号', trigger: 'change' }
                  ]
              },
              radio: '1',
              activeNames: ['1']
          };
      },
      methods: {
          submitForm (formName) {
              this.$refs[formName].validate((valid) => {
                  if (valid) {
                      this.savePostManagement();
                  } else {
                      console.log('error submit!!');
                      return false;
                  }
              });
          },
          savePostManagement () {
              var _this = this;
              console.log('提交的数据：', this.ruleForm.status);
              var param = {};
              if (this.ruleForm.status) {
                  this.ruleForm.status = 'Y';
              } else {
                  this.ruleForm.status = 'N';
              }

              this.$myHttp({
                  method: 'POST',
                  url: this.prefix + '/microarch/sys/syspost/save',
                  data: {'entity': this.ruleForm}

              }).then(res => {
                  console.log(res);
                  // 成功回调方法
                  _this.$router.push({
                      name: 'sys/post/postManagementList'
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
                  name: 'sys/post/postManagementList'
              });
          },
          handleChange (val) {
              console.log('val---', val);
          }
      },
      created () {
          var _this = this;
          if (this.$route.params.id) {
              sessionStorage.setItem('edit_dataId', this.$route.params.id);
          }
          var getDataId = sessionStorage.getItem('edit_dataId');
          var dataId = this.$route.params.id ? this.$route.params.id : getDataId;
          if (dataId) {
              this.$myHttp({
                  method: 'POST',
                  url: this.prefix + '/microarch/sys/syspost/view',
                  /* url: "http://192.168.99.24:6004/channel/view", */
                  data: {
                      'entity': {
                          'id': dataId
                      }
                  }
              }).then(res => {
                  // 成功回调方法
                  console.log('chenggongweidiao___res', res.data.entity);
                  _this.ruleForm = res.data.entity;
                  if (res.data.entity.status == 'Y' || res.data.entity.status == 'true') {
                      _this.ruleForm.status = true;
                  } else if (res.data.entity.status == 'N' || res.data.entity.status == 'false') {
                      _this.ruleForm.status = false;
                  }
                  const allDicts = JSON.parse(localStorage.getItem('sysDict'));
                  for (let j = 0; j < allDicts.length; j++) {
                      if (allDicts[j].dtype == 'postType') {
                          for (let i = 0; i < allDicts[j].sysDicts.length; i++) {
                              if (allDicts[j].sysDicts[i].dkey == _this.ruleForm.postType) {
                                  _this.ruleForm.postType = allDicts[j].sysDicts[i].dvalue;
                              }
                          }
                      }
                  }
              });
          }
      }
  };
</script>

<style>
    .moduleTit h3{
        border-bottom: 1px solid #ccc;
        font-weight:normal;
        font-size:16px;
        color:#333;
        line-height: 25px;
        margin-bottom: 20px;
        padding:10px 0;
    }
    .moduleTit h3 span.infoTit{
        font-size:14px;
        padding-left:15px;
        border-left: 5px solid #2d8cf0;
    }
    .moduleTit h3 span.infoIcon{
        float:right;
        font-size:20px;
        padding-right: 20px;
        cursor: pointer;
    }
</style>
