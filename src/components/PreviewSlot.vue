<template>
    <Preview v-bind="previewProps">
        <template #preview="slotProps">
            <slot name="preview" v-bind="slotProps"></slot>
        </template>
    </Preview>
</template>

<script setup>
import { computed } from 'vue';
import Preview from './Preview.vue';

const props = defineProps({
    files: Array,
    previewUrls: Array,
    multiple: Boolean,
    mode: String,
    imgWidth: [Number, String],
    imgHeight: [Number, String],
    previewWrapperClasses: [String, Array, Object]
});

const emit = defineEmits(['removeFile']);

const previewProps = computed(() => ({
    ...props,
    onRemoveFile: (file) => emit('removeFile', file)
}));
</script>
