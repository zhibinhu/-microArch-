<template>
    <div>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-collapse  v-model="activeNames">
                <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                    <template slot="title">
                        <div class="moduleTit">
                            <h3>
                                <span class="infoTit">定时任务信息</span>
                            </h3>
                        </div>
                    </template>
                    <div class="moduleWhite" style="margin-top:20px;">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="bean名称" prop="beanName"
                                       :rules="[
                                           { required: true, message: 'bean名称不能为空'}
                                        ]">
                                    <el-input v-model="ruleForm.beanName" size="small" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="方法名称" prop="methodName"
                                       :rules="[
                                           { required: true, message: '方法名称不能为空'}
                                        ]">
                                    <el-input v-model="ruleForm.methodName" size="small" clearable></el-input>

                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="参数" prop="params">
                                    <el-input v-model="ruleForm.params" size="small" clearable></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="cron表达式" prop="cronExpression"
                                        :rules="[
                                           { required: true, message: 'cron表达式不能为空'}
                                        ]">
                                    <el-input v-model="ruleForm.cronExpression" size="small" clearable></el-input>

                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="备注" prop="remark">
                                    <el-input v-model="ruleForm.remark" size="small" clearable></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
                <hr/>
            </el-collapse>
            <div style="text-align:center;position: fixed;width:calc(100% - 235px);;bottom:20px;">
                <el-button type="primary"  icon="el-icon-circle-plus-outline" size="medium" round @click="saveCfields('ruleForm')">保存</el-button>
                <el-button class="el-icon-back" size="medium" round @click="goBack">返回</el-button>
            </div>
        </el-form>


    </div>
</template>
<script>
    export default {
        data(){
            return {
                ruleForm: {
                    id:'',
                    beanName: '',
                    methodName: '',
                    params:'',
                    cronExpression:'',
                    remark:'',
                    status:0
                },
                columns:[],
                objects:[],
                activeNames:['1']
            }
        },
        mounted(){
        },
        created(){
            this.ruleForm.id = this.$route.params.id
            this.backfilleditData()
        },
        methods: {
            backfilleditData(){
                var getDataId = this.ruleForm.id
                if(getDataId){
                    this.$myHttp({
                        method: 'post',
                        url: this.permissionPrefix+'/microarch/sys/schedule/view',
                        data:{
                            "entity":{
                                "id":getDataId
                            }
                        }
                    }).then(res => {
                        var backData = res.data.entity;
                        this.ruleForm.beanName = backData.beanName
                        this.ruleForm.methodName = backData.methodName
                        this.ruleForm.params = backData.params
                        this.ruleForm.cronExpression = backData.cronExpression
                        this.ruleForm.remark = backData.remark
                        this.ruleForm.status = backData.status
                    })
                }
            },
            saveCfields(ruleForm){
                var _this = this;
                var dataId = _this.ruleForm.id;
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        this.$myHttp({
                            method: 'post',
                            url: _this.prefix + '/microarch/sys/schedule/save' + window.suffix,
                            data: {
                                "entity": {
                                    "id": dataId,
                                    "beanName": _this.ruleForm.beanName,
                                    "methodName": _this.ruleForm.methodName,
                                    "params": _this.ruleForm.params,
                                    "cronExpression": _this.ruleForm.cronExpression,
                                    "remark":_this.ruleForm.remark,
                                    "status":_this.ruleForm.status
                                },
                            }
                        }).then(res => {
                            //成功回调
                            this.$message({
                                message: '保存成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    _this.$router.push({
                                        name: 'sys/schedule/scheduleList'
                                    });
                                }
                            });

                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            goBack(){
                this.$router.push({
                    name: 'sys/schedule/scheduleList'
                });
            },
            handleChange(val){
                console.log('val---',val)
            }

        }
    }


</script>
<style scoped>
    hr{
        height:0px;
        border:0px solid #ccc;
        margin:10px 0;
    }
    .roleUl{
        width:500px;
        height:auto;
        border:1px solid #ccc;
        border-bottom: 0;
        margin-top:5px;
        min-width:370px;
        margin-bottom:10px;
        overflow:hidden;
    }
    .roleUl li{
        border-bottom:1px solid #ccc;
        font-size:14px;
        text-align:center;
        min-width:370px;
        height:44px;
    }
    .roleUl li span{
        display:inline-block;
        padding:5px 0 7px 0;
        height:100%;
        box-sizing: border-box;
        float:left;
    }
    .roleUl li span.checkselect{
        width:50px;
        padding-left:10px;
    }
    .roleUl li span.selectName{
        width:200px;
        line-height: 33px;
        border-right:1px solid #ccc;
    }
    .roleCodeSpan{
        width:200px;
        line-height: 33px;
        border-right:1px solid #ccc;
        margin-left: 15px;
        top: -5px;
    }
    span.btnAction{
        margin-left:24px;
        top:-3px;
        position: relative;
    }
    .tree{
        position:absolute;
        top:0
    }
    .transFace{
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:2;
        cursor:pointer;
    }
    /**优化界面***/
    .moduleWhite2{
        background: #fff;
        /*padding:10px;*/
    }
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
    .sliceLine{
        border-top:1px dashed #ddd;
        margin-bottom:22px;
    }

</style>