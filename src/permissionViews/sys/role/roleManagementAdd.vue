
<template>

    <el-col :span="24">

        <el-form ref="ruleForm" :model="ruleForm"  :rules="rules" label-width="80px" style="margin-top: 0px;margin-bottom: 20px" class="demo-ruleForm">
            <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                    <template slot="title">
                        <div class="moduleTit">
                            <h3>
                                <span class="infoTit">角色管理</span>
                            </h3>
                        </div>
                    </template>

                    <el-col :span="12" :xs="20" >
                        <el-form-item label="角色编码"  prop="roleCode">
                            <el-input v-model="ruleForm.roleCode" style="width: 75%" size="small"></el-input>
                        </el-form-item>

                    </el-col>

                    <el-col :span="12" :xs="20">
                        <el-form-item label="角色名称"  prop="roleName">
                            <el-input v-model="ruleForm.roleName" style="width: 75%" size="small"></el-input>
                        </el-form-item>

                    </el-col>

                    <el-col :span="12" :xs="20">
                        <el-form-item label="角色状态" prop="status">
                            <el-switch
                                    v-model="ruleForm.status"
                                    active-text="启用"
                                    inactive-text="停用">
                            </el-switch>
                        </el-form-item>

                    </el-col>

                    <el-col :span="12" :xs="20">
                        <el-form-item label="角色描述" prop="memo">
                            <el-input v-model="ruleForm.memo" style="width: 75%" size="small"></el-input>
                        </el-form-item>

                    </el-col>
                </el-collapse-item>
            </el-collapse>
            <div style="text-align:center;position: fixed;width:calc(100% - 235px);;bottom:20px;">
                <el-button @click="submitForm('ruleForm')" icon="el-icon-circle-plus-outline" type="primary" style="margin-top: 20px;margin-bottom: 10px" round size="small">保存</el-button>
                <el-button @click="close()" icon="el-icon-back" style="margin-top: 20px;margin-bottom: 10px" round size="small">返回</el-button>

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
                isEmptyRole: {
                    dataCode: '',
                    dataName: ''
                },
                channelTypeData: [],
                /* State: true, */
                ruleForm: {
                    roleCode: '',
                    roleName: '',
                    memo: '',
                    status: true
                },
                rules: {
                    roleCode: [
                        { required: true, message: '请输入角色编码', trigger: 'change' }
                    ],
                    roleName: [
                        { required: true, message: '请输入角色名称', trigger: 'change' }
                    ],
                    memo:[
                        { required: true, message: '请输入角色描述', trigger: 'change' }
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'change'}
                    ],
                },
                radio: '1',
                activeNames: ['1']
            };
        },
        methods: {
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.saveRoleManagement();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            saveRoleManagement () {
                var _this = this;
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix + '/microarch/sys/sysrole/checkRoleNameExist',
                    data: {'entity': {'roleName': _this.ruleForm.roleName}}
                }).then(resRoleName => {
                    console.log('resRoleName', resRoleName);
                    _this.isEmptyRole.dataName = resRoleName.data.rows.length;
                    console.log('insidename', _this.isEmptyRole.dataName);
                    if (_this.isEmptyRole.dataName != '0') {
                        this.$message({
                            showClose: true,
                            message: '角色名称已存在！请重新输入角色名称！',
                            type: 'warning'
                        });
                    } else {
                        this.$myHttp({
                            method: 'POST',
                            url: this.prefix + '/microarch/sys/sysrole/checkRoleCodeExist',
                            data: {'entity': {'roleCode': _this.ruleForm.roleCode}}
                        }).then(resRoleCode => {
                            _this.isEmptyRole.dataCode = resRoleCode.data.rows.length;
                            console.log('inside', _this.isEmptyRole.dataCode);
                            if (_this.isEmptyRole.dataCode != '0') {
                                this.$message({
                                    showClose: true,
                                    message: '角色编码已存在！请重新输入角色编码！',
                                    type: 'warning'
                                });
                            } else {
                                var param = {};
                                if (this.ruleForm.status) {
                                    this.ruleForm.status = 'Y';
                                } else {
                                    this.ruleForm.status = 'N';
                                }

                                this.$myHttp({
                                    method: 'POST',
                                    url: this.prefix + '/microarch/sys/sysrole/save',
                                    data: {'entity': this.ruleForm}

                                }).then(res => {
                                    console.log(res);
                                    // 成功回调方法
                                    _this.$router.push({
                                        name: 'sys/role/roleManagementList'
                                    });
                                    this.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                });
                            }
                        });
                    }
                });
            },
            close: function () {
                this.$router.push({
                    name: 'sys/role/roleManagementList'
                });
            },
            handleChange (val) {
                console.log('val---', val);
            }
        },
        created () {

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
