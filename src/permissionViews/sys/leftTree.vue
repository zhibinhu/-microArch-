<template>
    <ul class="tree-menu">
        <li v-for="(item, index) in data" @click="giveBg" class="commonFlag">
      <span @click="toggle(item, index)" :title="item.text" style="white-space:nowrap;">
        <i :class="['icon', item.childrens && item.childrens.length ? folderIconList[index] : 'file-text', loading ? loadingIconList[index] : '']"></i>
        {{ item[name] || item.text }}
      </span>
            <tree-menu v-if="scope[index]" :data="item.childrens"></tree-menu>
        </li>
    </ul>
</template>

<script>
    export default {
        name: 'treeMenu',
        props: {
            data: Array,
            name: String
        },
        data () {
            return {
                folderIconList: [],
                loadingIconList: [],
                scope: {},
                loading: false
            };
        },
        created () {
            this.data.forEach((item, index) => {
                if (item.childrens && item.childrens.length) {
                    this.folderIconList[index] = 'folder';
                }
            });
        },
        mounted () {
            document.getElementsByClassName('tree-menu')[0].style.cssText = 'min-width:120px;overflow:auto;padding-left:5px;';
            var fileTexts = document.getElementsByClassName('file-text');
            for (var i = 0; i < fileTexts.length; i++) {
                var curClassName = fileTexts[i].parentNode.className;
                fileTexts[i].parentNode.className += ' textHover';
            }
        },
        methods: {
            giveBg (event) {
                // console.log(event)
                var allLi = document.getElementById('treeParentBox').getElementsByTagName('li');
                var curLi = event.target.parentNode;
                // 先遍历所有Li并去掉class bgClickLi;
                // console.log(curLi)
                if (curLi.getAttribute('class') && curLi.getAttribute('class').indexOf('commonFlag') > -1) {
                    Array.from(allLi).forEach((item) => {
                        if (item.className.indexOf('bgClickLi') > -1) {
                            var arrClass = item.className.split(' ');
                            var j = 0;
                            for (var i = 0; i < arrClass.length; i++) {
                                if (arrClass[i] == 'bgClickLi') {
                                    j = i;
                                }
                            }
                            arrClass.splice(j, 1);
                            var newClassName = arrClass.join(' ');
                            item.className = newClassName;
                        }
                    });
                    // 再给当前被点击的LI添加class bgClickLi;
                    var clsName = curLi.className;
                    if (clsName.indexOf('bgClickli') == -1) {
                        curLi.className = clsName + ' bgClickLi';
                    }
                }
            },
            doTask (index) {
                this.$set(this.scope, index, !this.scope[index]);
                this.folderIconList[index] = this.scope[index] ? 'folder-open' : 'folder';
            },
            toggle (item, index) {
                this.loadingIconList = [];

                if (item.childrens && item.childrens.length) {
                    this.loadingIconList[index] = 'loading';

                    // this.$emit('getSubMenu', item, (subMenuList) => {
                    //     debugger;
                    //     if (subMenuList && subMenuList.length) {
                    //         this.doTask(index);
                    //     }
                    // });
                    var that = this;
                    this.getSubMenu(item, (subMenuList) => {
                        if (subMenuList && subMenuList.length) {
                            that.doTask(index);
                        }
                    });
                } else {
                // 执行查询接口
                    console.log('id==', item.id);
                }
            },
            getSubMenu (menuItem, callback) {
                this.loading = true;
                // var idNum=menuItem.id.length;
                // console.log('idNum-----',idNum)
                // console.log('menuItem.children-----',menuItem.children);
                // if (menuItem.id === menuItem.children[0].id.substring(0, idNum)) {
                //     this.loading = false;
                //     callback(menuItem.children);
                // }
                if (menuItem.id === menuItem.childrens[0].pid) {
                    this.loading = false;
                    callback(menuItem.childrens);
                }
            }
        }
    };
</script>

<style scoped>
    .tree-menu {
        list-style: none;
        padding-left:20px;
    }
    .tree-menu li {
        line-height: 2;
    }
    .tree-menu li span {
        cursor: default;
    }
    .icon {
        display: inline-block;
        width: 15px;
        height: 15px;
        background-repeat: no-repeat;
        vertical-align: -2px;
    }
    .icon.folder {
        background-image: url(../../images/folder.png);
        background-size: 15px;
        cursor:pointer;
    }
    .icon.folder-open {
        background-image: url(../../images/folder-open.png);
        background-size: 15px;
        cursor:pointer;
    }
    .icon.file-text {
        background-image: url(../../images/file.png);
        background-size: 15px;
        cursor:pointer;
    }
    .textHover:hover{
        text-decoration: underline;
        color:#2d8cf0;
        cursor:pointer;
    }
    .icon.loading {
        background-image: url(../../images/loading.gif);
        background-size: 15px;
    }
    .bgClickLi{
        background:lightgreen;
    }
</style>