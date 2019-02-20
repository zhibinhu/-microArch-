<template>
    <el-col :span="24">

        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" style="margin-top: 0px;margin-bottom: 20px" class="demo-ruleForm">
            <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                    <template slot="title">
                        <div class="moduleTit">
                            <h3>
                                <span class="infoTit">流程规则</span>
                            </h3>
                        </div>
                    </template>
                    <el-col :span="8" :offset="2" style="margin-top: 10px">
                        <el-form-item label="工单类型"  prop="orderType">
                            <el-select v-model="ruleForm.orderType" placeholder="" size="small" @change="onchangeSelect()" style="width: 100%">
                                <el-option
                                        v-for="item in woTypeData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="2" style="margin-top: 10px">
                        <el-form-item label="流程名称"  prop="processName">
                            <el-input v-model="ruleForm.processName"  style="width: 100%" size="small" ref="managerInput" readonly> </el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="2">
                        <el-form-item label="流程key"  prop="processKey">
                            <el-input v-model="ruleForm.processKey"  style="width: 100%" size="small" readonly> </el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="2">
                        <el-form-item label="流程版本"  prop="processVersion">
                            <el-input v-model="ruleForm.processVersion"  style="width: 100%" size="small" readonly> </el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="2">
                        <el-form-item label="节点编码"  prop="nodeCode">
                            <el-select v-model="ruleForm.nodeCode" placeholder="" @change="getNodeName()" size="small" style="width: 100%">
                                <el-option
                                        v-for="item in nodeCodeData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="2">
                        <el-form-item label="规则描述"  prop="remark">
                            <el-input v-model="ruleForm.remark"  style="width: 100%" size="small"> </el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="18" :offset="2">
                        <el-form-item label="规则"  prop="remark">
                            <el-input v-model="ruleForm.rule"  style="width: 100%" type="textarea" :rows="3" size="small"> </el-input>
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

    export default {
        name: 'custRuleEdit',
        data () {
            return {
                ruleForm: {
                    id: '',
                    orderType: '',
                    processName: '',
                    processVersion: '',
                    nodeCode: '',
                    nodeName: '',
                    processKey: '',
                    remark: '',
                    rule: ''
                },
                rules: {
                    orderType: [
                        {required: true, message: '请输入工单类型', trigger: 'change'}
                    ],
                    processName: [
                        {required: true, message: '请输入流程名称', trigger: 'change'}
                    ],
                    processKey: [
                        {required: true, message: '请输入流程key', trigger: 'change'}
                    ],
                    nodeCode: [
                        {required: true, message: '请输入节点编码', trigger: 'change'}
                    ]
                },
                activeNames: ['1'],
                woTypeData: [],
                nodeCodeData: [],
                // dirArry:['postType','status'],
                dirArry: ['woType']
            };
        },
        methods: {
            submitForm (formName) {
                var _this = this;
                var formId;
                if (this.$route.query.addFlag) {
                    formId = '000';
                } else {
                    formId = this.ruleForm.id;
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let rule = _this.ruleForm.rule;
                        if (rule.includes('insert') || rule.includes('update') || rule.includes('rename') || rule.includes('drop') || rule.includes('delete')) {
                            this.$message({
                                showClose: true,
                                message: '规则中不可有update、insert等非法字段',
                                type: 'warning'
                            });
                        } else {
                            this.saveProjectsInfo();
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            saveProjectsInfo () {
                var _this = this;
                console.log('提交的数据：', _this.ruleForm);
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix + '/microarch/activiti/rule/save',
                    data: {'entity': _this.ruleForm}

                }).then(res => {
                    // orgApp.orgListSave().then(res=>{
                    // 成功回调方法
                    _this.$router.push({
                        name: 'workFlow/custRule/custRuleList'
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
                    name: 'workFlow/custRule/custRuleList'
                });
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
                        url: this.prefix + '/microarch/activiti/rule/view',
                        data: {
                            'entity': {
                                'id': dataId
                            }
                        }
                    }).then(res => {
                        // 成功回调方法
                        _this.ruleForm = res.data.entity;
                        this.$myHttp({
                            method: 'get',
                            url: this.prefix + '/microarch/activiti/rule/processinfo/' + _this.ruleForm.orderType
                        }).then(res => {
                            _this.ruleForm.processName = res.data.process.procName;
                            _this.ruleForm.processKey = res.data.process.procKey;
                            _this.ruleForm.processVersion = res.data.process.procVersion;
                            var resData = [];
                            res.data.nodes.forEach(o => {
                                resData.push({
                                    label: o.name,
                                    value: o.id
                                });
                            });
                            _this.nodeCodeData = resData;
                        });
                    });
                }
            },
            onchangeSelect () {
                var _this = this;
                _this.ruleForm.processName = '';
                _this.ruleForm.processKey = '';
                _this.ruleForm.processVersion = '';
                _this.ruleForm.nodeCode = '';
                _this.nodeCodeData = [];
                this.$myHttp({
                    method: 'get',
                    url: this.prefix + '/microarch/activiti/rule/processinfo/' + _this.ruleForm.orderType
                }).then(res => {
                    _this.ruleForm.processName = res.data.process.procName;
                    _this.ruleForm.processKey = res.data.process.procKey;
                    _this.ruleForm.processVersion = res.data.process.procVersion;
                    var resData = [];
                    res.data.nodes.forEach(o => {
                        resData.push({
                            label: o.name,
                            value: o.id
                        });
                    });
                    _this.nodeCodeData = resData;
                });
            },
            getNodeName () {
                var _this = this;
                this.$myHttp({
                    method: 'get',
                    url: this.prefix + '/microarch/activiti/rule/processinfo/' + _this.ruleForm.orderType
                }).then(res => {
                    for (var n = 0; n < res.data.nodes.length; n++) {
                        if (res.data.nodes[n].id == _this.ruleForm.nodeCode) {
                            _this.ruleForm.nodeName = res.data.nodes[n].name;
                        }
                    }
                });
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

<style scoped>
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