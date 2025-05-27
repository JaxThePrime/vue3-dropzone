<template>
  <div class="app" style="width: 478px; height: 200px">
    <Vue3Dropzone v-model="files">

    </Vue3Dropzone>
  </div>
</template>

<script setup>
import Vue3Dropzone from "./components/Vue3Dropzone.vue";
import {ref} from "vue";

const files = ref([])
</script>

<style lang="scss" scoped>
</style>