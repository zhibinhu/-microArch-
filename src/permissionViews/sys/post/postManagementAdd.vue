
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

                    <el-col :span="8" :xs="20" >
                        <el-form-item label="岗位编码"  prop="postCode">
                            <el-input v-model="ruleForm.postCode" style="width: 95%" size="small"></el-input>
                        </el-form-item>

                    </el-col>

                    <el-col :span="8" :xs="20">
                        <el-form-item label="岗位名称"  prop="postName">
                            <el-input v-model="ruleForm.postName" style="width: 95%" size="small"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" :xs="20">
                        <el-form-item label="排序号" prop="orderNum">
                            <el-input v-model="ruleForm.orderNum" style="width: 95%" size="small" @keyup.native="number"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" :xs="20">
                        <el-form-item label="岗位类型">
                            <el-select v-model="ruleForm.postType" placeholder="请选择岗位类型" size="small" style="width: 95%">
                                <el-option
                                        v-for="item in postTypeData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" :xs="20">
                        <el-form-item label="岗位状态">
                            <el-switch
                                    v-model="ruleForm.status"
                                    active-text="启用"
                                    inactive-text="禁用">
                            </el-switch>
                        </el-form-item>

                    </el-col>
                </el-collapse-item>
            </el-collapse>
            <div style="text-align:center;position: fixed;width:calc(100% - 235px);;bottom:20px;">
                <el-button @click="submitForm('ruleForm')" icon="el-icon-circle-plus-outline" type="primary" round style="margin-top: 20px;margin-bottom: 10px" size="small">保存</el-button>
                <el-button @click="close()" icon="el-icon-back" round style="margin-top: 20px;margin-bottom: 10px" size="small">返回</el-button>
            </div>
        </el-form>
    </el-col>
</template>

<script>
    import util from '../../../libs/util';
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
                postTypeData: [],
                dirArry: ['postType'],
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
            number () {
                this.ruleForm.orderNum = this.ruleForm.orderNum.replace(/[^\.\d]/g, '');
                this.ruleForm.orderNum = this.ruleForm.orderNum.replace('.', '');
            },
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
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix + '/microarch/sys/syspost/checkPostCodeExist',
                    data: {'entity': {'postCode': _this.ruleForm.postCode}}
                }).then(resPostCode => {
                    if (resPostCode.data.rows.length != '0') {
                        this.$message({
                            showClose: true,
                            message: '岗位编码已存在！请重新输入岗位编码！',
                            type: 'warning'
                        });
                    } else {
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
                    }
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
        mounted: function () {
            util.getSelectData(this, this.dirArry);
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
