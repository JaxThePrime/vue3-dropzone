<template>
  <div class="app">
    <Vue3Dropzone multiple img-width="200px" mode="preview" :allowSelectOnPreview="true" selectFileStrategy="replace" :previews="['https://media.master.tube/app/Customer/19144721Emad.jpeg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AkEjA3ct6MfNrFeoQahM%2F20250819%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250819T061907Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Signature=1d44251fe54e212b630cefaef605b2da5c36c234b5c44ea8a0d8f6bbde394c8a']" :ignoreOriginalPreviews="true"/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Vue3Dropzone from './components/Vue3Dropzone.vue'

const handlePreviewsChange = (newPreviews) => {
  console.log('Previews changed:', newPreviews)
}
</script>

<style scoped>
</style>