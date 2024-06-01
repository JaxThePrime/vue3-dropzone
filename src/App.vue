<template>
  <div class="app" style="width: 478px; height: 200px">
    <Vue3Dropzone
        accept="image/jpg,image/jpeg,image/png"
        :max-file-size="1"
        :max-files="5"
        multiple
        @error="showError"
        v-model="files">
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