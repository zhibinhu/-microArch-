<!--
通用组件myTable

一、引入方法


step1 父类组件中

import myTable from '../../components/myTableSys.vue'

step2 中注册

components: {
    myTable
}


二、传入参数说明

ex：

myTableData: {
    url: 'project/getOppoList',                                 //table总数据请求地址
    dlUrl: 'sysData/delProduct',                                //删除单行数据请求地址
    viewName: 'Viewproduct',                                    //单行查看按钮跳转地址路由
    editName: 'Editproduct',                                    //单行编辑按钮跳转地址路由
    addName:'addOppoProject',                                   //table上方新增按钮跳转路由
    exportName:'商机信息管理.xlsx',                               //导出Excel文件名
    tableThead: [                                               //所有列的label、value
        {
            headName: '商机编号',
            headKey: 'oppoNum'
        },
        {
            headName: '机会名称',
            headKey: 'oppoProjectName'
        }
    ],
    checkedThreadData: ['oppoNum','oppoProjectName'],           //默认展示列
    entity:{},
    ext:[],
    myorderBy: ''
}-->

<template>

    <div>


        <el-dialog title="拖动调整顺序" width="90%" :visible.sync="dialogTableVisible" :modal-append-to-body="false" :append-to-body	="true" @close="closeDialog">

            <div style="width: 100%;margin-bottom: 50px;padding-left: 15px;position:relative;top:-15px;" class="adjustCssLabel">

                <el-checkbox-group v-model="myTableData.checkedThreadData">

                    <draggable v-model="myTableData.tableThead">

                        <el-checkbox
                                style="width: 49%;height: 32px;line-height:32px;float:left;border: 1px solid #ddd;background: #E9EAEC;border-radius: 5px;margin: 0 1% 10px 0;padding-left: 5px"
                                v-for="(element,index) in myTableData.tableThead" :key="index" :label="element.headKey">
                            <label style="">

                                <el-slider input-size="mini" v-model="element.width" :max="200"
                                           style="margin-bottom: -28px;margin-left: 32%;width: 300px;position:absolute;top:-4px;right:20px;"
                                           show-input
                                           @change="computeAllSize(element.width)"></el-slider>

                            </label>
                            {{element.headName}}
                        </el-checkbox>
                    </draggable>
                </el-checkbox-group>


            </div>

            <span slot="footer" class="dialog-footer">

                     <el-button type="primary" @click="confirmCustom">确 定</el-button>

            </span>
        </el-dialog>


        <el-button @click="handleAdd()" type="primary" size="small" style="margin-top: 10px;margin-bottom: 5px"
                   v-if="myTableData.addName">
            <i style="margin-right: 5px" class="el-icon-circle-plus-outline"></i>{{myTableData.addBtnName||'新增'}}
        </el-button>

        <el-button @click="customColumn()" type="danger" size="small" style="margin-top: 10px;margin-bottom: 5px"
                   v-if="myTableData.custom">
            <i style="margin-right: 5px" class="el-icon-rank"></i>自定义列表
        </el-button>

        <!--<el-button @click="exportTableList()" type="success" size="small" style="margin-top: 10px;margin-bottom: 5px"-->
                   <!--v-if="myTableData.exportName">-->
            <!--<i style="margin-right: 5px" class="el-icon-document"></i>报表导出-->
        <!--</el-button>-->

        <div ref="tableWrap" style="background-color: white">

            <el-table
                    v-loading="loading"
                    class="myTable"
                    :max-height="maxHeight"
                    border stripe
                    :data="tableData"
                    :id="myTableDataExcel?'myTableExcel':'myTable'"
                    v-if="mark"
                    :header-cell-style="{padding:'1px 0',background:'#dfebf9',fontSize:'12px'}"
                    :cell-style="{padding:'3px 0'}"
                    size="mini"
                    @sort-change="sorthange"
                    :sort-orders="sortOrders"
                    ref="myTable"
                    @selection-change="handleSelectionChange"
                    @row-click="getCurrentRow"
            >
                <el-table-column
                        v-if="myTableData.selectColFlag"
                        :fixed="myTableData.selectColFlag.fixedColumn?true:false"
                        width="55"
                        label="选择"
                >
                    <template slot-scope="scope">
                        <el-radio v-model="myTableData.radio" :label="scope.row.id" :key="scope.row.id" :name="radioName" @change.native="getCurrentRow(scope.row)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column
                        v-for='(items , index) in myTableData.tableThead'
                        v-if="items.selectionCheckbox"
                        :fixed="items.fixedColumn?true:false"
                        :key="index"
                        type="selection"
                        width="55"
                ></el-table-column>
                <el-table-column :prop="items.headKey" :key='index' v-for='(items , index) in myTableData.tableThead'
                                 min-width="180px"
                                 :label="items.headName" :width="items.width*2.5" :align="items.align"
                                 :fixed="items.fixedColumn?true:false"
                                 v-if="!items.isHidden"
                                 :show-overflow-tooltip="items.showToolTipFlag"
                                 :sortable="(items.headKey == 'pageIndex' || items.unSort || myTableData.noSortIcon) ? false:'custom'">
                    <template slot-scope="scope">
                        <el-tooltip placement="top" effect="light"
                                    :disabled="!items.isNeedTips || !scope.row[items.headKey]" :placement="placement">

                            <div v-if="items.dirKey && !items.customerShow" slot="content">{{scope.row[items.headKey]}}</div>

                            <div v-else slot="content">{{scope.row[items.headKey]}}</div>

                            <p v-if="items.headKey == 'pageIndex'">{{scope.$index+1}}</p>

                            <!--<p v-if="items.dirKey"> {{scope.row[items.headKey] | datafil(items.dirKey)}}</p>-->
                            <p v-if="items.dirKey && !items.customerShow"> {{scope.row[items.headKey] | datafil(items.headKey)}}</p>
                            <p v-if="items.amoutKey"> {{scope.row[items.headKey] | formatFilNew(items.amoutKey)}}</p>
                            <p v-if="items.isProjectFmt"> {{scope.row[items.headKey] |
                                projectTypeFil(items.amoutKey)}}</p>
                            <p v-if="items.isTimeData">
                                {{scope.row[items.headKey] | prAndOppoTimeFmt(items.amoutKey)}}</p>
                            <p v-if="items.isPersonData">
                                {{scope.row[items.headKey] | prAndOppoPersonFmt(items.amoutKey)}}</p>
                            <p v-if="items.isAmountFmt"> {{scope.row[items.headKey] | amountFmt(items.amoutKey)}}</p>

                            <p v-if="items.headKey == 'isAllowWorkingHours'">{{scope.row[items.headKey]== 'true'? '是':'否'}}</p>

                            <!--<p v-if="items.orgStatus">{{scope.row[items.headKey]== 'Y'? '启用':scope.row[items.headKey]== 'N'?'禁用':''}}</p>-->

                            <!--<p v-if="items.userStatus">{{scope.row[items.headKey]== 'Y'? '启用':scope.row[items.headKey]== 'N'?'停用':''}}</p>-->

                            <!--<p v-if="items.userRoleFlag">{{scope.row[items.headKey] | showUserRole}}</p>-->

                            <!--<p v-if="items.userDepartment">{{scope.row[items.headKey] | showUserDepartment}}</p>-->

                            <p v-if="items.orgtype">{{scope.row[items.headKey]== 'bumen'? '部门':scope.row[items.headKey]== 'gongsi'?'公司':scope.row[items.headKey]}}</p>

                            <!--<p v-if="items.postStatus">{{scope.row[items.headKey]== 'gaoceng'? '高层':scope.row[items.headKey]== 'zhongceng'?'中层':scope.row[items.headKey]== 'jiceng'?'基层':'其他'}}</p>-->

                            <p v-if="items.underline" :class="items.underline?'underline':''" @click="handleEdit(scope.row,items.hasCustomerEdit)">{{scope.row[items.headKey]}}</p>

                            <p v-if="items.viewUnderline" :class="items.viewUnderline?'underline':''" @click="handleView(scope.row, items.hasCustomerEdit)">{{scope.row[items.headKey]}}</p>

                            <p v-if="items.customerShow" v-html="$options.filters.priorityFil(scope.row[items.headKey])"></p>

                            <p v-if="items.processStatus" >{{scope.row[items.headKey]== 1 ? '激活': '挂起'}}</p>

                            <p v-else>{{scope.row[items.headKey]}}</p>


                        </el-tooltip>

                    </template>


                </el-table-column>

                <el-table-column
                        label="操作"

                        :fixed="myTableData.right? 'right':null"
                        :width="myTableData.actionWidth? myTableData.actionWidth:'120'" v-if="!myTableData.hiddenAction">
                    <template slot-scope="scope">
                        <el-button
                                v-if="myTableData.isShowManageDict && !myTableData.manageDictHidden"
                                :disabled='scope.row.permission|optfil(1,permission)'
                                size="mini"
                                type="success"
                                circle
                                title="管理字典项"
                                @click="handleDict(scope.row)"><i class="el-icon-setting" style="font-size: 11px"></i>
                        </el-button>
                        <el-button
                                v-if="!myTableData.isHiddenView && !myTableData.viewBtnHidden"
                                :disabled='scope.row.permission|optfil(1,permission)'
                                size="mini"
                                type="success"
                                circle
                                title="查看"
                                @click="handleView(scope.row)"><i class="el-icon-tickets" style="font-size: 11px"></i>
                        </el-button>
                        <el-button
                                v-if="!myTableData.isHiddenEdit && !myTableData.editBtnHidden"
                                :disabled='scope.row.permission|optfil(2,permission)'
                                size="mini"
                                type="primary"
                                circle
                                title='编辑'
                                @click="handleEdit(scope.row)"><i class="el-icon-edit" style="font-size: 11px"></i>
                        </el-button>
                        <el-button
                                v-if="!myTableData.isHiddendelete && !myTableData.delBtnHidden"
                                :disabled='scope.row.permission|optfil(3,permission)'
                                size="mini"
                                type="danger"
                                circle
                                title="删除"
                                @click="deleteRow(scope.$index, tableData,scope.row)"><i class="el-icon-delete"
                                                                                         style="font-size: 11px"></i>
                        </el-button>
                    </template>
                </el-table-column>
                <!--待办列表操作按钮-->
                <el-table-column
                        label="操作"
                        fixed="right"
                        :width="myTableData.actionWidth? myTableData.actionWidth:'100'" v-if="myTableData.showTodoListAction">
                    <template slot-scope="scope">
                        <el-button
                                v-if="myTableData.HideGotodo"
                                size="mini"
                                type="primary"
                                circle
                                title="办理"
                                @click="goProcess(scope.row)"><i class="el-icon-edit" style="font-size: 11px"></i>
                        </el-button>
                        <el-button
                                size="mini"
                                type="primary"
                                circle
                                title="流程跟踪"
                                @click="traceFlow"><i class="el-icon-view" style="font-size: 11px"></i>
                        </el-button>
                    </template>
                </el-table-column>
                <!--操作日志列表操作按钮-->
                <el-table-column
                        label="操作"
                        fixed="right"
                        :width="myTableData.actionWidth? myTableData.actionWidth:'100'" v-if="myTableData.showLogListAction">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="primary"
                                @click="showRequestParams(scope.row)">输入
                            <!--<i class="el-icon-edit" style="font-size: 11px"></i>-->
                        </el-button>
                        <el-button
                                size="mini"
                                type="primary"
                                @click="showRequestResult(scope.row)">输出
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>


            <el-pagination
                    v-if="!myTableData.hiddenPagination"
                    layout="total,sizes,prev, pager, next,jumper"
                    :total="total"
                    @current-change="currentChange"
                    @size-change="sizeChange"
                    :current-page="mypage"
                    :page-size="mysize"
                    :style="paginationStyle"
            >
            </el-pagination>
        </div>

    </div>


