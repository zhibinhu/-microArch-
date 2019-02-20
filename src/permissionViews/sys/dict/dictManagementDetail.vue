<template>
    <div>
        <div class="bgColor">
            <el-form ref="ruleForm" label-width="80px">
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                        <template slot="title">
                            <div class="moduleTit">
                                <h3>
                                    <span class="infoTit">字典管理</span>
                                </h3>
                            </div>
                        </template>
                        <el-row>
                            <el-col :span="9" class="inputPadding">
                                <el-form-item label="字典编码">
                                    <el-input v-model="ruleForm.dtype" disabled clearable size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9" class="inputPadding">
                                <el-form-item label="字典名称">
                                    <el-input v-model="ruleForm.dname" disabled clearable size="small"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18" class="inputPadding">
                                <el-form-item label="字典描述">
                                    <el-input v-model="ruleForm.memo" disabled clearable size="small"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
            </el-form>
        </div>
        <div class="btngroup"  style="margin-top: 10px">
            <el-collapse v-model="activeDictNames" @change="handleChange">
                <el-collapse-item style="padding:0 20px;background: #fff;" name="1">
                    <template slot="title">
                        <div class="moduleTit">
                            <h3>
                                <span class="infoTit">字典项管理</span>
                            </h3>
                        </div>
                    </template>
                    <div class="tableBtn">
                        <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="addNewLine">新增行</el-button>
                        <el-button type="primary" icon="el-icon-remove-outline" size="small" @click="delLine()">删除行</el-button>
                        <!--<el-button type="primary" icon="el-icon-circle-check-outline" size="small" @click="enableData('Y')">启用</el-button>-->
                        <!--<el-button type="primary" icon="el-icon-circle-close-outline" size="small" @click="enableData('N')">停用</el-button>-->
                        <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="submitForm">保存</el-button>
                        <el-button size="small" icon="el-icon-back" @click="back">返回</el-button>
                    </div>
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
                                v-for='(items , index) in dictTableData.tableThead'
                                v-if="items.selectionCheckbox"
                                :fixed="items.fixedColumn?true:false"
                                :key="index"
                                type="selection"
                                width="55"
                        >

                        </el-table-column>
                        <el-table-column :prop="items.headKey" :key='index' v-for='(items , index) in dictTableData.tableThead'
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
                                    <div v-if="items.headKey=='dkey'">
                                        <el-input v-model="scope.row[items.headKey]" clearable size="small"></el-input>
                                    </div>
                                    <div v-if="items.headKey=='dtype'">
                                        <el-input v-model="scope.row[items.headKey]" clearable size="small"></el-input>
                                    </div>
                                    <div v-if="items.headKey=='dvalue'">
                                        <el-input v-model="scope.row[items.headKey]" clearable size="small"></el-input>
                                    </div>
                                    <div v-if="items.headKey=='memo'" >
                                        <el-input v-model="scope.row[items.headKey]" clearable size="small"></el-input>
                                    </div>
                                    <!--<div v-if="items.headKey=='status'" >-->
                                    <!--<el-switch-->
                                    <!--size="small"-->
                                    <!--v-model="scope.row[items.headKey]"-->
                                    <!--active-text="启用"-->
                                    <!--inactive-text="停用">-->
                                    <!--</el-switch>-->
                                    <!--</div>-->


                                </el-tooltip>

                            </template>


                        </el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                ruleForm: {
                    dtype: '',
                    dname: '',
                    memo: '',
                    sysDicts: []
                },
                dtype: '',
                dname: '',
                memo: '',
                myTableStyle: 'margin-bottom:35px',
                placement: 'right',
                status: true,
                tableData: [],
                selectionData: [],
                dictTableData: {
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
                            'headName': '字典项编码',
                            'headKey': 'dkey'
                        },
                        {
                            'headName': 'ID',
                            'headKey': 'id',
                            'isHidden': true
                        },
                        {
                            'headName': '字典编码',
                            'headKey': 'dtype',
                            'isHidden': true
                        },
                        {
                            'headName': '字典项名称',
                            'headKey': 'dvalue'
                        },
                        {
                            'headName': '字典项描述',
                            'headKey': 'memo'
                        }
                        // {
                        //     "headName": '状态',
                        //     "headKey": 'status'
                        // }
                    ]
                },
                delLineIndex: [],
                activeNames: ['1'],
                activeDictNames: ['1']
            };
        },
        mounted () {
            this.backfillData();// 回显数据
        },
        methods: {
            submitForm () {
                var _this = this;
                if (_this.tableData.length == 0) {
                    _this.saveDict();
                } else {
                    var isEmptyNum = 0;
                    for (let i = 0; i < _this.tableData.length; i++) {
                        if (_this.tableData[i].dkey == '' || _this.tableData[i].dkey == null ||
                            _this.tableData[i].dvalue == '' || _this.tableData[i].dvalue == null) {
                            isEmptyNum++;
                        }
                    }
                    console.log('isEmptyNum', isEmptyNum);
                    if (isEmptyNum != 0) {
                        this.$message({
                            showClose: true,
                            message: '请输入完整字典项！',
                            type: 'warning'
                        });
                    } else {
                        this.saveDict();
                    }
                }
            },
            backfillData () {
                var _this = this;
                if (this.$route.params.id) {
                    sessionStorage.setItem('dictManagement_dataId', this.$route.params.id);
                }
                var getDataId = sessionStorage.getItem('dictManagement_dataId');
                var dataId = this.$route.params.id ? this.$route.params.id : getDataId;
                if (dataId) {
                    this.$myHttp({
                        method: 'POST',
                        url: this.permissionPrefix + '/microarch/sys/sysDictHead/findByPk',
                        data: {
                            'entity': {
                                'id': dataId
                            }
                        }
                    }).then(res => {
                        console.log('dictData---', res);
                        var getedData = res.data.entity;
                        if (getedData) {
                            _this.ruleForm = res.data.entity;
                            // _this.ruleForm.dtype = getedData.dtype;
                            // _this.ruleForm.dname=getedData.dname;
                            // _this.ruleForm.memo=getedData.memo;
                            // console.log('sysDicts---',getedData.sysDicts);
                            for (var i = 0; i < getedData.sysDicts.length; i++) {
                                this.tableData.push({
                                    'id': getedData.sysDicts[i].id,
                                    'dkey': getedData.sysDicts[i].dkey,
                                    'dtype': getedData.sysDicts[i].dtype,
                                    'dvalue': getedData.sysDicts[i].dvalue,
                                    'memo': getedData.sysDicts[i].memo
                                });
                            }
                        }
                    });
                }
            },
            saveDict () {
                var _this = this;
                var s = [];
                for (var n = 0; n < _this.tableData.length; n++) {
                    for (var m = n + 1; m < _this.tableData.length; m++) {
                        if (_this.tableData[n].dkey == _this.tableData[m].dkey) {
                            this.$message({
                                showClose: true,
                                message: '请输入字典项编码不可重复！',
                                type: 'warning'
                            });
                            return;
                        }
                    }
                }
                for (var i = 0; i < this.tableData.length; i++) {
                    delete this.tableData[i].index;
                }
                this.ruleForm.sysDicts = this.tableData;
                this.$myHttp({
                    method: 'POST',
                    url: this.permissionPrefix + '/microarch/sys/sysDictHead/saveAll',
                    data: {'entity': this.ruleForm}
                }).then(res => {
                    // orgApp.orgListSave().then(res=>{
                    // 成功回调方法
                    _this.$router.push({
                        name: 'sys/dict/dictionaryItemMaintenanceList'
                    });
                    this.$message({
                        showClose: true,
                        message: '保存成功！',
                        type: 'success'
                    });
                });
            },
            back () {
                this.$router.back(-1);
            },
            addNewLine () {
                var _this = this;
                if (_this.tableData.length == 0) {
                    this.tableData.push({
                        'dtype': this.ruleForm.dtype,
                        'dvalue': '',
                        'memo': ''
                    });
                    console.log(_this.tableData[_this.tableData.length - 1].dkey);
                } else {
                    if (_this.tableData[_this.tableData.length - 1].dkey != '' && _this.tableData[_this.tableData.length - 1].dkey != null &&
                        _this.tableData[_this.tableData.length - 1].dvalue != '' && _this.tableData[_this.tableData.length - 1].dvalue != null) {
                        this.tableData.push({
                            'dtype': this.ruleForm.dtype,
                            'dvalue': '',
                            'memo': ''
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '请输入完整字典项！',
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
                console.log('delIndex------', this.delLineIndex);
                console.log('tableData------', this.tableData.length);
                console.log('delLineIndex.length------', this.delLineIndex.length);
                var myData = [];
                for (var k = 0; k < this.tableData.length; k++) {
                    console.log('kkkk---', k);
                    myData.push(this.tableData[k]);
                }
                console.log('myData1111111,', myData);
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
                console.log('myData------', myData);
                for (var m = 0; m < myData.length; m++) {
                    if (myData[m] == 'kkk') {
                        myData.splice(m, 1);
                        m--;
                    }
                }
                console.log('myDAAAAAA-----', myData);
                this.tableData = myData;
            },
            handleChange (val) {
                console.log('val---', val);
            }
        }
    };
</script>
<style scoped>
    .inputPadding{
        padding-left:10px;
    }
    hr{
        height:0px;
        border:2px solid #ccc;
        margin:10px 0;
    }
    .tableBtn{
        padding:0px 0 5px 0px;
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
</style>