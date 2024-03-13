<template>
  <div class="app">
    <Vue3Dropzone v-model="files"/>
  </div>
</template>

<script setup>
import Vue3Dropzone from "./components/Vue3Dropzone.vue";
import {ref} from "vue";

const files = ref([])

const logUpdate = () => {
  console.log(files.value)
}
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>