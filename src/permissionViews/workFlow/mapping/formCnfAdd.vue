<template>

    <el-col :span="24">

        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" style="margin-top: 0px;margin-bottom: 20px" class="demo-ruleForm">
            <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                    <template slot="title">
                        <div class="moduleTit">
                            <h3>
                                <span class="infoTit">工单配置</span>
                            </h3>
                        </div>
                    </template>
                    <el-col :span="8" :offset="8" style="margin-top: 10px">
                        <el-form-item label="流程名称"  prop="procName">
                            <div @click="showDialog">
                            <el-input v-model="ruleForm.procName"  style="width: 100%" size="small" ref="managerInput" clearable readonly> </el-input>
                            </div>
                        </el-form-item>
                        <el-dialog top="8vh" width="65%" title="请选择流程" :visible.sync="dialogTableVisible" :append-to-body="true" :modal-append-to-body="false">
                            <process-list @getManagerName="showManagerName" id="formStyle"></process-list>
                        </el-dialog>
                    </el-col>

                    <el-col :span="8" :offset="8">
                        <el-form-item label="流程版本"  prop="procVersion">
                            <el-input v-model="ruleForm.procVersion"  style="width: 100%" size="small" readonly> </el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="8">
                        <el-form-item label="单据类型"  prop="woCode">
                            <el-select v-model="ruleForm.woCode" placeholder="" size="small" style="width: 100%">
                                <el-option
                                        v-for="item in woTypeData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="8">
                        <el-form-item label="跳转路径"  prop="woUrl">
                            <el-input v-model="ruleForm.woUrl"  style="width: 100%" size="small"> </el-input>
                        </el-form-item>
                    </el-col>
                </el-collapse-item>
            </el-collapse>

            <div style="text-align:center;position: fixed;width:calc(100% - 235px);;bottom:20px;">
                <el-button @click="submitForm('ruleForm')" icon="el-icon-circle-plus-outline" type="primary" style="margin-top: 20px;margin-bottom: 10px" round size="small">保存</el-button>
                <el-button @click="close()"  style="margin-top: 20px;margin-bottom: 10px" icon="el-icon-back" round size="small">返回</el-button>
            </div>
        </el-form>
    </el-col>
</template>

<script>
    import util from '../../../libs/util';
    import processList from './processList';

    export default {
        components: {processList},
        data () {
            return {
                ruleForm: {
                    id: '',
                    procKey: '',
                    procName: '',
                    procVersion: '',
                    woUrl: '',
                    woCode: '',
                    woName: ''
                },
                rules: {
                    procName: [
                        {required: true, message: '请输入流程名称', trigger: 'change'}
                    ],
                    procVersion: [
                        {required: true, message: '请输入流程版本', trigger: 'change'}
                    ],
                    woCode: [
                        {required: true, message: '请输入单据类型', trigger: 'change'}
                    ],
                    woUrl: [
                        {required: true, message: '请输入跳转路径', trigger: 'change'}
                    ]
                },
                activeNames: ['1'],
                woTypeData: [],
                // dirArry:['postType','status'],
                dirArry: ['woType'],
                dialogTableVisible: false
            };
        },
        methods: {
            submitForm (formName) {
                var formId;
                if (this.$route.query.addFlag) {
                    formId = '000';
                } else {
                    formId = this.ruleForm.id;
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$myHttp({
                            method: 'POST',
                            url: this.prefix + '/microarch/activiti/mapping/unique/woCode',
                            data: {'entity': {'id': formId, 'woCode': this.ruleForm.woCode}}

                        }).then(resBoolean => {
                            if (resBoolean.data) {
                                this.saveProjectsInfo();
                            } else {
                                this.$message({
                                    showClose: true,
                                    message: '单据类型已存在！请重新选择单据类型',
                                    type: 'warning'
                                });
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            saveProjectsInfo () {
                var _this = this;
                for (var i = 0; i < this.woTypeData.length; i++) {
                    if (this.woTypeData[i].value == _this.ruleForm.woCode) {
                        _this.ruleForm.woName = this.woTypeData[i].label;
                    }
                }
                console.log('提交的数据：', this.ruleForm);
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix + '/microarch/activiti/mapping/save',
                    data: {'entity': this.ruleForm}

                }).then(res => {
                    // orgApp.orgListSave().then(res=>{
                    // 成功回调方法
                    _this.$router.push({
                        name: 'workFlow/mapping/formCnfList'
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
                    name: 'workFlow/mapping/formCnfList'
                });
            },
            showDialog (event) {
                if (event.target.tagName == 'I' || event.target.tagName == 'SPAN') {
                    return;
                }
                this.dialogTableVisible = true;
                // 修改el-dialog样式
                setTimeout(function () {
                    document.getElementsByClassName('el-dialog__body')[0].style.padding = '0px 5px 30px 5px';
                    var formStyle = document.getElementById('formStyle').getElementsByClassName('el-form-item');
                    for (var i = 0; i < formStyle.length; i++) {
                        formStyle[i].style.marginBottom = '5px';
                    }
                }, 0);
                // 解决表格表头错位的问题
                setTimeout(function () {
                    var curTable = document.getElementById('curTable');
                    var thGutter = curTable.getElementsByClassName('gutter')[0];
                    thGutter.style.display = 'table-cell';
                }, 500);
            },
            showManagerName (val, procVersion, key) {
                this.ruleForm.procName = val;
                this.ruleForm.procVersion = procVersion;
                this.ruleForm.procKey = key;
                console.log('shenmebiwanyier', this.ruleForm.procKey);
                this.dialogTableVisible = false;
                this.$refs.managerInput.focus();
                this.$refs.managerInput.blur();
            },
            handleChange (val) {
                console.log('val---', val);
            },
            backfillData () {
                var _this = this;
                if (this.$route.params.id) {
                    sessionStorage.setItem('edit_dataId', this.$route.params.id);
                }
                var getDataId = sessionStorage.getItem('edit_dataId');
                var dataId = this.$route.params.id ? this.$route.params.id : getDataId;
                if (dataId) {
                    this.$myHttp({
                        method: 'POST',
                        url: this.prefix + '/microarch/activiti/mapping/view',
                        data: {
                            'entity': {
                                'id': dataId
                            }
                        }
                    }).then(res => {
                        // 成功回调方法
                        _this.ruleForm = res.data.entity;
                    });
                }
            }
        },
        created () {
            // 组织单位
            util.getSelectData(this, this.dirArry);
            if (this.$route.query.addFlag) {
                sessionStorage.removeItem('edit_dataId');
            } else {
                // 如果点击了编辑按钮回显数据
                this.backfillData();
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

