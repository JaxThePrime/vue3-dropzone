<template>
  <div class="app">
    <Vue3Dropzone mode="preview" :previews="previews" />
  </div>
</template>

<script setup>
import Vue3Dropzone from './components/Vue3Dropzone.vue';

const previews = [
  'https://images.pexels.com/photos/8830055/pexels-photo-8830055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
];
</script>

<style scoped>
</style>