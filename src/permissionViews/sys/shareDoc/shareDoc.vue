<template>
    <div style="background-color:#fff;padding: 10px 20px;">
        <h2>
            <span style="float:left;height:32px;line-height: 32px;font-weight: normal;font-size: 14px;"><Icon type="folder" size="22" style="color:#000;vertical-align: middle;top: -2px;position: relative;padding-right:5px;"></Icon>{{title}}</span>


            <span style="margin-left: 210px;font-size: 13px">
                <el-input v-model="searchData" size="small" :clearable="true" style="width: 300px;margin-left: 10px" placeholder="文档搜索"></el-input>
                <el-button type="primary" icon="el-icon-search"  size="small" @click="search">搜索</el-button>
                <el-button type="primary" v-show="isShowSearchData"  size="small" @click="backSearch">取消</el-button>


            </span>


            <div class="tableBtn" style="float:right;padding:0;" v-show="!isShowSearchData">
                <el-button type="primary" icon="el-icon-circle-plus-outline" v-show="viewPageFlag == 'view'? false:true"  size="small" @click="addDirectory">新增文档目录</el-button>
                <el-upload
                        class="upload-edit"
                        action="#"
                        :headers="tokenHeader"
                        :http-request = "myUpload"
                        :beforeUpload="beforeUpload"
                        :show-file-list="false"
                        :on-success="(res,file)=>{return handleHeadSuccess(res,file)}"
                        accept='.xls,.xlsx,.doc,.docx,.txt,.jpg,.png,.ppt,.pptx,.pdf,.zip,.rar'
                        style="display: inline-block;">
                   <!--<el-button type="primary" icon="el-icon-circle-check-outline" size="small" @click="">上传文件</el-button>-->
                </el-upload>
                <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" v-show="viewPageFlag == 'view'? false:true" @click="submitForm('ruleForm')">保存</el-button>
            </div>
        </h2>
        <el-row v-show="!isShowSearchData">
            <el-col :span="4" style="padding-right: 5px;">
                <div class="tree">
                    <el-tree
                            ref="vueTree"
                            :data="shareDocData"
                            node-key="id"
                            default-expand-all
                            :highlight-current="true"
                            :props="defaultProps"
                            :expand-on-click-node="false"
                            @node-click="handleNodeClick">
                          <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label}}</span>
                            <span v-if="node.data.code!='DIR_01' && node.data.code!='DIR_01_11' && node.data.code!='DIR_01_10' && (node.data.userName==currentUser || currentUser=='admin')">
                                <i class="el-icon-close"
                                   size="mini"
                                   @click="() => remove(node, data)">
                                </i>
                            </span>
                          </span>
                    </el-tree>
                </div>
            </el-col>
            <el-col :span="20">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="mini" label-width="100px" class="demo-ruleForm">
                    <el-col :span="12">
                        <el-form-item label="目录名称" prop="name">
                            <el-input :disabled="isGray" v-model="ruleForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="目录编码" prop="code">
                            <el-input :disabled="isGray || isGrayCode" v-model="ruleForm.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="目录描述" prop="des">
                            <el-input :disabled="isGray" v-model="ruleForm.des"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
                <!--<el-table-->
                        <!--v-loading="loading"-->
                        <!--:data="attachListTableData"-->
                        <!--border-->
                        <!--size="mini"-->
                        <!--:header-cell-style="{padding:'6px 0',background:'#dfebf9',fontSize:'12px'}"-->
                        <!--:cell-style="{padding:'3px 0'}"-->
                        <!--style="width: 100%">-->
                    <!--<el-table-column-->
                            <!--fixed-->
                            <!--prop="date"-->
                            <!--label="序号"-->
                            <!--width="50">-->
                        <!--<template slot-scope="scope">-->
                            <!--<span>{{scope.$index+1}}</span>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column-->
                            <!--prop="attachmentName"-->
                            <!--label="附件名称"-->
                            <!--:show-overflow-tooltip="true">-->
                    <!--</el-table-column>-->
                    <!--<el-table-column-->
                            <!--prop="createName"-->
                            <!--label="上传人"-->
                            <!--width="100">-->
                    <!--</el-table-column>-->
                    <!--<el-table-column-->
                            <!--prop="lastmodifiedTime"-->
                            <!--label="上传时间"-->
                            <!--width="150">-->
                    <!--</el-table-column>-->
                    <!--<el-table-column-->
                            <!--fixed="right"-->
                            <!--label="操作"-->
                            <!--width="100">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-button type="primary" size="mini" @click="handleClick(scope.row.id,scope.row.attachmentName)" icon="el-icon-download" title="下载" circle></el-button>-->
                            <!--<el-button type="danger" size="mini" :disabled="scope.row.userName!=currentUser && currentUser!='admin'" icon="el-icon-delete" title="删除" @click="delRow(scope.row.id,scope.$index)" circle></el-button>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                <!--</el-table>-->

                <my-upload style="margin-left: 20px" ref="list" :viewPageFlag="viewPageFlag"  :bisinessId="businessId" :attachmentTypesCode="attachmentTypesCode"></my-upload>
            </el-col>
        </el-row>



        <el-row v-show="isShowSearchData" style="max-height: 1800px">

            <div v-for="item in searchResData" style="margin-bottom: 10px">

                <label style="font-size: 16px;margin-bottom: 5px" v-html="item.showTitle"></label>
                <!--<div style="font-size: 13px;margin-bottom: 5px" v-html="item.highlight.fileContent"></div>-->
                <div style="font-size: 13px;margin-bottom: 5px" v-html="item.fileContent"></div>

                <div>{{item.createdDate | formatDate}}<label>{{ ' | '+item.docPath}}</label><label @click="downFile(item.objId,item.title,item.fileSize)" style="color: #409eff;cursor:pointer" class="underline">{{ ' | ' + item.title}}</label><label>{{' | '+item.createName}}</label></div>


            </div>

            <el-pagination
                    v-show="!empty"
                    style="margin-left: -15px"
                    :page-size="5"
                    :pager-count="11"
                    layout="prev, pager, next"
                    @current-change="currentChange"
                    :current-page="currentPage"
                    :total="total">
            </el-pagination>

            <label v-show="empty">暂无搜索结果</label>
        </el-row>

    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    import user from "../../../store/modules/user";
    import myUpload from '@/components/myUpload';
    export default {
        components: {myUpload},

        data(){
            var _this=this;
            var checkCode=function (rule,value,callback) {
                const valueFact = value.replace(/^(\s)*|(\s)*$/g,'');
                if (!valueFact) {
                    callback();
                    return true;
                }
                if(valueFact==_this.currentCode){
                    callback();
                    return true;
                }
                _this.$myHttp({
                    method: 'post',
                    url: _this.permissionPrefix + '/microarch/sys/docdir/checkDirCodeExist?docDirCode='+valueFact
                }).then(res => {
                    // console.log('value---',value)
                    console.log('res--fact---',res)
                    if (res.data) {
                        if (res.data.isExt) {
                            callback(new Error('目录编码重复,请修改'));
                        } else {
                            callback();
                            return true;
                        }
                    }
                });
            }
           return {
               isShowTree:false,
               viewPageFlag:'view',
               attachmentTypesCode:'ATTACH_TYPE',
               businessId:'',
               empty:false,
               title:'共享文档',
               currentPage:0,
               total:0,
               searchData:'',
               searchResData:[],
               isShowSearchData:false,
               msg:'共享文档管理',
               shareDocData:[{
                   id: 1,
                   label: '文档目录',
                   children: [
                       {
                           id:2,
                           label:'我的文档'
                       },
                       {
                       id: 4,
                       label: '公司文档',
                       children: [{
                           id: 9,
                           label: '三级 1-1-1'
                       }, {
                           id: 10,
                           label: '三级 1-1-2'
                       }]
                   }]
               }],
               defaultProps: {
                   children: 'childrens',
                   label: 'text',
                   disabled:'userName'
               },
               attachListTableData: [],
               ruleForm:{
                   name:'',
                   code:'',
                   des:''
               },
               rules: {
                   name: [
                       {required: true, message: '请输入目录名称', trigger: 'blur'}
                   ],
                   code:[
                       {required: false, validator: checkCode, trigger: 'blur'}
                   ]
               },
               currentCode:'',
               tokenHeader: {
                   'Authorization': 'Sys ' + sessionStorage.getItem('token')
               },
               nodePid:'',
               nodeId:'',
               bisinessId:'',
               uploadPath: 'document',
               dataList: [],
               loading:true,
               isGray:false,
               isGrayCode:false,
               isClickSaveBtn:false,
               isModify:{//判断是否是修改目录操作
                   name:'',
                   code:'',
                   des:''
               },
               currentUser:''

           }
        },
        methods:{
            downFile(id,fileName,fileSize){
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
            currentChange(page){
                this.currentPage = page
                this.search()
            },
            backSearch(){
                this.searchData = ''
                this.searchResData = []
                this.title = '共享文档'
                this.isShowSearchData = false
            },
            search(){

                if(this.searchData){
                    this.isShowSearchData = true
                    this.title = '搜索结果'

                    this.$myHttp({
                        method: 'post',
                        url: this.permissionPrefix + '/microarch/sys/elasticsearch/search',
                        data:{
                            entity:{
                                searchContent:this.searchData
                            },
                            pageNum:this.currentPage == 0? 0:this.currentPage -1,
                            pageSize:'5'

                        }
                    }).then(res => {
                        this.total =Number(res.data.total)

                        if(res.data.rows.length > 0){
                            this.empty = false
                            this.draw(res.data.rows)
                        }else {
                            this.empty = true
                            this.searchResData = []
                        }

                    });
                }else {
                    this.$message({
                        message: '请输入搜索条件',
                        type: 'warning'
                    });
                }
            },
            draw(data){
                data.forEach(function (o,index) {
                    if(o.highlight.fileContent){
                        if(o.highlight.fileContent.length > 0){
                            for(let i = 0 ; i < o.highlight.fileContent.length ; i++){

                                o.fileContent += o.highlight.fileContent[i] + '     '

                            }
                        }
                    }

                })


                data.forEach(function (o,index) {
                    if(o.highlight.title){
                        if(o.highlight.title.length > 0){
                            for(let i = 0 ; i < o.highlight.title.length ; i++){

                                o.fileContent += o.highlight.title[i] + '     '

                            }
                        }
                    }
                })


                data.forEach(function (o,index) {
                    if(o.highlight.docPath){
                        if(o.highlight.docPath.length > 0){
                            for(let i = 0 ; i < o.highlight.docPath.length ; i++){

                                o.fileContent += o.highlight.docPath [i] + '     '

                            }
                        }
                    }

                })

                data.forEach(function (o) {
                    o.createdDateEx = new Date(o.createdDate)
                })
                this.searchResData = data
            },
            getTreeData(){
                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/docdir/listTree'
                }).then(res => {
                   console.log('res===getTreeData---',res);
                   if(res.data && res.data.ext){
                       let treeData=JSON.parse(res.data.ext);
                       console.log('treeData---',treeData);
                       this.shareDocData=[];
                       this.shareDocData=treeData;
                       this.$nextTick(function() {
                           this.$refs.vueTree.setCurrentKey(1);
                       });
                   };


                });
            },
            getNewTreeData(nodeId,nodePid,userName){
                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/docdir/listTree'
                }).then(res => {
                    console.log('res===getNewTreeData---',res);
                    if(res.data && res.data.ext){
                        let treeData=JSON.parse(res.data.ext);
                        console.log('treeData---',treeData);
                        this.shareDocData=[];
                        this.shareDocData=treeData;

                        this.$nextTick(function() {
                            this.$refs.vueTree.setCurrentKey(nodeId);
                        });
                        setTimeout(()=>{
                            this.handleNodeClick({id:nodeId,pid:nodePid,userName:userName});//重新高亮展示上一个节点
                        },1);
                    };

                });
            },
            handleNodeClick(data){
                let nodeId=data.id;
                this.businessId=data.id.toString();
                this.nodePid=data.pid;
                this.nodeId=data.id;
                this.attachListTableData=[];
                this.loading=true;

                if((this.currentUser!='admin' && (data.id=='1' || data.id=='10' || data.id=='11')) || (data.userName!=this.currentUser && this.currentUser!='admin')){
                    this.isGray=true;//给每个目录加修改权限
                }else{
                    this.isGray=false;
                }
                if(data.id=='1' ||data.id=='10' || data.id=='11' || data.code=='DIR_01' || data.code=='DIR_01_10' || data.code=='DIR_01_11'){
                    this.isGrayCode=true;
                }else{
                    this.isGrayCode=false;
                }
                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/docdir/view',
                    data:{
                        "entity": {
                            id: nodeId
                        }
                    }
                }).then(res => {
                       if(res.data && res.data.entity){
                           this.ruleForm.name=res.data.entity.docDirName;
                           this.ruleForm.code=res.data.entity.docDirCode;
                           this.ruleForm.des=res.data.entity.memo;

                           this.currentCode=res.data.entity.docDirCode;

                           this.isModify.name=res.data.entity.docDirName;
                           this.isModify.code=res.data.entity.docDirCode;
                           this.isModify.des=res.data.entity.memo;
                           //解决新建目录未保存时点击左侧菜单显示错误提示信息的bug
                           this.$refs["ruleForm"].clearValidate();
                           if(res.data.entity.attachList){
                               this.attachListTableData=res.data.entity.attachList;
                           }
                           this.loading=false;
                       }
                });
            },
            remove(node, data) {
                let parent = node.parent;
                let children = parent.data.childrens || parent.data;
                let index = data?children.findIndex(d => d.id === data.id):children.findIndex(d=>d.childrens==null);
                if(children[index].leaf || children[index].childrens==null) {
                    let nodeId=children[index].id;
                    let nodePid=children[index].pid;
                    this.$confirm('是否删除该文档目录?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$myHttp({
                            method: 'post',
                            url: this.prefix + '/microarch/sys/docdir/delete',
                            data: {
                                'entity': {
                                    'id': nodeId,
                                    'pid':nodePid
                                }
                            }
                        }).then(res => {
                            children.splice(index, 1);
                            if(index>0){
                                let nodeId=children[index-1].id;
                                let nodePid=children[index-1].pid;
                                let userName=sessionStorage.getItem('userName');
                                this.getNewTreeData(nodeId,nodePid,userName);//重新获取树形数据
                            }else{
                                let nodeId=parent.data.id;
                                let nodePid=parent.data.pid;
                                let userName=sessionStorage.getItem('userName');
                                this.getNewTreeData(nodeId,nodePid,userName);//重新高亮展示最近的父级节点
                            }
                        })
                    })
                }else{
                    this.$message({
                        type:'warning',
                        message:'该节点下有子节点不能直接删除'
                    });
                    return ;
                }
            },
            submitForm (formName) {
                var that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // alert('submit!');
                        that.isClickSaveBtn=true;
                        that.saveDoc();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            saveDoc(){
                var isModifyFlag=false;
                if(this.isModify.name!=this.ruleForm.name || this.isModify.code!=this.ruleForm.code || this.isModify.des!=this.ruleForm.des){
                    isModifyFlag=true;//判断是否是修改目录
                }

                let attachList = this.$refs.list.dataList;
                var params={
                    "entity":{
                        attachList:attachList,
                        docDirName:this.ruleForm.name,
                        docDirCode:this.ruleForm.code,
                        memo:this.ruleForm.des,
                        pid:this.nodePid,
                        id:this.nodeId
                    }
                };
                console.log('params---baocun---', params);
                this.$myHttp({
                    method: 'post',
                    url: this.permissionPrefix + '/microarch/sys/docdir/save',
                    data: params
                }).then(res => {
                  console.log('res---saveDoc----',res)
                  if(res.data && res.data.code==10000){
                      if(this.nodeId=='' || this.isClickSaveBtn){//判断是否是新增目录
                          this.$message({
                              type:'success',
                              message:'保存成功'
                          });
                          this.isClickSaveBtn=false;
                      }
                      if(res.data.entity){
                          let nodeId=res.data.entity.id;
                          let nodePid=res.data.entity.pid;
                          let userName=sessionStorage.getItem('userName');
                          this.getNewTreeData(nodeId,nodePid,userName);//高亮新增节点
                      }
                  }else{
                      this.$message({
                          type:'warning',
                          message:'保存失败'
                      });
                  }

                });
            },
            handleClick(id, fileName) {
                console.log(id, fileName);
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/sysAttchement/download' + window.suffix,
                    data: {
                        'entity': {
                            'id': id
                        }
                    },
                    responseType: 'arraybuffer'
                }).then(res => {
                    // 成功回调
                    var headers = res.headers;
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
                    this.loading = false;
                });
            },
            delRow (id, index) {
                this.$confirm('是否删除该附件?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (!id) {
                        this.attachListTableData.splice(index, 1);
                    } else {
                        this.$myHttp({
                            method: 'post',
                            url: this.prefix + '/microarch/sys/sysAttchement/delete',
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
                                    message: '文件删除成功'
                                });
                                this.attachListTableData.splice(index, 1);
                            }
                        });
                    }
                });
            },
            addDirectory(){
                this.ruleForm.name='';
                this.ruleForm.code='';
                this.ruleForm.des='';
                this.isModify.name='';
                this.isModify.code='';
                this.isModify.des='';
                this.nodePid=this.nodeId;
                this.nodeId='';
                this.attachListTableData=[];

                this.isGray=false;
                this.isGrayCode=false;

            },
            myUpload (content) {
                if (!this.beforeUpload(content.file)) {
                    return false;
                }
                console.log('myUpload...');
                console.log('myUpload...content---',content);
                let fd = new FormData();
                let getDataArr=[];
                fd.append('file', content.file);
                fd.append('businessId', this.bisinessId);
                fd.append('fileName', content.file.name);
                fd.append('uploadPath', "docDir");
                fd.append('dataList', JSON.stringify(getDataArr));
                fd.append('fileSize', content.file.size);
                this.$myHttp({
                    method: 'post',
                    url: this.prefix + '/microarch/sys/sysAttchement/upload',
                    data: fd,
                    headers: {'Authorization': 'Sys ' + sessionStorage.getItem('token')}
                }).then(res => {
                    content.onSuccess('配时文件上传成功');
                    console.log('res.data-------', res);
                    var data = res.data;
                    if(data && data.dataList) {
                        let createName=Cookies.get('user');
                        res.data.dataList[0].createName=createName;
                        this.attachListTableData = this.attachListTableData.concat(res.data.dataList);
                        if(this.nodeId!='') {//如果是在已保存过的目录里上传文件
                            this.saveDoc();//上传之后立即保存
                        }
                        this.$message({
                            type:'success',
                            message:'上传成功'
                        });
                    }
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
            handleHeadSuccess (res, file, index) {
                console.log('hhhhhhhh', res, file, index, 456);
                // this.dataList = res.dataList;
                // this.addFlag = true;
                // this.creatData[index].headingImg = URL.createObjectURL(file.raw)
            },
            getViewPageFlag(){
                this.$myHttp({
                    method: 'get',
                    url: this.prefix + '/microarch/sys/syscommon/roles/' + sessionStorage.getItem('userName'),
                }).then(res => {
                  let roles =  res.data.rows.filter(o => {
                        if(o.roleCode == 'admin' || o.roleCode == 'docAdmin'){
                            return true
                        }
                    })

                    this.viewPageFlag = roles.length > 0 ? '':'view'

                    this.currentUser = roles.length > 0 ? 'admin':'other'


                    this.getTreeData();
                    this.handleNodeClick({id:1,pid:''});//默认展示文档目录根节点
                });
            }

        },
        created(){
            let userName=sessionStorage.getItem('userName');
            this.currentUser=userName;
            console.log('currentUser---',this.currentUser)
        },
        mounted(){
           //展示树形菜单

            this.getViewPageFlag()
            document.onkeydown = (event => {
                if (event.keyCode == '13') {
                    this.search();
                }
            })
        }
    }
</script>
<style scoped>
    h2{
        overflow: hidden;
        padding: 0;
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;
        margin-bottom: 10px;
    }
    .tree{
        overflow: auto;
        width:100%;
        height:500px;
    }
    .el-tree {
        min-width: 200px;
        min-height: 450px;
        display:inline-block !important;
    }
    .el-button--mini.is-circle{
        padding:7px;
    }
</style>