<template>
  <div class="app">
    <Vue3Dropzone v-model="sampleFiles"
                  v-model:previews="previews"
                  previewPosition="outside"
                  mode="edit"
                  multiple
                  imgWidth="150px"
                  imgHeight="150px"/>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import Vue3Dropzone from './components/Vue3Dropzone.vue'

const previews = ref(['https://images.pexels.com/photos/31009096/pexels-photo-31009096.jpeg']);
const sampleFiles = ref([]);
</script>

<style scoped>
</style>