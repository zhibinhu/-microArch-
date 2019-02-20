<template>
    <div>
        <el-form ref="modelForm" :model="modelForm" :rules="rules" label-width="100px" class="demo-ruleForm">
            <el-collapse v-model="activeNames">
                <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                    <template slot="title">
                        <div class="moduleTit">
                            <h3>
                                <span class="infoTit">新增模型</span>
                            </h3>
                        </div>
                    </template>
                    <el-col :span="8" :offset="8" style="margin-top: 10px">
                        <el-form-item label="模型名称" prop="name">
                            <el-input v-model="modelForm.name" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="8">
                        <el-form-item label="模型Key" prop="key">
                            <el-input v-model="modelForm.key" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="8">
                        <el-form-item label="模型描述" prop="description">
                            <el-input v-model="modelForm.description" type="textarea" :rows="3" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                </el-collapse-item>
            </el-collapse>

            <div style="text-align:center;position: fixed;width:calc(100% - 235px);;bottom:20px;">
                <el-button type="primary" icon="el-icon-circle-plus-outline" size="medium" round
                           @click="submitForm('modelForm')">保存
                </el-button>
                <el-button class="el-icon-back" size="medium" round @click="close">返回</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    export default {
        components: {},
        data () {
            return {
                modelForm: {
                    id: '',
                    key: '',
                    name: '',
                    version: 1,
                    description: ''
                },
                rules: {
                    key: [
                        {required: true, message: '请输入模型key', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入模型名称', trigger: 'blur'}
                    ]
                },
                activeNames: ['1']
            };
        },
        mounted () {
            this.backfillData();// 如果使点击修改进来的就回显数据
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
                    url: this.prefix + '/microarch/activiti/model/save',
                    data: this.modelForm

                }).then(res => {
                    console.log(res);
                    // 成功回调方法
                    _this.$router.push({
                        name: 'workFlow/model/modelList'
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
                    name: 'workFlow/model/modelList'
                });
            },
            backfillData: function () {
                let _selectRow = this.$route.params.row;
                if (_selectRow) {
                    this.modelForm.id = _selectRow.id;
                    this.modelForm.key = _selectRow.key;
                    this.modelForm.name = _selectRow.name;
                    this.modelForm.version = _selectRow.version;
                    this.modelForm.description = _selectRow.description;
                }
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
