<template>
  <Preview v-bind="previewProps" @click="$emit('click', $event)" @mouseover="$emit('mouseover', $event)" @mouseleave="$emit('mouseleave', $event)">
    <template #preview="slotProps">
      <slot name="preview" v-bind="slotProps"></slot>
    </template>
  </Preview>
</template>

<script setup>
import {computed} from 'vue';
import Preview from './Preview.vue';

const props = defineProps({
  files: Array,
  previewUrls: Array,
  multiple: Boolean,
  mode: String,
  allowSelectOnPreview: Boolean,
  imgWidth: [Number, String],
  imgHeight: [Number, String],
  previewWrapperClasses: [String, Array, Object]
});

const emit = defineEmits(['removeFile', 'click', 'mouseover', 'mouseleave']);

const previewProps = computed(() => ({
  ...props,
  onRemoveFile: (file) => emit('removeFile', file)
}));
</script>
