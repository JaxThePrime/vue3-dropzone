<template>
  <div class="app" style="width: 478px; height: 200px">
    <Vue3Dropzone v-model="files" accept="image/png">
    </Vue3Dropzone>
  </div>
</template>

<script setup>
import Vue3Dropzone from "./components/Vue3Dropzone.vue";
import {ref, watch} from "vue";

const files = ref([])
const showError = (data) => {
  console.log(data)
}
</script>

<style lang="scss" scoped>
</style>