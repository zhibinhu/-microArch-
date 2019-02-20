<template>
    <div>
        <div style="margin: 5px 5px">
            <el-button v-if="viewPageFlag!='view'" size="mini" @click="handleAdd" type="primary"> 新增附件</el-button>
            <!--<el-button size="mini" @click="handleDelete" type="primary">删除附件</el-button>-->
        </div>
        <el-table :data="dataList" ref="dataList"  size="mini" highlight-current-row border style="width: 100%;border:1px solid #dedede;overflow-x:auto;" class="el-tb-edit">
            <el-table-column type="index" width="50" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="attachmentType" label="附件类型" width="150" align="center">
                <template slot-scope="scope">
                    <el-select :disabled="viewPageFlag=='view'" v-model="scope.row.attachmentType" style="width:100%;" size="small" >
                        <el-option
                                v-for="item in attachmentTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="attachmentDesc" label="附件描述" width="150" align="center">
                <template slot-scope="scope">
                    <el-input :disabled="viewPageFlag=='view'" size="mini" v-model="scope.row.attachmentDesc" align="center"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="attachmentName" label="附件名称" align="center" min-width="160">
                <template slot-scope="scope">
                    <el-upload
                            :disabled="viewPageFlag=='view'"
                            class="upload-edit stretchSize"
                            action="#"
                            :headers="tokenHeader"
                            :http-request = "myUpload"
                            :beforeUpload="beforeUpload"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :show-file-list="false"
                            :on-success="(res,file)=>{return handleHeadSuccess(res,file,scope.$index+1)}"
                            :on-change="(res,file)=>{return handleHeadChange(res,file,scope.$index+1)}"
                            accept='.xls,.xlsx,.doc,.docx,.txt,.jpg,.png,.ppt,.pptx,.pdf,.zip,.rar'
                            :data="{'id':scope.row.id,'attachmentType':scope.row.attachmentType,'attachmentDesc':scope.row.attachmentDesc,'businessId':bisinessId,'uploadPath':uploadPath,'dataList':JSON.stringify(dataList)}"
                    >
                        <!--<div style="float: left;">-->
                            <!--<el-input :disabled="viewPageFlag=='view'" size="mini" v-model="scope.row.attachmentName" align="center"></el-input>-->
                        <!--</div>-->
                        <!--<div style="float: right;">-->
                            <!--{{scope.row.attachmentName}}-->
                        <div class="progressBox">
                            <div class="successTip" ref="successTip">上传成功</div>
                            <div class="bgProgress" ref="bgProgress">
                            <div class="progress" ref="progress"><div class="going" ref="going"></div></div>
                            </div>
                            <el-input :disabled="viewPageFlag=='view'" size="mini" readOnly v-model="scope.row.attachmentName" :title="scope.row.attachmentName" style="float:left;width:80%;padding-right:5px;"></el-input>
                            <el-button :disabled="viewPageFlag=='view'" size="mini" type="primary" title="上传" style="float:left;width:20%;padding:3px 0;"><Icon type="ios-cloud-upload-outline" size="20"></Icon></el-button>
                        </div>
                        <!--</div>-->
                        <!--<div slot="tip" class="el-upload__tip" style="color:red">上传文件不超过30M</div>-->
                    </el-upload>
                </template>
            </el-table-column>
            <el-table-column prop="createBy" label="上传人" align="center" width="100">
                <template slot-scope="scope">
                    <!--<el-input size="mini" v-model="scope.row.createName" placeholder="请输入内容" align="center" disabled></el-input>-->
                {{scope.row.createName}}
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="上传时间" width="150" align="center">
                <template slot-scope="scope">
                    <!--<el-date-picker v-model="scope.row.createTime" type="date"  format="yyyy-MM-dd"  value-format="yyyy-MM-dd" disabled></el-date-picker>-->
                {{scope.row.createTime.substring(0,10)}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="primary"
                            circle
                            title="下载"
                            :disabled="!scope.row.id || !scope.row.attachmentName"
                            @click="handlePreview(scope.row.id,scope.row.attachmentName,scope.row.fileSize)"
                            style="padding:7px;"
                    >
                        <i class="el-icon-download" size="11"></i>
                    </el-button>
                    <el-button
                            v-if="viewPageFlag!='view'"
                            size="mini"
                            type="danger"
                            circle
                            title="删除"
                            @click="delRow(scope.row.id,scope.$index)"
                            style="padding:7px;"><i class="el-icon-delete" size="11"></i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import Cookie from 'js-cookie';
    import util from '../libs/util'
    export default {
        name: 'myUpload',
        components: {
        },
        data () {
            return {
                dataList: [],
                tableData_add: [],
                tableData_update: [],
                tableData_delete: [],
                param: {},
                addFlag: true,
                data: {},
                Filename: '',
                attachmentTypes: [],
                tokenHeader: {
                    'Authorization': 'Sys ' + sessionStorage.getItem('token')
                },
                user:Cookie.get('user')
            };
        },
        props: {
            // 定义传值的类型
            viewPageFlag: String,
            bisinessId: String,
            uploadPath: String,
            attachmentTypesCode:String,
            params: Object,
            queryUrl: String,
            saveUrl: String
        },
        watch: {
            params: function (n, o) {
                this.param = n;
                this.getItemList();
            },
            bisinessId:function (n,o) {
                this.bisinessId = n;
                this.getItemList();
            }


        },
        activated () {
            this.getItemList();
        },
        mounted () {
            this.getItemList();
            this.getDirData();
        },
        methods: {
            getDirData(){
                const allDicts = JSON.parse(localStorage.getItem('sysDict'));
                if(this.attachmentTypesCode!= undefined){
                    let subSysDicts = allDicts.filter(o => o.dtype == this.attachmentTypesCode)[0].sysDicts;
                    let resArry = [];
                    subSysDicts.map(function (o) {
                        resArry.push({
                            label: o.dvalue,
                            value: o.dkey
                        });
                    });

                    this.attachmentTypes = resArry
                }

            },
            myUpload (content) {
                if (!this.beforeUpload(content.file)) {
                    return false;
                }
                console.log('myUpload...',content);
                let fd = new FormData();
                fd.append('file', content.file);
                fd.append('attachmentType', content.data.attachmentType);
                fd.append('attachmentDesc', content.data.attachmentDesc);
                fd.append('businessId', this.bisinessId);
                fd.append('uploadPath', this.uploadPath);
                fd.append('id', content.data.id);
                fd.append('fileName', content.file.name);
                fd.append('dataList', JSON.stringify(this.dataList));
                fd.append('fileSize', content.file.size);
                // this.uploadFlag = true;
                this.$refs.bgProgress.style.display='block';
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/sysAttchement/upload',
                    data: fd,
                    onUploadProgress:progressEvent=>{
                        if(progressEvent.lengthComputable){
                            //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
                            //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
                            let curLoad=progressEvent.loaded;
                            let total=progressEvent.total;
                            this.$refs.going.style.width=(curLoad/total)*100+'%';
                            if((curLoad/total)*100>=99){
                                this.$refs.progress.style.display='none';
                                this.$refs.successTip.style.display='block';
                                setTimeout(()=>{
                                    this.$refs.successTip.style.display='none';
                                    this.$refs.bgProgress.style.display='none';
                                    this.$refs.progress.style.display='block';
                                },300)
                            }

                        }
                    },
                    headers: {'Authorization': 'Sys ' + sessionStorage.getItem('token')}
                }).then(res => {
                    content.onSuccess('配时文件上传成功');
                    console.log('res.data-------', res);
                    // content.file.id=res.data.attachId
                    var data = res.data;
                    var fileNum=res.data.dataList.length;
                    res.data.dataList[fileNum-1].createName=this.user;
                    this.dataList = res.data.dataList;
                    // this.saveUploadData.push(data.attachId)
                    this.addFlag = true;
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
            beforeUpload (file) {
                var _this = this;
                const isLt2M = file.size / 1024 / 1024 < 30;
                if (!isLt2M) {
                    _this.$message({
                        message: '上传模板大小不能超过 30MB!',
                        type: 'warning',
                        duration: 1500,
                        onClose: () => {
                        }
                    });
                }
                return isLt2M;
            },
            getItemList () {
                var dataId = this.bisinessId;
                if (dataId) {
                    this.$myHttp({
                        method: 'post',
                        url: this.prefix + '/microarch/sys/sysAttchement/list' + window.suffix,
                        data: {
                            'entity': {
                                'bizId': dataId
                            }
                        }
                    }).then(res => {
                        var backData = res.data;
                        if (backData) {
                            // console.log('backData----',backData);
                            this.dataList = backData
                            // console.log('datalist---',this.dataList)
                            // 组件激活时需要刷新 临时变量
                            this.tableData_add = [];
                            this.tableData_update = [];
                            this.tableData_delete = [];
                        }
                    });
                }
            },
            handleAdd () {
                var dataForm = {
                    id: null,
                    attachmentType: '',
                    attachmentDesc: '',
                    attachmentName: '',
                    createName: '',
                    createTime: ''
                };
                if (this.addFlag) {
                    this.dataList.push(dataForm);// 用于显示
                    this.tableData_add.push(dataForm); // 用于保存提交
                    this.addFlag = false;
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请先上传附件'
                    });
                }
            },
            handleCurrentChange (currentRow, oldRow) {
                if (currentRow && currentRow.id) {
                    this.tableData_update.push(currentRow);
                    this.tableData_update = Array.from(new Set(this.tableData_update)); // 去重复
                }
            },
            handleDelete (index, row) {
                if (row.id) {
                    this.$confirm('此操作将删除此字典项，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        var id = row.id;
                        this.dataList.splice(index, 1);
                        this.tableData_delete.push(row.id);
                        var star = this.tableData_update.indexOf(row);
                        if (star >= 0) {
                            this.tableData_update.splice(star, 1);
                        }
                        this.$http({
                            url: this.$http.adornUrl('/sys/dict/deleteItems'),
                            method: 'post',
                            data: this.$http.adornData({'ids': [id]})
                        }).then(({data}) => {
                            if (data && data.code === 0) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.getItemList();
                                    }
                                });
                            } else {
                                this.$message.error(data.msg);
                            }
                        });
                    });
                } else {
                    this.dataList.splice(index, 1);
                    var start = this.tableData_add.indexOf(row);
                    this.tableData_add.splice(start, 1);
                }
            },
            handleHeadChange (res, file, index) {
                console.log(res, file, index, 123);
                // console.log(file[0].response.rst.url)
                // if(file[0].response.code == 0) {
                //     this.message(finle[0].response.msg,'success')
                //     // this.creatData[index].headingImg = file[0].response.ret.url
                // }
            },
            handleHeadSuccess (res, file, index) {
                console.log('hhhhhhhh', res, file, index, 456);
                this.dataList = res.dataList;
                this.addFlag = true;
                // this.creatData[index].headingImg = URL.createObjectURL(file.raw)
            },
            handleRemove (file, fileList) {
                console.log(file, fileList);
            },
            // 下载文件
            handlePreview (id, fileName,fileSize) {
                let loadingFlag=true;
                var curLoading = this.$notify({
                    title: '提示',
                    dangerouslyUseHTMLString: true,
                    message: '<div>正在下载中...</div>',
                    duration: 0
                });
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/sysAttchement/download' + window.suffix,
                    data: {
                        'entity': {
                            'id': id
                        }
                    },
                    onDownloadProgress: progressEvent=>{
                        // Do whatever you want with the native progress event
                        let curLoad=progressEvent.loaded;
                        let okload=((curLoad/fileSize).toFixed(2))*100;
                        curLoading.message='<div>正在下载中...' + okload + '%</div>';
                        if(parseInt(okload)>99){
                            curLoading.message='<div>下载完成</div>';
                            curLoading.close();
                        }

                    },
                    responseType: 'arraybuffer'
                }).then(res => {
                    // 成功回调
                    var headers = res.headers;
                    console.log('headers---',res.headers);
                    var blob = new Blob([res.data], {
                        type: headers['content-type']
                    });
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    //   firefox 里面触发
                    var browser=navigator.userAgent.toLowerCase();
                    if(browser.indexOf('firefox')>-1) {
                        var event = document.createEvent("MouseEvents");
                        event.initEvent("click", true, true);
                        link.dispatchEvent(event);
                    }
                });
            },

            handleExceed (files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove (file, fileList) {
                // return this.$confirm(`确定移除 ${ file.name }？`);

            },
            delRow (id, index) {
                this.$confirm('确定删除该数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (!id) {
                        this.dataList.splice(index, 1);
                        this.addFlag = true;
                    } else {
                        this.$myHttp({
                            method: 'post',
                            url: this.prefix + '/microarch/sys/sysAttchement/delete' + window.suffix,
                            data: {
                                'entity': {
                                    'id': id
                                }
                            }
                        }).then(res => {
                            console.log('del--res--', res);
                            if (res.data && res.data.code == 10000) {
                                this.$message({
                                    type: 'success',
                                    message: '附件删除成功'
                                });
                                this.dataList.splice(index, 1);
                            }
                        });
                    }
                });
            }
        },
        filters: {
            attachmentTypeFil (val) {
                var fildata = '其他';
                if (val == '01') {
                    fildata = '科研报告';
                } else if (val == '02') {
                    fildata = '其他';
                }
                return fildata;
            },
            createfil (val) {
                if (val) {
                    return val.substring(0, 10);
                } else {
                    return '';
                }
            }
        }
    };
</script>
<style>
    .upload-edit.stretchSize{
        position: relative;
        top:3px;
    }
    .upload-edit.stretchSize>div.el-upload{
        width:100%;
    }
</style>
<style scoped>
    .progressBox{
        position: relative;
        overflow: hidden;
    }
    .bgProgress{
        position: absolute;
        left:2px;
        top:1px;
        z-index: 99;
        width:calc(80% - 9px);
        height:calc(100% - 2px);
        background: #fff;
        display: none;
    }
    .successTip{
        width:95px;
        height:25px;
        position: absolute;
        left:5px;
        top:50%;
        z-index:100;
        margin-top:-12px;
        color:green;
        display:none;
        background:#fff;
    }
    .progress{
        width:95px;
        height:5px;
        position: absolute;
        left:5px;
        top:50%;
        z-index:99;
        margin-top:-3px;
        border-radius: 5px;
        border:1px solid #00a0e9;
        overflow:hidden;
    }
    .progress .going{
        position: absolute;
        top:0;left:0;
        width:0px;
        height:100%;
        background:#00a0e9;
    }
</style>
