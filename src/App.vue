<template>
  <form class="app">
    <Vue3Dropzone v-model="sampleFiles"/>
  </form>
</template>

<script setup>
import {ref} from 'vue'
import Vue3Dropzone from './components/Vue3Dropzone.vue'

const previews = ref(['https://images.pexels.com/photos/31009096/pexels-photo-31009096.jpeg']);
const sampleFiles = ref([]);
</script>

<style scoped>
</style>