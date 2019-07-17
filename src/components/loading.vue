<template>
    <div id="loadingPage" v-if="isLoading">
        <van-loading size="32px" vertical>加载中...</van-loading>
    </div>
</template>

<style lang="scss">
#loadingPage {
    background-color: transparent;
    position: fixed;
    z-index: 100;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

<script>
export default {
    props: ["isLoading"],
    data () {
        return {
        }
    },
    mounted() {
    }
}
</script>