</template>


<script>
    import Cookies from 'js-cookie';
    import FileSaver from 'file-saver';
    import XLSX from 'xlsx';
    import draggable from 'vuedraggable';
    import util from '../libs/util';

    export default {

        data () {
            return {
                maxHeight:this.$store.state.maxHeight,
                loading: true,
                placement: 'right-end',
                dialogTableVisible: false,
                disabled: true,
                mark: true,
                selfAdd:0,
                fullHeight: document.documentElement.clientHeight,
                tableData: [],
                dirData: {},
                dirLablArry: [],
                mysize: 10,
                mypage: 1,
                total: 1,
                direction: '',
                field: '',
                myorderBy: '',
                sortOrders: ['ascending', 'descending'],
                paginationStyle: 'margin-bottom:35px',
                myTableStyle: 'margin-bottom:35px',
                radioName: 'a1',
                exportThead:[],
                exportList:[]

            };
        },
        components: {
            draggable
        },
        props: ['myTableData','myTableDataExcel'],
        methods: {

            closeDialog () {
                this.findAllProject(1);
            },
            // 模态框点击确认后逻辑
            confirmCustom () {

                this.refreshMyTable();

                this.myTableData.tableThead.forEach((item) => {
                    if (this.myTableData.checkedThreadData.indexOf(item.headKey) >= '0') {
                        item.isHidden = false;
                    } else {
                        item.isHidden = true;
                    }
                });

                this.exportThead=this.myTableData.tableThead;//刷新导出表格的表头

                console.log(this.myTableData.tableThead);

                this.findAllProject(1);
                //重新定义表格的总宽度
                this.dialogTableVisible = false;
                this.computeAllSize();
                // 将用户选择存储本地
                Cookies.set(this.myTableData.customStyleData[0], this.myTableData.tableThead);
                Cookies.set(this.myTableData.customStyleData[1], this.myTableData.checkedThreadData);
            },

            // 刷新table
            refreshMyTable () {
                this.mark = false;
                this.mark = true;
            },

            // 自定义列
            customColumn () {
                this.dialogTableVisible = true;
            },

            // 新增xx
            handleAdd () {
                let _this = this;
                this.$router.push({
                    'name': _this.myTableData.addName,
                    'params': {
                        'currentPage': _this.currentPage
                    }
                });
            },

            /// 报表导出
            exportExcel () {
                var _this = this;

                var wb = XLSX.utils.table_to_book(document.querySelector('#myTable'));

                var fix = document.querySelector('.el-table__fixed');

                if (fix) {
                    wb = XLSX.utils.table_to_book(document.querySelector('#myTable').removeChild(fix));
                    document.querySelector('#myTable').appendChild(fix);
                } else {
                    wb = XLSX.utils.table_to_book(document.querySelector('#myTable'));
                }

                var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'});

                try {
                    FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), _this.myTableData.exportName);
                } catch (e) {
                    console.log(e, wbout);
                }
                return wbout;
            },
