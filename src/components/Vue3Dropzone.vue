<template>
  <div class="dropzone">
    <div
      class="dropzone-wrapper"
      :style="{ width, height }"
      @dragenter.prevent="toggleActive"
      @dragleave.prevent="toggleActive"
      @drop.prevent="drop"
      @dragover.prevent
      @mouseover="hover"
      @mouseleave="blurDrop"
      :class="[
        {
          'dropzone-wrapper--active': active,
          'dropzone-wrapper--disabled': disabled,
        },
        state ? `dropzone-wrapper--${state}` : '',
      ]"
      ref="dropzoneWrapper"
      @click.self="openSelectFile"
      id="dropzoneWrapper"
    >
      <!--   Input   -->
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        :id="fileInputId"
        :accept="accept"
        @input="inputFiles"
        :multiple="multiple"
      />

      <!--   Placeholder content   -->
      <template v-if="!previewUrls.length">
        <slot name="placeholder-img">
          <PlaceholderImage />
        </slot>
        <slot name="title">
          <div class="titles">
            <h1 class="m-0">Drop your files here</h1>
          </div>
        </slot>
        <slot name="button" :fileInput="fileInput">
          <button
            @click="fileInput?.click()"
            v-if="showSelectButton"
            class="select-file"
          >
            Select File
          </button>
        </slot>
        <slot name="description">
          <p class="m-0 description">
            Files must be under {{ maxFileSize }}MB
            {{ accept ? `and in ${accept} formats` : "" }}
          </p>
        </slot>
      </template>

      <!--   Files previews   -->
      <template v-else>
        <div
          class="preview-container"
          :class="previewWrapperClasses"
          v-if="mode === 'drop'"
        >
          <slot name="preview" v-for="file in previewUrls" :data="file">
            <div
              class="preview"
              :class="{
                preview__multiple: multiple,
                preview__file:
                  file && file.type && !file.type.includes('image/'),
              }"
              :style="{
                width: `${imgWidth} !important`,
                height: `${imgHeight} !important`,
              }"
            >
              <img
                :src="file.src"
                :alt="file.name"
                v-if="file && file.type && file.type.includes('image/')"
              />
              <Icon
                :name="file.name.split('.').pop()"
                v-if="
                  (file && file.type && !file.type.includes('image/')) ||
                  (file && file.type && !file.type.includes('video/'))
                "
              />
              <div class="img-details" v-if="file.name || file.size">
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
                <h2>{{ file.name }}</h2>
                <span>{{ formatSize(file.size) }}MB</span>
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
    </div>
    <div
      class="dropzone-wrapper__disabled"
      @click.prevent
      @drop.prevent
      @dragover.prevent
      v-if="disabled"
    ></div>
  </div>
</template>

<script setup>
import { computed, defineExpose, ref, watchEffect } from "vue";
import Icon from "./Icon.vue";
import PlaceholderImage from "./PlaceholderImage.vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: [],
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  previews: {
    type: Array,
    default: [],
  },
  mode: {
    type: String,
    default: "drop",
    validator(value) {
      return ["drop", "preview"].includes(value);
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  state: {
    type: String,
    validator(value) {
      return ["error", "success", "indeterminate"].includes(value);
    },
  },
  accept: String,
  maxFileSize: {
    type: Number,
    default: 5,
  },
  maxFiles: {
    type: Number,
    default: 5,
  },
  width: [Number, String],
  height: [Number, String],
  imgWidth: [Number, String],
  imgHeight: [Number, String],
  fileInputId: String,
  previewWrapperClasses: String,
  showSelectButton: {
    type: Boolean,
    default: true,
  },
  selectFileStrategy: {
    type: String,
    default: "replace",
  },
});
const emit = defineEmits(["drop", "update:modelValue", "error"]);

const fileInput = ref(null);
const files = ref([]);
const previewUrls = ref([]);
const active = ref(false);
const dropzoneWrapper = ref(null);
const fileInputId = computed(() => {
  if (props.fileInputId) return props.fileInputId;
  return generateFileId();
});

const generateFileId = () => {
  return Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
};

