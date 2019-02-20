<template>
    <div>
        <el-col :span="24">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-collapse v-model="activeNames">
                    <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                        <template slot="title">
                            <div class="moduleTit">
                                <h3>
                                    <span class="infoTit">信息</span>
                                </h3>
                            </div>
                        </template>
                        <div class="moduleWhite" style="margin-top:20px;">
                            <el-row style="padding-left: 50px">
                                <el-col :span="8">
                                    <el-form-item label="文档类型" prop="documentType">
                                        <el-select v-model="ruleForm.documentType" style="width:100%;" size="small" disabled>
                                            <el-option
                                                    v-for="item in documentTypeData"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="标题" prop="documentTitle">
                                        <el-input v-model="ruleForm.documentTitle" size="small" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row style="padding-left: 50px">
                                <el-col :span="8">
                                    <el-form-item
                                            label="是否有效"
                                            prop="documentEnable"
                                    >
                                        <el-select v-model="ruleForm.documentEnable" style="width:100%;" size="small" disabled>
                                            <el-option
                                                    v-for="item in documentEnableData"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="备注" prop="remark">
                                        <el-input v-model="ruleForm.documentDesc" type="textarea" :rows="2" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                        </div>
                    </el-collapse-item>
                </el-collapse>

            </el-form>
        </el-col>
        <el-col :span="24" v-show="showUeditor">
            <el-collapse v-model="activeNames">
                <el-collapse-item style="padding:0 20px;background: #fff;" name="2">
                    <template :span="20" slot="title">
                        <div class="moduleTit">
                            <h3>
                                <span class="infoTit">编辑框</span>
                            </h3>
                        </div>
                    </template>
                    <el-form ref="editorForm" :model="editorForm" style="margin-top: 20px;margin-bottom: 20px">
                        <vue-ueditor-wrap v-model="msg" :config="myConfig" @ready="ready"></vue-ueditor-wrap>
                    </el-form>
                </el-collapse-item>
            </el-collapse>
        </el-col>

        <!--<el-col :span="24">-->
            <!--<el-collapse v-model="activeNames">-->
                <!--<el-collapse-item style="padding:0 20px;background: #fff;" name="3">-->
                    <!--<template :span="20" slot="title">-->
                        <!--<div class="moduleTit">-->
                            <!--<h3>-->
                                <!--<span class="infoTit">附件</span>-->
                            <!--</h3>-->
                        <!--</div>-->
                    <!--</template>-->
                    <!--<my-upload  :bisinessId="ruleForm.id" :viewPageFlag="viewFlag"></my-upload>-->
                <!--</el-collapse-item>-->
            <!--</el-collapse>-->
        <!--</el-col>-->
        <div style="text-align:center;position: fixed;width:calc(100% - 235px);bottom:20px;">
            <el-button class="el-icon-back" size="medium" round @click="backList">返回</el-button>
        </div>
    </div>
</template>

<script>
    import myUpload from '@/components/myUpload';
    import VueUeditorWrap from 'vue-ueditor-wrap';
    import util from '../../../libs/util';
    export default {
        components: {myUpload, VueUeditorWrap},
        name: 'editDocument',
        data () {
            return {
                msg: '<h2>请在此处输入文本内容</h2>',
                viewFlag: 'view',
                myConfig: {
                    // 如果需要上传功能,找后端小伙伴要服务器接口地址
                    // serverUrl: 'http://api.demo.com/ueditor/upload',
                    // 你的UEditor资源存放的路径,相对于打包后的index.html
                    UEDITOR_HOME_URL: './static/UEditor/',
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 240,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 关闭自动保存
                    enableAutoSave: false,

                    readonly: true
                },
                ready (editorInstance) {
                    console.log(`编辑器实例${editorInstance.key}: `, editorInstance);
                },
                ruleForm: {
                    id: '',
                    documentTitle: '',
                    documentType: '',
                    documentEnable: '',
                    documentDesc: '',
                    content: ''
                },
                dirArry: ['documentType','documentEnable'],
                documentTypeData: [],
                documentEnableData: [],
                editorForm: {

                },
                // action:this.prefix + '/microarch/sys/attach/upload',
                fileList: [],
                autoUpload: true,
                uploadData: {},
                saveUploadData: [],
                uploadPercent: 0,
                uploadFlag: false,
                showUeditor: false,
                activeNames: ['1', '2']
            };
        },
        created () {
            this.ruleForm.id = this.$route.params.id;
            this.backfilleditData();
        },
        methods: {

            backfilleditData () {
                var dataId = this.ruleForm.id;
                if (dataId) {
                    this.$myHttp({
                        method: 'post',
                        url: this.prefix + '/microarch/sys/SysDocument/view' + window.suffix,
                        data: {
                            'entity': {
                                'id': dataId
                            }
                        }
                    }).then(res => {
                        var backData = res.data.entity;
                        this.ruleForm.documentTitle = backData.documentTitle,
                        this.ruleForm.documentType = backData.documentType,
                        this.ruleForm.documentEnable = backData.documentEnable,
                        this.ruleForm.documentDesc = backData.documentDesc;
                        this.msg = backData.content;
                        if (backData.documentType == '01' || backData.documentType == '04') {
                            this.showUeditor = true;
                        }
                        // if (backData.attachList) {
                        //     var attachList = backData.attachList;
                        //     var resArray = [];
                        //     for (var d = 0, len = attachList.length; d < len; d++) {
                        //         resArray.push({
                        //             name: attachList[d].attachmentName,
                        //             url: attachList[d].attachmentPath,
                        //             id: attachList[d].id
                        //         });
                        //     }
                        //     this.fileList = resArray;
                        // }
                    });
                }
            },
            backList () {
                var _this = this;

                _this.$router.push({
                    name: 'sys/document/documentList'
                });
            }
        },
        mounted: function () {
            util.getSelectData(this, this.dirArry);
        }
    };
</script>

<style scoped>
    .el-select {
        width: 100%
    }

    .el-input__inner {
        color: #797979
    }
    .upload-edit{
        display: block;
        resize: vertical;
        padding: 5px 15px;
        line-height: 1.5;
        box-sizing: border-box;
        width: 100%;
        font-size: inherit;
        color: #606266;
        background-color: #fff;
        background-image: none;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
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