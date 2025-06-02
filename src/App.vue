<template>
  <div class="app">
  </div>
</template>

<script setup>
import Vue3Dropzone from "./components/Vue3Dropzone.vue";
import { ref } from "vue";

// Regular dropzone files
const dropFiles = ref([]);

// Preview URLs for read-only mode
const previewUrls = ref([
  'https://images.pexels.com/photos/8830055/pexels-photo-8830055.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  'https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
]);

// Edit mode - the unified solution
const editFiles = ref([]);
const editPreviews = ref([
  'https://images.pexels.com/photos/1326947/pexels-photo-1326947.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
]);
const selectFileStrategy = ref('merge');

// Available random images for demo
const randomImages = [
  'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  'https://images.pexels.com/photos/1758771/pexels-photo-1758771.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
  'https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
];

const clearEdit = () => {
  editFiles.value = [];
  editPreviews.value = [];
};

const addRandomPreview = () => {
  const randomImage = randomImages[Math.floor(Math.random() * randomImages.length)];
  editPreviews.value.push(randomImage);
};

const resetDemo = () => {
  dropFiles.value = [];
  editFiles.value = [];
  editPreviews.value = [
    'https://images.pexels.com/photos/1326947/pexels-photo-1326947.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
    'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
  ];
  selectFileStrategy.value = 'merge';
};
</script>

<style scoped>
.app {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.main-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
}

.demo-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
}

.section-description {
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.dropzone-container {
  width: 100%;
  max-width: 500px;
  margin-bottom: 1rem;
}

.info-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.radio-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.info-stats {
  font-size: 0.875rem;
  color: #6b7280;
}

.info-stats > div {
  margin-bottom: 0.25rem;
}

.total-count {
  font-weight: 500;
  color: #2563eb !important;
}

.controls-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 2rem;
}

.controls-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-red {
  background-color: #ef4444;
  color: white;
}

.btn-red:hover {
  background-color: #dc2626;
}

.btn-green {
  background-color: #10b981;
  color: white;
}

.btn-green:hover {
  background-color: #059669;
}

.btn-blue {
  background-color: #3b82f6;
  color: white;
}

.btn-blue:hover {
  background-color: #2563eb;
}

.debug-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 2rem;
}

.debug-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.debug-card {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
}

.debug-card h4 {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.debug-card pre {
  font-size: 0.75rem;
  overflow: auto;
  background: white;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
}
</style>