<template>
  <div class="app" style="width: 478px; height: 200px">
    <Vue3Dropzone state="error"
                  :max-file-size="1"
                  multiple select-file-strategy="merge"
                  v-model="files">
    </Vue3Dropzone>
    {{ isFocused }}
  </div>
</template>

<script setup>
import Vue3Dropzone from "./components/Vue3Dropzone.vue";
import {ref, watch} from "vue";

const files = ref([])

</script>

<style lang="scss" scoped>
</style>