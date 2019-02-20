<template>
    <div>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-collapse  v-model="activeNames">
                <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                    <template slot="title">
                        <div class="moduleTit">
                            <h3>
                                <span class="infoTit">图片信息</span>
                            </h3>
                        </div>
                    </template>
                    <div class="moduleWhite" style="margin-top:20px;">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="图片名称" prop="name"
                                              :rules="[
                                           { required: true, message: '名称不能为空'}
                                        ]">
                                    <el-input v-model="ruleForm.name" size="small" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="图片类型" prop="type"
                                              :rules="[
                                           { required: true, message: '图片类型不能为空'}
                                        ]">
                                    <el-select v-model="ruleForm.type" style="width:100%;" size="small">
                                        <el-option
                                                v-for="item in typeOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="状态" prop="status">
                                    <el-switch
                                            size="small"
                                            v-model="ruleForm.status"
                                            :active-value="activeValue"
                                            :inactive-value="inactiveValue"
                                            active-text="启用"
                                            inactive-text="停用">
                                    </el-switch>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="排序号" prop="sort">
                                    <el-input-number  v-model="ruleForm.sort"  controls-position="right" size="small" :min="1" style="width: 100%;"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="备注" prop="remark">
                                    <el-input v-model="ruleForm.remark" type="textarea" :rows="3"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="图片" prop="id">
                                    <el-upload
                                        :action="UploadUrl()"
                                        :headers="tokenHeader"
                                        class="upload-edit"
                                        list-type="picture-card"
                                        :beforeUpload="beforeUpload"
                                        :on-remove="handleRemove"
                                        :before-remove="beforeRemove"
                                        :on-preview="handlePictureCardPreview"
                                        accept='.jpg,.png'
                                        :file-list="imagelist"
                                        :on-success="handleAvatarSuccess"
                                        :data = data
                                    >
                                    <i class="el-icon-plus"></i>

                                    <!--<el-button size="small" type="primary">点击上传</el-button>-->
                                    <div slot="tip" class="el-upload__tip" style="color:red">上传文件不超过200K</div>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" append-to-body>
                                        <img width="100%" :src="dialogImageUrl" alt="">
                                    </el-dialog>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
                <hr/>
            </el-collapse>
            <div style="text-align:center;position: fixed;width:calc(100% - 235px);;bottom:20px;">
                <el-button type="primary"  icon="el-icon-circle-plus-outline" size="medium" round @click="saveImages('ruleForm')">保存</el-button>
                <el-button class="el-icon-back" size="medium" round @click="goBack">返回</el-button>
            </div>
        </el-form>


    </div>
</template>
<script>
    export default {
        data () {
            return {
                ruleForm: {
                    id: '',
                    name: '',
                    type: '',
                    status: 'Y',
                    content: '',
                    remark: '',
                    sort: 1
                },
                tokenHeader: {
                    'Authorization': 'Sys ' + sessionStorage.getItem('token')
                },
                data: {},
                columns: [],
                objects: [],
                activeNames: ['1'],
                typeOptions: [
                    {
                        value: '01',
                        label: '首页轮播'
                    },
                    {
                        value: '02',
                        label: '其他'
                    }
                ],
                activeValue: 'Y',
                inactiveValue: 'N',
                dialogImageUrl: '',
                dialogVisible: false,
                imagelist: []
            };
        },
        mounted () {
        },
        created () {
            this.ruleForm.id = this.$route.params.id;
            this.backfilleditData();
            this.data = {'businessId': this.ruleForm.id};
        },
        methods: {
            UploadUrl () {
                return this.prefix + '/microarch/sys/images/upload';
            },
            myUpload (content) {
                if (!this.beforeUpload(content.file)) {
                    return false;
                }
                console.log('myUpload...');
                let fd = new FormData();
                fd.append('file', content.file);
                fd.append('businessId', this.ruleForm.id);
                // this.uploadFlag = true;
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/zuul/microarch/sys/images/upload',
                    data: fd
                }).then(res => {
                    content.onSuccess('配时文件上传成功');
                    content.file.id = res.data.attachId;
                    var data = res.data;
                    this.content = data.src;
                    // this.handlePictureCardPreview(content.file)
                    // this.saveUploadData.push(data.attachId)
                }).catch(error => {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        content.onError('配时文件上传失败(' + error.response.status + ')，' + error.response.data);
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        content.onError('配时文件上传失败，服务器端无响应');
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        content.onError('配时文件上传失败，请求封装失败');
                    }
                });
            },
            afterSuccess (response, file, fileList) {
            },

            beforeUpload (file) {
                const isLt2M = file.size / 1024  < 200;
                if (!isLt2M) {
                    this.$message({
                        message: '上传图片大小不能超过 200KB!',
                        type: 'warning',
                        duration: 1500,
                        onClose: () => {
                        }
                    });
                }
                return isLt2M;
            },

            backfilleditData () {
                var getDataId = this.ruleForm.id;
                if (getDataId) {
                    this.$myHttp({
                        method: 'post',
                        url: this.permissionPrefix + '/microarch/sys/images/view',
                        data: {
                            'entity': {
                                'id': getDataId
                            }
                        }
                    }).then(res => {
                        var backData = res.data.entity;
                        this.ruleForm.name = backData.name;
                        this.ruleForm.type = backData.type;
                        this.ruleForm.status = backData.status;
                        this.ruleForm.content = backData.content;
                        this.ruleForm.remark = backData.remark;
                        this.ruleForm.sort = backData.sort;
                        if (backData.content) {
                            var resArray = [];
                            resArray.push({
                                name: backData.name,
                                url: 'data:image/png;base64,' + backData.content,
                                id: backData.id
                            });
                            this.imagelist = resArray;
                        }
                    });
                }
            },
            handleChange (file, fileList) {
                this.fileList3 = fileList.slice(-3);
            },
            handleAvatarSuccess (response, file, fileList) {
                var uid = file.uid;
                for (var i = 0; i < fileList.length; i++) {
                    if (uid != fileList[i].uid) {
                        fileList.splice(i, 1);
                    }
                }
                this.content = response.src;
                this.ruleForm.content = response.src;
            },
            saveImages (ruleForm) {
                var _this = this;
                var dataId = _this.ruleForm.id;
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        this.$myHttp({
                            method: 'post',
                            url: _this.prefix + '/microarch/sys/images/save' + window.suffix,
                            data: {
                                'entity': {
                                    'id': dataId,
                                    'name': _this.ruleForm.name,
                                    'type': _this.ruleForm.type,
                                    'status': _this.ruleForm.status,
                                    'remark': _this.ruleForm.remark,
                                    'content': _this.ruleForm.content,
                                    'sort': _this.ruleForm.sort
                                }
                            }
                        }).then(res => {
                            // 成功回调
                            this.$message({
                                message: '保存成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    _this.$router.push({
                                        name: 'sys/images/imagesList'
                                    });
                                }
                            });
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            resetForm (formName) {
                this.$refs[formName].resetFields();
            },

            goBack () {
                this.$router.push({
                    name: 'sys/images/imagesList'
                });
            },
            handlePictureCardPreview (file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleChange (val) {
                console.log('val---', val);
            },
            handleRemove (file, fileList) {
                console.log(file, fileList);
            },

            handleExceed (files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove (file, fileList) {
                // return this.$confirm(`确定移除 ${ file.name }？`);
            }

        }
    };
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