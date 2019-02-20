<style lang="less">
    @import '../styles/menu.less';
</style>

<template>
    <Menu ref="sideMenu" :active-name="$route.name" :open-names="openNames" :theme="menuTheme" width="auto" @on-select="changeMenu">
        <template v-for="item in menuList">
            <MenuItem v-if="item.children && item.children.length<=1" :name="item.children[0].name" :key="item.path">
                <!--<Icon :type="item.icon" :size="iconSize" :key="item.path_icon"></Icon>-->
                <i :class="item.icon" :size="iconSize" :key="item.path_icon"></i>
                <span class="layout-text" :key="item.path_path">{{ itemTitle(item) }}</span>
            </MenuItem>

            <Submenu v-if="item.children && item.children.length > 1" :name="item.name" :key="item.path"  :style="theme">
                <template slot="title">
                    <!--<Icon :type="item.icon" :size="iconSize"></Icon>-->
                    <i :class="item.icon" :size="iconSize" :key="item.name_icon"></i>
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </template>
                <template v-for="child in item.children">
                    <MenuItem :name="child.name" :key="child.name">
                        <i :class="child.icon" :size="iconSize" :key="child.name_icon"></i>
                        <span class="layout-text" :key="child.name_span">{{ child.title }}</span>
                    </MenuItem>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
export default {
    name: 'sidebarMenu',
    props: {
        menuList: Array,
        iconSize: Number,
        menuTheme: {
            type: String,
            default: 'dark'
        },
        openNames: {
            type: Array
        }
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        }
    },
    computed: {
        theme () {
            console.log(this.$store.state.themeColor)

            return 'background-color: ' +  this.$store.state.themeColor
        }
    },
    updated () {
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
            }
        });
    }

};
</script>
<style scoped>
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover{
        border-right: none;
        color: #4987f8;
        background: rgba(79, 94, 123, 1)!important;
        border-left: 5px solid #4987f8;
    }
    .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title{
        padding-top:10px;
        padding-bottom:10px;
    }
</style>
