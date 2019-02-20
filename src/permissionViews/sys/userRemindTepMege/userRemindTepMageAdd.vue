<template>
    <div>
        <el-col :span="24">

            <el-form ref="ruleForm" :model="ruleForm"  :rules="rules" label-width="110px" style="margin-bottom: 10px" class="demo-ruleForm">
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                        <template slot="title">
                            <div class="moduleTit">
                                <h3>
                                    <span class="infoTit">模板管理</span>
                                </h3>
                            </div>
                        </template>
                        <el-col :span="8" :xs="20" >
                            <el-form-item label="模板英文名称"  prop="englishName">
                                <el-input v-model="ruleForm.englishName" style="width: 75%" size="small"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8" :xs="20">
                            <el-form-item label="模板中文名称"  prop="chineseName">
                                <el-input v-model="ruleForm.chineseName" style="width: 75%" size="small"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8" :xs="20">
                            <el-form-item label="模板类型">
                                <el-select v-model="ruleForm.templateType" placeholder="" size="small" style="width: 95%">
                                    <el-option
                                            v-for="item in templateTypeData"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-collapse-item>
                </el-collapse>
            </el-form>
        </el-col>

        <el-col :span="24">
            <!--<el-col :span="20" style="background-color: white">-->
            <el-collapse v-model="activeEditNames" @change="handleChange">
                <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                    <template :span="20" slot="title">
                        <div class="moduleTit">
                            <h3>
                                <span class="infoTit">编辑框</span>
                            </h3>
                        </div>
                    </template>
                    <el-form ref="editorForm" :model="editorForm"  :rules="rules" style="margin-top: 20px;margin-bottom: 20px">
                        <vue-ueditor-wrap v-model="msg" :config="myConfig" @ready="ready"></vue-ueditor-wrap>
                    </el-form>
                </el-collapse-item>
            </el-collapse>
        </el-col>

        <el-col :span="24">
            <div class="btngroup" style="margin-top: 10px">
                <el-collapse v-model="activetableNames" @change="handleChange">
                    <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                        <template :span="24" slot="title">
                            <div class="moduleTit">
                                <h3>
                                    <span class="infoTit">替换字符列表</span>
                                </h3>
                            </div>
                        </template>
                        <el-col :span="24" style="background-color: white" >
                            <div class="tableBtn">
                                <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="addNewLine">新增行</el-button>
                                <el-button type="primary" icon="el-icon-remove-outline" size="small" @click="delLine()">删除行</el-button>
                                <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="submitForm('ruleForm')">保存</el-button>
                                <el-button size="small" icon="el-icon-back" @click="back">返回</el-button>
                            </div>
                        </el-col>
                        <el-table
                                class="myTable"
                                border stripe
                                :data="tableData"
                                id="myTable"
                                :style="myTableStyle"
                                size="small"
                                ref="myTable"
                                @selection-change="handleSelectionChange"
                        >
                            <el-table-column
                                    v-for='(items , index) in editTableData.tableThead'
                                    v-if="items.selectionCheckbox"
                                    :fixed="items.fixedColumn?true:false"
                                    :key="index"
                                    type="selection"
                                    width="55"
                            >

                            </el-table-column>
                            <el-table-column :prop="items.headKey" :key='index' v-for='(items , index) in editTableData.tableThead'
                                             min-width="180px"
                                             :label="items.headName" :width="items.width*2.5" :align="items.align"
                                             :fixed="items.fixedColumn?true:false"
                                             v-if="!items.isHidden"
                            >
                                <template slot-scope="scope">
                                    <el-tooltip placement="top" effect="light"
                                                :disabled="!items.isNeedTips || !scope.row[items.headKey]" :placement="placement">
                                        <div v-if="items.pageIndex && scope.$index==0">{{scope.$index+1}}<span></span></div>
                                        <div v-if="items.pageIndex? scope.row[items.headKey]=scope.$index:''">{{scope.$index+1}}</div>
                                        <div v-if="items.pageIndex">{{scope.$index+1}}</div>
                                        <div v-if="items.headKey=='ekey'">
                                            <el-input v-model="scope.row[items.headKey]" clearable size="small"></el-input>
                                        </div>
                                        <div v-if="items.headKey=='evalue'">
                                            <el-input v-model="scope.row[items.headKey]" clearable size="small"></el-input>
                                        </div>
                                    </el-tooltip>

                                </template>


                            </el-table-column>
                        </el-table>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-col>
    </div>