// Manages input files
const inputFiles = (e) => {
  const allFiles = [...e.target.files].slice(0, props.maxFiles);
  const filesSizesAreValid = allFiles.map((item) => {
    const itemSize = (item.size / 1024 / 1024).toFixed(2);
    return itemSize <= props.maxFileSize;
  });

  const filesTypesAreValid = allFiles.map((item) => {
    if (props.accept) {
      return props.accept.includes(item.type);
    }
    return [];
  });

  if (
    (filesSizesAreValid.every((item) => item === true) &&
      props.accept &&
      filesTypesAreValid.every((item) => item === true)) ||
    filesSizesAreValid.every((item) => item === true)
  ) {
    if (props.selectFileStrategy === "replace") {
      files.value = allFiles.map((item) => {
        return {
          file: item,
          id: generateFileId(),
        };
      });
    }
    if (props.selectFileStrategy === "merge") {
      files.value = [
        ...files.value,
        ...allFiles.map((item) => {
          return {
            file: item,
            id: generateFileId(),
          };
        }),
      ];
    }
  }

  if (filesSizesAreValid.some((item) => item !== true)) {
    const largeFiles = allFiles.filter((item) => {
      const itemSize = (item.size / 1024 / 1024).toFixed(2);
      return itemSize > props.maxFileSize;
    });
    emit("error", largeFiles);
  }

  if (props.accept && filesTypesAreValid.some((item) => item !== true)) {
    const wrongTypeFiles = allFiles.filter(
      (item) => !props.accept.includes(item.type)
    );
    emit("error", wrongTypeFiles);
  }

  const generatedUrls = [];

  files.value.map((item) => {
    generatedUrls.push({
      src: URL.createObjectURL(item.file),
      name: item.file.name,
      size: item.file.size,
      type: item.file.type,
      isTypeAccepted: props.accept
        ? props.accept.includes(item.file.type)
        : undefined,
      id: item.id,
    });
  });
  previewUrls.value = generatedUrls;
};

// Formats file size
const formatSize = (size) => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 + " " + ["B", "KB", "MB", "GB"][i]
  );
};

// Toggles active state for dropping files(styles)
const toggleActive = () => {
  if (!props.disabled && props.mode !== "preview") {
    active.value = !active.value;
  }
};

// Handles dropped files and input them
const drop = (e) => {
  toggleActive();
  if (!props.disabled && props.mode !== "preview") {
    const files = {
      target: {
        files: [...e.dataTransfer.files],
      },
    };
    emit("drop", e);
    inputFiles(files);
  }
};

// Removes file from files list
const removeFile = (item) => {
  previewUrls.value = previewUrls.value.filter((url) => url.id !== item.id);
  files.value = files.value.filter((file) => file.id !== item.id);
  fileInput.value.value = "";
  emit("update:modelValue", files.value);
};

// Hover and blur manager
const hover = () => {
  if (!files.value.length && props.state === "indeterminate") {
    active.value = true;
  }
};
const blurDrop = () => {
  active.value = false;
};

// Opens os selecting file window
const openSelectFile = (e) => {
  if (
    !props.disabled &&
    props.mode === "drop" &&
    e.target.id === "dropzoneWrapper"
  ) {
    fileInput.value.click();
  } else {
    e.preventDefault();
  }
};

// Updates local preview state on previews prop change
watchEffect(() => {
  if (props.previews && props.previews.length) {
    previewUrls.value = props.previews.map((item) => {
      return {
        src: item,
        id: generateFileId(),
      };
    });
  }
});

watchEffect(() => {
  if (files.value && files.value.length) {
    emit("update:modelValue", files.value);
  }
});

const clearPreview = () => {
  previewUrls.value.forEach((file) => removeFile(file));
};

defineExpose({
  clearPreview,
});
</script>

<style scoped>
* {
  font-family: sans-serif;
}

.m-0 {
  margin: 0;
}

.dropzone {
  --v3-dropzone--primary: 94, 112, 210;
  --v3-dropzone--border: 214, 216, 220;
  --v3-dropzone--description: 190, 191, 195;
  --v3-dropzone--overlay: 40, 44, 53;
  --v3-dropzone--overlay-opacity: 0.3;
  --v3-dropzone--error: 255, 76, 81;
  --v3-dropzone--success: 36, 179, 100;
  position: relative;
  display: flex;
  flex-direction: column;
}

.hidden {
  display: none;
}

.dropzone-wrapper {
  border: 2px dashed rgba(var(--v3-dropzone--border));
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
  height: 200px;
  transition: 0.3s all ease;
  justify-content: center;
}

.dropzone-wrapper--disabled {
  opacity: 0.5;
}

.dropzone-wrapper__disabled {
  position: absolute;
  top: -2px;
  inset-inline-start: -2px;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  border-radius: 12px;
  background: transparent;
  z-index: 2;
}

.dropzone-wrapper--active {
  border-color: rgba(var(--v3-dropzone--primary)) !important;
  background: rgba(var(--v3-dropzone--primary), 0.1) !important;
}

.dropzone-wrapper--error {
  border-color: rgba(var(--v3-dropzone--error)) !important;
}

.dropzone-wrapper--success {
  border-color: rgba(var(--v3-dropzone--success)) !important;
}

.select-file {
  background: rgba(var(--v3-dropzone--primary));
  border-radius: 10px;
  font-weight: 500;
  font-size: 12px;
  border: none;
  padding: 10px 20px;
  color: #fff;
  cursor: pointer;
  margin-bottom: 10px;
  margin-top: 10px;
}

.description {
  font-size: 12px;
  color: rgba(var(--v3-dropzone--description));
}

.titles {
  text-align: center;
}

.titles h1 {
  font-weight: 400;
  font-size: 20px;
}

.titles h3 {
  margin-top: 30px;
  font-weight: 400;
}

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
</style>
