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
      <!-- Input -->
      <input
          type="file"
          ref="fileInput"
          class="hidden"
          :id="fileInputId"
          :accept="accept"
          @input="inputFiles"
          :multiple="multiple"
      />

      <!-- Placeholder content -->
      <template v-if="!unifiedItems.length || previewPosition === 'outside'">
        <slot name="placeholder-img">
          <PlaceholderImage/>
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

      <!-- Files previews inside -->
      <PreviewSlot
          v-if="previewPosition === 'inside' && unifiedItems.length"
          v-bind="previewProps"
          @removeFile="removeFile"
          @click="fileInputAllowed && openSelectFile($event)"
          @mouseover="fileInputAllowed ? hover : undefined"
          @mouseleave="fileInputAllowed ? blurDrop : undefined"
      >
        <template #preview="previewProps">
          <slot name="preview" v-bind="previewProps"></slot>
        </template>
      </PreviewSlot>
    </div>
    <div
        class="dropzone-wrapper__disabled"
        @click.prevent
        @drop.prevent
        @dragover.prevent
        v-if="disabled"
    ></div>
    <!-- Files previews outside -->
    <div class="mt-5"
         v-if="previewPosition === 'outside' && unifiedItems.length">
      <PreviewSlot 
        v-bind="previewProps" 
        @removeFile="removeFile"
        @click="fileInputAllowed && openSelectFile($event)"
        @mouseover="fileInputAllowed ? hover : undefined"
        @mouseleave="fileInputAllowed ? blurDrop : undefined"
      >
        <template #preview="previewProps">
          <slot name="preview" v-bind="previewProps"></slot>
        </template>
      </PreviewSlot>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watchEffect} from "vue";
import PlaceholderImage from "./PlaceholderImage.vue";
import PreviewSlot from "./PreviewSlot.vue";

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
      return ["drop", "preview", "edit"].includes(value);
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
    default: 'indeterminate'
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
  previewPosition: {
    type: String,
    default: "inside",
    validator: (value) => ["inside", "outside"].includes(value),
  },
  showSelectButton: {
    type: Boolean,
    default: true,
  },
  selectFileStrategy: {
    type: String,
    default: "replace",
    validator: (value) => ["replace", "merge"].includes(value),
  },
  serverSide: {
    type: Boolean,
    default: false,
  },
  uploadEndpoint: {
    type: String,
  },
  deleteEndpoint: {
    type: String,
  },
  headers: {
    type: Object,
    default: () => ({}),
  },
  allowSelectOnPreview: {
    type: Boolean,
    default: false
  }
});

// Unified data structure that combines both File objects and URL previews
const unifiedItems = computed(() => {
  const items = [];
  
  // Add preview URLs first (existing images)
  if (props.previews && props.previews.length) {
    props.previews.forEach((url, index) => {
      items.push({
        id: `preview-${index}`,
        src: url,
        type: 'url',
        isPreview: true,
        name: `Image ${index + 1}`,
        size: 0,
        progress: 100,
        status: 'success',
        message: null
      });
    });
  }
  
  // Add actual file objects
  if (files.value && files.value.length) {
    files.value.forEach(fileItem => {
      items.push({
        ...fileItem,
        type: 'file',
        isPreview: false
      });
    });
  }
  
  return items;
});

const previewProps = computed(() => ({
  files: unifiedItems.value,
  previewUrls: [], // Legacy prop, no longer used
  multiple: props.multiple,
  mode: props.mode,
  allowSelectOnPreview: props.mode !== "preview" || props.allowSelectOnPreview,
  imgWidth: props.imgWidth,
  imgHeight: props.imgHeight,
  previewWrapperClasses: props.previewWrapperClasses,
  removeFileBuiltIn: removeFile
}));

const emit = defineEmits([
  "drop",
  "update:modelValue",
  "update:previews",
  "error",
  "fileUploaded",
  "fileRemoved",
  "previewRemoved",
]);

const fileInput = ref(null);
const files = ref([]);
const active = ref(false);
const dropzoneWrapper = ref(null);
const fileInputId = computed(() => {
  if (props.fileInputId) return props.fileInputId;
  return generateFileId();
});

const fileInputAllowed = computed(() => {
  return !props.disabled && (props.mode === "drop" || (props.mode === "preview" && props.allowSelectOnPreview) || props.mode === "edit")
})

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
      !props.accept && filesSizesAreValid.every((item) => item === true)
  ) {
    const processFile = (file) => ({
      file: file,
      id: generateFileId(),
      src: URL.createObjectURL(file),
      progress: 0,
      status: "pending",
      message: null,
      name: file.name,
      size: file.size,
      type: 'file',
      isPreview: false
    });

    // Use selectFileStrategy for all modes
    const strategy = props.selectFileStrategy;

    if (strategy === "replace") {
      files.value = allFiles.map(processFile);
      // In edit mode, also clear previews if replacing
      if (props.mode === "edit") {
        emit("update:previews", []);
      }
    }
    if (strategy === "merge") {
      files.value = [...files.value, ...allFiles.map(processFile)];
    }
  }

  if (filesSizesAreValid.some((item) => item !== true)) {
    const largeFiles = allFiles.filter((item) => {
      const itemSize = (item.size / 1024 / 1024).toFixed(2);
      return itemSize > props.maxFileSize;
    });
    handleFileError("file-too-large", largeFiles);
  }

  if (props.accept && filesTypesAreValid.some((item) => item !== true)) {
    const wrongTypeFiles = allFiles.filter(
        (item) => !props.accept.includes(item.type)
    );
    handleFileError("invalid-file-format", wrongTypeFiles);
  }

  files.value
      .filter((fileItem) => fileItem.status !== "success")
      .forEach((fileItem) => {
        // Upload files to server
        if (props.serverSide) {
          uploadFileToServer(fileItem);
        } else {
          fileItem.progress = 100;
          fileItem.status = "success";
          fileItem.message = "File uploaded successfully";
          emit("fileUploaded", {file: fileItem});
        }
      });
};