</template>

<script>
    import util from '../../../libs/util';
    import VueUeditorWrap from 'vue-ueditor-wrap';
    export default {
        name: 'addUserRemindTepMage',
        data () {
            return {
                msg: '<h2>请在此处输入文本内容</h2>',
                myConfig: {
                    // 如果需要上传功能,找后端小伙伴要服务器接口地址
                    // serverUrl: 'http://api.demo.com/ueditor/upload',
                    // 你的UEditor资源存放的路径,相对于打包后的index.html
                    UEDITOR_HOME_URL: 'dist/static/UEditor/',
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 240,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 关闭自动保存
                    enableAutoSave: false
                },
                ready (editorInstance) {
                    console.log(`编辑器实例${editorInstance.key}: `, editorInstance);
                },
                editTableData: {
                    tableThead: [
                        {
                            'selectionCheckbox': true,
                            'isHidden': true
                        },
                        {
                            'headName': '序号',
                            'headKey': 'index',
                            'pageIndex': true,
                            'width': 30
                        },
                        {
                            'headName': '要替换的名字',
                            'headKey': 'ekey'
                        },
                        {
                            'headName': 'ID',
                            'headKey': 'id',
                            'isHidden': true
                        },
                        {
                            'headName': '说明',
                            'headKey': 'evalue'
                        }
                    ]
                },
                ruleForm: {
                    englishName: '',
                    chineseName: '',
                    templateType: ''
                },
                templateTypeData: [],
                dirArry: ['templateType'],
                content: '',
                contentReplace: '',
                contentReplaceList: [],
                editorForm: {

                },
                rules: {
                    englishName: [
                        { required: true, message: '请输入模块英文名', trigger: 'change' }
                    ],
                    chineseName: [
                        { required: true, message: '请输入模块中文名', trigger: 'change' }
                    ],
                    templateType: [
                        { required: true, message: '请输入模块类型', trigger: 'change' }
                    ]
                },
                myTableStyle: 'margin-bottom:35px',
                tableData: [],
                delLineIndex: [],
                placement: 'right',
                activeEditNames: ['1'],
                activeNames: ['1'],
                activetableNames: ['1']
            };
        },

        components: {
            VueUeditorWrap
        },

        methods: {
            submitForm (formName) {
                var _this = this;
                if (_this.tableData.length == 0) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.saveUserRemindTep();
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                } else {
                    var isEmptyNum = 0;
                    for (let i = 0; i < _this.tableData.length; i++) {
                        if (_this.tableData[i].ekey == '' || _this.tableData[i].ekey == null ||
                            _this.tableData[i].evalue == '' || _this.tableData[i].evalue == null) {
                            isEmptyNum++;
                        }
                    }
                    console.log('isEmptyNum', isEmptyNum);
                    if (isEmptyNum != 0) {
                        this.$message({
                            showClose: true,
                            message: '请输入完整字符列表！',
                            type: 'warning'
                        });
                    } else {
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                this.saveUserRemindTep();
                            } else {
                                console.log('error submit!!');
                                return false;
                            }
                        });
                    }
                }
            },
            saveUserRemindTep () {
                var _this = this;
                for (var n = 0; n < _this.tableData.length; n++) {
                    for (var m = n + 1; m < _this.tableData.length; m++) {
                        if (_this.tableData[n].ekey == _this.tableData[m].ekey || _this.tableData[n].evalue == _this.tableData[m].evalue) {
                            this.$message({
                                showClose: true,
                                message: '字符列表不可重复！',
                                type: 'warning'
                            });
                            return;
                        }
                    }
                }
                _this.content = _this.msg;
                console.log('content', _this.content);
                var contentReplaceList = [];
                for (let i = 0; i < _this.tableData.length; i++) {
                    contentReplaceList.push(_this.tableData[i].ekey);
                    contentReplaceList.push(_this.tableData[i].evalue);
                }
                _this.contentReplaceList = contentReplaceList;
                console.log('contentReplace', _this.contentReplaceList);
                this.$myHttp({
                    method: 'POST',
                    url: this.prefix + '/microarch/sys/sysUserTemplate/checkTemplateEnExist',
                    data: {'entity': {'englishName': _this.ruleForm.englishName}}
                }).then(resEn => {
                    if (resEn.data.rows.length != '0') {
                        this.$message({
                            showClose: true,
                            message: '模板英文名已存在！请重新输入模板英文名！',
                            type: 'warning'
                        });
                    } else {
                        this.$myHttp({
                            method: 'POST',
                            url: this.prefix + '/microarch/sys/sysUserTemplate/checkTemplateCnExist',
                            data: {'entity': {'chineseName': _this.ruleForm.chineseName}}
                        }).then(resCn => {
                            if (resCn.data.rows.length != '0') {
                                this.$message({
                                    showClose: true,
                                    message: '模板中文名已存在！请重新输入模板中文名！',
                                    type: 'warning'
                                });
                            } else {
                                this.$myHttp({
                                    method: 'POST',
                                    url: this.prefix + '/microarch/sys/sysUserTemplate/save',
                                    data: {'entity': {'englishName': _this.ruleForm.englishName, 'chineseName': _this.ruleForm.chineseName, 'templateType': _this.ruleForm.templateType, 'content': _this.msg, 'contentReplace': '', 'contentReplaceList': _this.contentReplaceList}}
                                }).then(res => {
                                    _this.$router.push({
                                        name: 'sys/userRemindTepMege/userRemindTepMageList'
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
            back () {
                this.$router.back(-1);
            },
            addNewLine () {
                var _this = this;
                if (_this.tableData.length == 0) {
                    this.tableData.push({
                        'ekey': '',
                        'evalue': ''
                    });
                    console.log('1wxz', _this.tableData[_this.tableData.length - 1].ekey);
                } else {
                    if (_this.tableData[_this.tableData.length - 1].ekey != '' && _this.tableData[_this.tableData.length - 1].ekey != null &&
                        _this.tableData[_this.tableData.length - 1].evalue != '' && _this.tableData[_this.tableData.length - 1].evalue != null) {
                        this.tableData.push({
                            'ekey': '',
                            'evalue': ''
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '请输入完整内容！',
                            type: 'warning'
                        });
                    }
                }
            },
            handleSelectionChange (val) {
                console.log('hah-------', val);
                this.delLineIndex = val;
            },
            delLine () {
                var myData = [];
                for (var k = 0; k < this.tableData.length; k++) {
                    myData.push(this.tableData[k]);
                }
                var arrIndex = [];
                for (var k = 0; k < this.delLineIndex.length; k++) {
                    arrIndex.push(this.delLineIndex[k].index);
                }
                console.log('arrIndex----', arrIndex);
                for (var j = 0; j < myData.length; j++) {
                    for (var i = 0; i < arrIndex.length; i++) {
                        if (arrIndex[i] == j) {
                            myData.splice(j, 1, 'kkk');
                        }
                    }
                }
                for (var m = 0; m < myData.length; m++) {
                    if (myData[m] == 'kkk') {
                        myData.splice(m, 1);
                        m--;
                    }
                }
                this.tableData = myData;
            },
            handleChange (val) {
                console.log('val---', val);
            }
        },
        created () {
            util.getSelectData(this, this.dirArry);
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