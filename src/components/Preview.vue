<template>
  <div
    class="preview-container"
    :class="previewWrapperClasses"
    v-if="mode === 'drop'"
  >
    <slot
      name="preview"
      v-for="file in files"
      :data="file"
      :formatSize="formatSize"
      :removeFile="removeFile"
    >
      <div
        class="preview"
        :class="{
          preview__multiple: multiple,
          preview__file:
            file && file.file.type && !file.file.type.includes('image/'),
        }"
        :style="{
          width: `${imgWidth} !important`,
          height: `${imgHeight} !important`,
        }"
      >
        <img
          :src="file.src"
          :alt="file.file.name"
          v-if="file && file.file.type && file.file.type.includes('image/')"
        />
        <Icon
          :name="file.file.name.split('.').pop()"
          v-if="
            (file && file.file.type && !file.file.type.includes('image/')) ||
            (file && file.file.type && !file.file.type.includes('video/'))
          "
        />
        <div class="img-details" v-if="file.file.name || file.file.size">
          <button class="img-remove" @click="removeFile(file)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-x"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
          <h2>{{ file.file.name }}</h2>
          <span>{{ formatSize(file.file.size) }}</span>
        </div>
        <div
          class="progress-bar-container"
          v-if="file.status === 'pending' || file.status === 'uploading'"
        >
          <div
            class="progress-bar"
            :aria-valuenow="file.progress"
            aria-valuemin="0"
            aria-valuemax="100"
            :style="{ width: `${file.progress}%` }"
          >
            {{ file.progress }}%
          </div>
        </div>
      </div>
    </slot>
  </div>
  <div
    class="preview-container"
    :class="previewWrapperClasses"
    v-if="mode === 'preview'"
  >
    <template v-for="file in previewUrls">
      <div
        class="preview"
        :class="{ preview__multiple: previewUrls.length > 1 }"
        :style="{
          width: `${imgWidth} !important`,
          height: `${imgHeight} !important`,
        }"
      >
        <img :src="file.src" />
      </div>
    </template>
  </div>
</template>

<script setup>
import Icon from "./Icon.vue";

const props = defineProps({
  files: {
    type: Array,
    default: [],
  },
  previewUrls: {
    type: Array,
    default: [],
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: "drop",
    validator(value) {
      return ["drop", "preview"].includes(value);
    },
  },
  imgWidth: [Number, String],
  imgHeight: [Number, String],
  previewWrapperClasses: String,
});

const emit = defineEmits(["removeFile"]);

// Formats file size
const formatSize = (size) => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 + " " + ["B", "KB", "MB", "GB"][i]
  );
};

// Removes file from files list
const removeFile = (item) => {
  emit("removeFile", item);
};
</script>

<style scoped>
.preview-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
}

.preview {
  width: 100%;
  height: 95%;
  border-radius: 8px;
  flex-shrink: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview__multiple {
  height: 90% !important;
  width: 90% !important;
}

.preview__file {
  border: 1px dashed rgba(var(--v3-dropzone--primary));
}

.preview__file--error {
  border-color: rgba(var(--v3-dropzone--error)) !important;
}

.preview:hover .img-details {
  opacity: 1 !important;
  visibility: visible !important;
}

.preview img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.img-details {
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  width: 100%;
  height: 100%;
  background: rgba(
    var(--v3-dropzone--overlay),
    var(--v3-dropzone--overlay-opacity)
  );
  border-radius: 8px;
  transition: all 0.2s linear;
  -webkit-backdrop-filter: blur(7px);
  backdrop-filter: blur(7px);
  filter: grayscale(1%);
  opacity: 0;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.img-details h2 {
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  color: #fff;
  max-width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 400px) {
  .img-details h2 {
    max-width: 200px;
  }
}

.img-details span {
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  color: #fff;
}

.img-remove {
  background: rgba(var(--v3-dropzone--error));
  border-radius: 10px;
  border: none;
  padding: 5px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 10px;
  right: 10px;
  transition: all 0.2s linear;
}

.img-remove:active {
  transform: scale(0.9);
}

.img-remove:hover {
  background: rgba(var(--v3-dropzone--error), 0.8);
}

.progress-bar-container {
  position: absolute;
  bottom: 0;
  background-color: #666;
  border-radius: 5px;
  overflow: hidden;
  width: 100%;
  height: 10px;
}

.progress-bar {
  height: 100%;
  background-color: rgba(var(--v3-dropzone--primary));
  text-align: center;
  font-size: 10px;
  line-height: 10px;
  color: #fff;
  width: 0;
  transition: width 0.5s ease-in-out;
}
</style>
