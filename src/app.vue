<template>
    <div id="main" class="app-main">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
    export default {
        mounted () {

        },
        beforeDestroy () {

        },
        methods: {

        }
};
</script>

<style>
.app-main{
    width: 100%;
    height: 100%;
}

</style>