// Upload file to server
const uploadFileToServer = (fileItem) => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", props.uploadEndpoint || '', true);

  // Set headers
  Object.keys(props.headers).forEach((key) => {
    xhr.setRequestHeader(key, props.headers[key]);
  });

  const formData = new FormData();
  formData.append("file", fileItem.file);

  // Start upload
  xhr.upload.onloadstart = () => {
    fileItem.status = "uploading";
    fileItem.message = "Upload in progress";
  };

  // Upload progress
  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      fileItem.progress = Math.round((event.loaded / event.total) * 100);
    }
  };

  // Upload success
  xhr.onload = () => {
    if (xhr.status === 200) {
      fileItem.status = "success";
      fileItem.message = "File uploaded successfully";
      emit("fileUploaded", {file: fileItem});
    } else {
      fileItem.status = "error";
      fileItem.message = xhr.statusText;
      handleFileError("upload-error", [fileItem.file]);
    }
  };

  // Upload error
  xhr.onerror = () => {
    fileItem.status = "error";
    fileItem.message = "Upload failed";
    handleFileError("upload-error", [fileItem.file]);
  };

  // Send file to server
  xhr.send(formData);
};

// Toggles active state for dropping files(styles)
const toggleActive = () => {
  if (fileInputAllowed.value) {
    active.value = !active.value;
  }
};

// Handles dropped files and input them
const drop = (e) => {
  toggleActive();
  if (fileInputAllowed.value) {
    const files = {
      target: {
        files: [...e.dataTransfer.files],
      },
    };
    emit("drop", e);
    inputFiles(files);
  }
};

// Enhanced removeFile to handle both types
const removeFile = (item) => {
  if (item.type === 'url' || item.isPreview) {
    // Remove from previews array
    const currentPreviews = [...props.previews];
    const previewIndex = parseInt(item.id.replace('preview-', ''));
    currentPreviews.splice(previewIndex, 1);
    emit("update:previews", currentPreviews);
    emit("previewRemoved", item);
  } else {
    // Handle file removal
    if (props.serverSide) {
      removeFileFromServer(item);
    } else {
      removeFileFromList(item);
    }
  }
};

const removeFileFromServer = (item) => {
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", props.deleteEndpoint ? `${props.deleteEndpoint}/${item.id}` : '', true);

  // Set headers
  Object.keys(props.headers).forEach((key) => {
    xhr.setRequestHeader(key, props.headers[key]);
  });

  xhr.onload = () => {
    if (xhr.status === 200) {
      removeFileFromList(item);
    } else {
      handleFileError("delete-error", [item]);
    }
  };

  xhr.onerror = () => {
    handleFileError("delete-error", [item]);
  };

  xhr.send();
};

const removeFileFromList = (item) => {
  files.value = files.value.filter((file) => file.id !== item.id);
  fileInput.value.value = "";
  emit("fileRemoved", item);
  emit("update:modelValue", files.value);
};

// Hover and blur manager
const hover = () => {
  if (fileInputAllowed.value) {
    active.value = true;
  }
};
const blurDrop = () => {
  active.value = false;
};

const testclick = () => {
  console.log('testclick');
}

// Opens os selecting file window
const openSelectFile = (e) => {
  console.log('asd');
  
  if (fileInputAllowed.value) {
    fileInput.value.click();
  } else {
    e.preventDefault();
  }
};

// Handles file errors
const handleFileError = (type, files) => {
  emit("error", {type: type, files: files});
};

watchEffect(() => {
  if (files.value && files.value.length) {
    emit("update:modelValue", files.value);
  }
});

const clearPreview = () => {
  unifiedItems.value.forEach((item) => removeFile(item));
};

// Public methods for programmatic control
const clearFiles = () => {
  files.value = [];
  emit("update:modelValue", []);
};

const clearPreviews = () => {
  emit("update:previews", []);
};

const clearAll = () => {
  clearFiles();
  clearPreviews();
};

defineExpose({
  clearPreview,
  clearFiles,
  clearPreviews,
  clearAll,
});
</script>

<style scoped>
* {
  font-family: sans-serif;
}

.m-0 {
  margin: 0;
}

.mt-5 {
  margin-top: 3rem;
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
</style>
