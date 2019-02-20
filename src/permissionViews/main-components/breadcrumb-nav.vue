<template>
    <Breadcrumb>
        <BreadcrumbItem 
            v-for="item in currentPath" 
            :href="item.path"
            :key="item.name"
        >{{ itemTitle(item) }}</BreadcrumbItem>
    </Breadcrumb>
</template>

<script>
export default {
    name: 'breadcrumbNav',
    props: {
        currentPath: Array
    },
    mounted () {
        console.log('currentPath-----', this.currentPath);
    },
    methods: {
        itemTitle (item) {
            // console.log('$t--------',this.$t);
            // console.log('item.title--------',item.title);
            if (typeof item.title === 'object') {
                if (this.$t) {
                    return this.$t(item.title.i18n);
                } else {
                    return '首页';
                }
            } else {
                return item.title;
            }
        }
    }
};
</script>

