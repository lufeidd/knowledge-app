<template>
    <div id="loading" v-if="isLoading">
        加载中...
    </div>
</template>

<style lang="scss">
#loading {
    background-color: $white;
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