/// 报表导出
            exportAllExcel () {
                var _this = this;

                var wb = XLSX.utils.table_to_book(document.querySelector('#myTableExcel'));

                var fix = document.getElementById('myTableExcel').querySelector('.el-table__fixed');

                if (fix) {
                    wb = XLSX.utils.table_to_book(document.querySelector('#myTableExcel').removeChild(fix));
                    document.querySelector('#myTableExcel').appendChild(fix);
                } else {
                    wb = XLSX.utils.table_to_book(document.querySelector('#myTableExcel'));
                }

                var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'});

                try {
                    FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), _this.myTableDataExcel.exportName);
                } catch (e) {
                    console.log(e, wbout);
                }
                return wbout;
            },
            // 数据字典值请求
            makeDataDictionary: function (dtype) {
                let sysDict = JSON.parse(localStorage.getItem('sysDict'));
                // console.log('sysDict------=======',sysDict)
                for (var items in sysDict) {
                    if (dtype == sysDict[items].dtype) {
                        this.dirData[dtype] = sysDict[items].sysDicts;
                    }
                }
            },
            /**
             * 查询table数据
             */
            findAllProject (mypage) {
                if (mypage != null) { this.mypage = mypage; }
                var _this = this;

                var url = _this.prefix + _this.myTableData.url + window.suffix;
                this.$myHttp({
                    method: 'POST',
                    url: url,
                    data: {
                        'entity': _this.myTableData.entity,
                        'ext': _this.myTableData.ext,
                        'where': _this.myTableData.where,
                        'pageNum': this.myTableDataExcel?0:this.mypage - 1,
                        'pageSize': this.myTableDataExcel?99999:this.mysize,
                        'orderBy': _this.myTableData.myorderBy
                    }
                }).then(res => {
                    // 成功回调方法
                    console.log('tableData-----', res);
                    this.total = Number(res.data.total);
                    this.tableData = res.data.rows;
                    this.setPaginationStyle();
                    var that = this;
                    setTimeout(function () {
                        that.hideRadioLabel('myTable');// 隐藏radiobutton的label数字
                        if(that.myTableDataExcel){
                            that.hideRadioLabel('myTableExcel');
                        }
                    }, 0);
                    this.loading = false;
                    this.dialogTableVisible = false;
                    this.$emit('excelTableRefresh');
                });
            },
            sizeChange (size) {
                this.mysize = size;
                this.mypage = 1;
                this.findAllProject();
            },
            currentChange (page) {
                this.mypage = page;
                this.findAllProject();
            },
            sorthange (column) {
                if (column.prop !== null) {
                    if (column.prop == 'pidName') {
                        this.myTableData.myorderBy = 'pid' + ' ' + (column.order === 'ascending' ? 'asc' : 'desc');
                    } else if (column.prop == 'documentTypeName') {
                        this.myTableData.myorderBy = 'documentType' + ' ' + (column.order === 'ascending' ? 'asc' : 'desc');
                    } else if (column.prop == 'typeName') {
                        this.myTableData.myorderBy = 'type' + ' ' + (column.order === 'ascending' ? 'asc' : 'desc');
                    } else {
                        this.myTableData.myorderBy = column.prop + ' ' + (column.order === 'ascending' ? 'asc' : 'desc');
                    }
                }
                this.mypage = 1;
                this.findAllProject();
            },
            // 管理字典项
            handleDict (row) {
                this.$router.push({
                    'name': this.myTableData.dictManagementName,
                    'params': {
                        'id': row.id,
                        'currentPage': this.currentPage
                    }
                });
            },
            // 查看
            handleView (row, hasCustomer) {
                // 工单流程映射业务路径
                if (row.businessUrl) {
                    this.myTableData.viewName = row.businessUrl.split(',')[1];
                }
                if (!hasCustomer) {
                    this.$router.push({
                        'name': this.myTableData.viewName,
                        'params': {
                            /* "projectName":row.projectName, */
                            'id': row.id,
                            'currentPage': this.currentPage,
                            'row': row
                        }
                    });
                } else {
                    this.$emit('customerEdit', row);
                }
            },
            // 修改
            handleEdit (row, hasCustomer) {
                // 工单流程映射业务路径
                if (row.businessUrl) {
                    this.myTableData.editName = row.businessUrl.split(',')[0];
                }
                if (!hasCustomer) {
                    this.$router.push({
                        'name': this.myTableData.editName,
                        'params': {
                            'type': 'project',
                            'id': row.id,
                            'username': row.username,
                            'code': row.code,
                            'currentPage': this.currentPage,
                            'row': row
                        },
                        'query':{
                            'id':row.id,
                            'type':row.documentType
                        }
                    });
                } else {
                    this.$emit('customerEdit', row);
                }
            },
            // 删除
            deleteRow (index, tableData, row) {
                var _this = this;
                var currentPerson = sessionStorage.getItem('userName');
                // console.log("mywxz",row)
                // _this.$emit("deleteApply",row)
                if (this.myTableData.deleVerification) {
                    var ddv = this.myTableData.deleVerification.deleteValue;
                    _this.$myHttp({
                        method: 'POST',
                        url: this.prefix + this.myTableData.deleVerification.deleteApply + window.suffix,
                        data: {
                            'entity': {
                                [ddv]: row[this.myTableData.deleVerification.deleteValue]
                            }
                        }
                    }).then(resBol => {
                        if (resBol.data.ext) {
                            this.$message({
                                showClose: true,
                                message: _this.myTableData.deleVerification.deleteMessage,
                                type: 'warning'
                            });
                        } else {
                            _this.deleteFunction(index, tableData, row);
                        }
                    });
                } else {
                    _this.deleteFunction(index, tableData, row);
                }
            },

            // 删除
            deleteFunction (index, tableData, row) {
                var _this = this;
                var currentPerson = sessionStorage.getItem('userName');
                this.$confirm('此操作将永久删除项目信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (row.userName == currentPerson) {
                        _this.$message({
                            message: '不可删除当前登录人',
                            type: 'warning'
                        });
                        return false;
                    }
                    _this.$myHttp({
                        method: 'POST',
                        url: this.prefix + this.myTableData.dlUrl + window.suffix,
                        data: {
                            'entity': {
                                'id': row.id
                            },
                            'ext': [
                                row.id
                            ],
                            'pageNum': 0,
                            'pageSize': 1000
                        }
                    }).then(res => {
                        if (res.data.subCode == 0) {
                            if (_this.total % _this.mysize == 1) { _this.mypage = _this.mypage == 1 ? 1 : _this.mypage - 1; }
                            // 成功回调方法
                            _this.findAllProject();
                        } else {
                            _this.$notify({
                                title: '无法删除',
                                message: res.data.subMsg,
                                type: 'warning'
                            });
                        }
                    });
                }).catch(() => {
                });
            },
            /**
             * 设置分页位置的方法
             */
            setPaginationStyle: function () {

                //动态设置table最大高度  使头部、尾部在数据增多时固定


                this.$store.state.fullHeight = this.fullHeight
                if(Cookies.get('hiddenRightValue') == 'true'){
                    this.maxHeight = this.fullHeight - 200

                }else {
                    this.maxHeight = this.fullHeight - 240

                }
                // 浏览器高度小于 704 直接定位到底部
                if (this.fullHeight < 639) {
                    this.paginationStyle = 'background-color: white;position: fixed;bottom: 0; width: 100%; z-index: 100;margin-left:-20px';
                    this.myTableStyle = 'margin-bottom:35px';
                } else {
                    // table宽度小于 浏览器高度 - （面包屑 + 导航栏的高度）说明需要固定位置
                    if (this.$refs.myTable && this.$refs.myTable.$el.clientHeight < this.fullHeight - 280) {
                        this.paginationStyle = 'background-color: white';
                        this.myTableStyle = 'margin-bottom:0px';
                    } else {
                        this.paginationStyle = 'background-color: white;position: fixed;bottom: 0; width: 100%; z-index: 100;margin-left:-20px';
                        this.myTableStyle = 'margin-bottom:35px';
                    }
                }
            },

            /**
             * 读取用户储存后的排序数据
             */
            readCustomStyleData: function () {
                // 初始化读取 用户存储排列顺序
                if ((Cookies.get(this.myTableData.customStyleData[0])) && (Cookies.get(this.myTableData.customStyleData[1]))) {
                    this.myTableData.tableThead = JSON.parse(Cookies.get(this.myTableData.customStyleData[0]));
                    this.myTableData.checkedThreadData = JSON.parse(Cookies.get(this.myTableData.customStyleData[1]));
                    if(typeof(this.myTableData.checkedThreadData[this.myTableData.checkedThreadData.length-1])=='number') {
                        let allSize = this.myTableData.checkedThreadData[this.myTableData.checkedThreadData.length - 1];
                        this.$refs.tableWrap.style.maxWidth = allSize + 2 + 'px';
                    }
                }
            },
            adjustTableHead () {
                setTimeout(function () {
                    var myTableSys = document.getElementById('myTable');
                    if (myTableSys) {
                        var thGutter = myTableSys.getElementsByClassName('gutter')[0];
                        if (thGutter != undefined) { thGutter.style.display = 'table-cell'; }
                    }
                }, 500);
            },
            handleSelectionChange (val) {
                this.$emit('getSelectionData', val);
            },
            getCurrentRow (val) {
                this.$emit('getSelectedData', val);
            },
            goProcess(val){
              this.$emit('goProcess',val);//执行待办列表的办理操作
            },
            traceFlow(){
                this.$emit('traceFlow');//执行待办列表的流程追踪操作
            },
            hideRadioLabel (id) {
                if(document.getElementById(id)) {
                    var labels = document.getElementById(id).getElementsByClassName('el-radio__label');
                }
                for (var i = 0; i < labels.length; i++) {
                    // if(!isNaN(labels[i].innerText)){
                    (function (i) {
                        var everyLabel = labels[i];
                        setTimeout(() => {
                            if(everyLabel.parentNode) {
                                everyLabel.parentNode.removeChild(everyLabel);
                            }
                        }, 1);
                    })(i);
                    // }
                }
            },
            setLoading () {
                if (this.myTableData.noNeedLoading) {
                    this.loading = false;
                }
            },
            exportTableList () {
                var _this = this;
                var url = _this.prefix + _this.myTableData.url + window.suffix;
                this.$myHttp({
                    method: 'POST',
                    url: url,
                    data: {
                        'entity': _this.myTableData.entity,
                        'ext': _this.myTableData.ext,
                        'where': _this.myTableData.where,
                        'pageNum': 0,
                        'pageSize':99999,
                        'orderBy': _this.myTableData.myorderBy
                    }
                }).then(res => {
                    // 成功回调方法
                    this.loading = true;
                    this.exportList = res.data.rows;//导出表格的内容
                    // var header = {"手机名称":"id","颜色":"name","售价":"sex"};
                    var header = [];
                    for (var i = 0; i < this.exportThead.length; i++) {
                        if (!this.exportThead[i].isHidden) {
                            var headerEle={};
                            headerEle['column'] = this.exportThead[i].headKey;
                            headerEle['columnName'] = this.exportThead[i].headName;
                            if(this.exportThead[i].dirKey){
                                headerEle['dictType']=this.exportThead[i].headKey;
                            }
                            if(this.exportThead[i].isNumber){
                                headerEle['isNumber']=true;
                            }
                            header.push(headerEle);
                        }
                    }
                    // console.log('header---', header);
                    // var list =[{"id":"w","name":"red","sex":"1234"},{"id":"w","name":"red","sex":"1234"},{"id":"w","name":"red","sex":"1234"}];
                    var list = [];
                    for (var i = 0; i < this.exportList.length; i++) {
                        let obj = {};
                        for (var k in header) {
                            if (header[k]['column'] == 'pageIndex') {
                                obj[header[k]['column']] = i + 1;
                                // continue;
                            } else if(header[k]['column']!=='dictType'){
                                obj[header[k]['column']] = this.exportList[i][header[k]['column']];
                            }
                        }
                        list.push(obj);
                    }
                    // console.log('list----', list);
                    var fileName = this.myTableData.exportName;
                    this.$myHttp({
                        method: 'post',
                        url: this.prefix + '/microarch/sys/syscommon/exportexcel',
                        data: {
                            "list": list,
                            "header": header,
                            "fileName": fileName
                        },
                        responseType: 'arraybuffer'
                    }).then(res => {
                        // 成功回调
                        console.log('res--excel导出--',res)
                        var headers = res.headers;
                        var blob = new Blob([res.data], {
                            type: headers['content-type']
                        });
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = decodeURIComponent(headers['filename']);
                        link.click();
                        //   firefox 里面触发
                        var browser=navigator.userAgent.toLowerCase();
                        if(browser.indexOf('firefox')>-1) {
                            var event = document.createEvent("MouseEvents");
                            event.initEvent("click", true, true);
                            link.dispatchEvent(event);
                        }
                        _this.loading = false;
                    });
                });
            },
            computeAllSize(val){
                console.log('haha--val--',val);
                console.log('myTableData.tableThead--',this.myTableData.tableThead);
                console.log('myTableData.checkedThreadData--',this.myTableData.checkedThreadData);
                let allSize=0;
                this.myTableData.tableThead.forEach((item,index) => {
                    if (this.myTableData.checkedThreadData.indexOf(item.headKey) >= '0') {
                        allSize+=item.width*2.5;
                        console.log('index==',index,'---',item.width);
                    }
                });
                if(this.myTableData.selectionCheckbox){
                    allSize+=55;
                }
                if(this.myTableData.selectColFlag){
                    allSize+=55;
                }
                if(!this.myTableData.hiddenAction){
                    allSize+=140;
                }
                if(this.myTableData.showTodoListAction){
                    allSize+=100;
                }
                this.$refs.tableWrap.style.maxWidth=allSize+2+'px';
                this.myTableData.checkedThreadData.push(allSize);
            },
            showRequestParams(val) {
                this.$emit('showParams', val);
            },

            showRequestResult(val) {
                this.$emit('showResult', val);
            }
        },
        mounted: function () {

            var _this = this, dirArry = [], reqArry = [];
    
            this.setLoading();
            this.exportThead=this.myTableData.tableThead;//导出的excel表头
            window.onresize = () => {
                return (() => {
                    window.fullHeight = document.documentElement.clientHeight;
                    _this.fullHeight = window.fullHeight;
                    _this.setPaginationStyle();
                    _this.adjustTableHead();

                })();
            };

            if (this.myTableData.customStyleData) {
                this.readCustomStyleData();
            }

            this.myTableData.tableThead.forEach(function (item) {
                if (item.dirKey) {
                    // dirArry.push(item.dirKey)
                    // _this.dirLablArry.push(item.headKey)
                    _this.makeDataDictionary(item.headKey);
                }
            });
            Cookies.set('dirData', this.dirData);
            this.findAllProject(this.currentPage);
            // 解决表格表头错位的问题
            this.adjustTableHead();
            this.$store.state.me = this
        },
        filters: {
            optfil (v, idx, perimission) {
                if (perimission == null || perimission == '') perimission = '0';
                if (v == null || v == '') v = '0';
                let num = Number.parseInt(perimission, 2) | Number.parseInt(v, 2);
                v = num.toString(2).length < 4 ? util.addPreZero(num.toString(2)) : num.toString(2);
                return v == null ? true : v.charAt(idx) != 1;
            },
            datafil: function (v1, v2) {
                var data = JSON.parse(Cookies.get('dirData'));
                var res = '';
                if (data[v2]) {
                    data[v2].forEach(function (item) {
                        if (item.dkey == v1) {
                            res = item.dvalue;
                        }
                    });
                }
                return res;
            },
            showUserRole (roles) {
                var arr = [];
                // console.log('roles---',roles)
                if (roles && roles.length > 0) {
                    roles.forEach((item, index) => {
                        arr.push(item.roleName);
                    });
                }
                return arr.join(',');
            },
            showUserDepartment (orgs) {
                var arr = [];
                // console.log('orgs---',orgs)
                if (orgs && orgs.length > 0) {
                    orgs.forEach((item, index) => {
                        arr.push(item.orgName);
                    });
                }
                return arr.join(',');
            },
            priorityFil (val) {
                var fildata = '<font color="green">一般</font>';
                if (val == '50') {
                    fildata = '<font color="green">一般</font>';
                } else if (val == '100') {
                    fildata = '<font color="orange">紧急</font>';
                } else if (val == '150') {
                    fildata = '<font color="red">特急</font>';
                } else {
                    fildata = '<font color="green">一般</font>';
                }
                return fildata;
            }
        },
        computed: {
            permission () {
                let nodeCode = this.myTableData.nodeCode == null ? '' : this.myTableData.nodeCode;
                if (this.myGlobal.getPermission) { return this.myGlobal.getPermission(nodeCode); }// 11101
            }
        },
        watch: {
            // 监控屏幕的高度，动态设置分页样式
            fullHeight (val) {
                this.fullHeight = val;
                if (this.$refs.myTable.$el.clientHeight < this.fullHeight - 280) {
                    this.paginationStyle = 'background-color: white';
                    this.myTableStyle = 'margin-bottom:0px';
                } else {
                    this.paginationStyle = 'background-color: white;position: fixed;bottom: 0; width: 100%; z-index: 100;margin-left:20px';
                    this.myTableStyle = 'margin-bottom:35px';
                }
            },
            clientHeight (val) {
                this.clientHeight = val;
            }

        },
        updated: function () {
            // render完成之后出发调整样式方法
            this.setPaginationStyle();
        }

    };
</script>

<style scoped>
    .el-button.is-circle {
        padding: 7px;
    }

    .el-button{
        margin-left:2px
    }

    .el-tooltip {

        height: 28px;
    }

    .myTable .cell {
        overflow-y: hidden !important;
        max-height: 28px !important;
    }
    .underline{
        text-decoration:underline;
        cursor: pointer;
    }
</style>
