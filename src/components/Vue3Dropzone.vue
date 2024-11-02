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
      <Preview
        v-else
        :files="files"
        :previewUrls="previewUrls"
        :multiple="multiple"
        :mode="mode"
        :imgWidth="imgWidth"
        :imgHeight="imgHeight"
        :previewWrapperClasses="previewWrapperClasses"
        @removeFile="removeFile"
      >
        <template #preview="{ data, formatSize, removeFile }">
          <slot
            name="preview"
            :data="data"
            :formatSize="formatSize"
            :removeFile="removeFile"
          ></slot>
        </template>
      </Preview>
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
import PlaceholderImage from "./PlaceholderImage.vue";
import Preview from "./Preview.vue";

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
  serverSide: {
    type: Boolean,
    default: false,
  },
  uploadEndpoint: {
    type: String,
    required(props) {
      return props.serverSide;
    },
  },
  deleteEndpoint: {
    type: String,
    required(props) {
      return props.serverSide;
    },
  },
  headers: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits([
  "drop",
  "update:modelValue",
  "error",
  "fileUploaded",
  "fileRemoved",
]);

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
    const processFile = (file) => ({
      file: file,
      id: generateFileId(),
      src: URL.createObjectURL(file),
      progress: 0,
      status: "pending",
      message: null,
    });

    if (props.selectFileStrategy === "replace") {
      files.value = allFiles.map(processFile);
    }
    if (props.selectFileStrategy === "merge") {
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

  // Upload files to server
  if (props.serverSide) {
    files.value
      .filter((fileItem) => fileItem.status !== "success")
      .forEach((fileItem) => {
        uploadFileToServer(fileItem);
      });
  }

  const generatedUrls = [];

  files.value.map((item) => {
    generatedUrls.push({
      id: item.id,
      src: URL.createObjectURL(item.file),
      name: item.file.name,
      size: item.file.size,
      type: item.file.type,
      isTypeAccepted: props.accept
        ? props.accept.includes(item.file.type)
        : undefined,
    });
  });
  previewUrls.value = generatedUrls;
};

// Upload file to server
const uploadFileToServer = (fileItem) => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", props.uploadEndpoint, true);

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
      emit("fileUploaded", { file: fileItem });
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
  if (props.serverSide) {
    removeFileFromServer(item);
  } else {
    removeFileFromList(item);
  }
};

const removeFileFromServer = (item) => {
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", `${props.deleteEndpoint}/${item.id}`, true);

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
  previewUrls.value = previewUrls.value.filter((url) => url.id !== item.id);
  files.value = files.value.filter((file) => file.id !== item.id);
  fileInput.value.value = "";
  emit("fileRemoved", item);
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

// Handles file errors
const handleFileError = (type, files) => {
  emit("error", { type: type, files: files });
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
</style>
