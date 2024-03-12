<template>
  <div>
    <label
        class="dropzone-wrapper" :for="id" :style="{width,height}"
        @dragenter.prevent="toggleActive"
        @dragleave.prevent="toggleActive"
        @drop.prevent="drop"
        @dragover.prevent
        @mouseover="hover"
        @mouseleave="blur"
        :class="[{'dropzone-wrapper--active': active}, localState? `dropzone-wrapper--${localState}` : '']"
        ref="dropzoneWrapper"
    >
      <!--   Input   -->
      <input type="file" ref="fileInput" class="hidden" :id="id" :accept="accept" @input="inputFiles"
             :multiple="multiple">

      <!--   Placeholder content   -->
      <template v-if="!previewUrls.length">
        <slot name="placeholder-img">
          <div class="image-placeholder">
            <img src="/image-placeholder.svg" alt="image-placeholder">
          </div>
        </slot>
        <slot name="title">
          <div class="titles">
            <h1 class="m-0">Drop your files here</h1>
          </div>
        </slot>
        <slot name="button">
          <button @click="fileInput?.click()" v-if="showSelectButton" class="select-file">Select File</button>
        </slot>
        <slot name="description">
          <p class="m-0 description">
            Files must be under {{ maxFileSize }}MB and in {{ accept.length ? accept.join(', ') : '' }}
            formats</p>
        </slot>
      </template>

      <!--   Images previews   -->
      <template v-else>
        <div class="preview-container" :class="previewWrapperClasses">
          <slot name="preview" v-for="img in previewUrls" :img="img">
            <div v-for="img in previewUrls" class="preview" :class="{'preview--multiple': multiple}">
              <img :src="img.src" :alt="img.name"
                   :style="{width: `${imgWidth} !important`, height: `${imgHeight} !important`}">
              <div class="img-details"
                   :style="{width: `${imgWidth} !important`, height: `${imgHeight} !important`}"
              >
                <button class="img-remove" @click="removeImg(img)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                       class="icon icon-tabler icons-tabler-outline icon-tabler-x">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M18 6l-12 12"/>
                    <path d="M6 6l12 12"/>
                  </svg>
                </button>
                <h2>{{ img.name }}</h2>
                <span>{{ (img.size / 1024 / 1024).toFixed(2) }}MB</span>
              </div>
            </div>
          </slot>
        </div>
      </template>
    </label>

    <!--   Message   -->
    <Transition name="fade-in" mode="in-out">
      <p class="m-0 message" :class="localState? `message--${localState}` : ''" v-if="localMessageState">
        {{ localMessageState }}</p>
    </Transition>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: []
  },
  multiple: {
    type: Boolean,
    default: false
  },
  previews: {
    type: Array,
    default: []
  },
  mode: {
    type: String,
    default: 'drop',
    validator(value) {
      return ["drop", "preview"].includes(value);
    },
  },
  disabled: {
    type: Boolean,
    default: false
  },
  state: {
    type: String,
    validator(value) {
      return ["error", "success", 'warning', 'indeterminate'].includes(value);
    },
  },
  acceptedFiles: {
    type: Array,
    default: ["png", "jpg", "jpeg"]
  },
  accept: {
    type: Array,
    default: []
  },
  maxFileSize: {
    type: Number,
    default: 5
  },
  maxFiles: {
    type: Number,
    default: 5
  },
  width: [Number, String],
  height: [Number, String],
  imgWidth: [Number, String],
  imgHeight: [Number, String],
  previewWrapperClasses: String,
  blurOnClickOutside: {
    type: Boolean,
    default: true,
  },
  showSelectButton: {
    type: Boolean,
    default: true
  },
  message: String
})
const emit = defineEmits(['drop', 'update:modelValue'])

const fileInput = ref(null)
const files = ref([])
const previewUrls = ref([])
const active = ref(false)
const localMessageState = ref(props.message)
const localState = ref(props.state)
const dropzoneWrapper = ref(null)
const id = computed(() => {
  if (props.id) return id;
  return Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
})

// Updates local preview state on previews prop change
watch(() => props.previews, (val) => {
  if (val.length) {
    previewUrls.value = val
  }
})

// Updates local message state on message prop change
watch(() => props.message, (val) => {
  if (val.length) {
    localMessageState.value = val
  }
})

// Updates local state on state prop change
watch(() => props.state, (val) => {
  if (val) {
    localState.value = val
  }
})

watch(() => files.value, (val) => {
  if (val.length) {
    emit('update:modelValue', val)
  }
})


// Manages input files
const inputFiles = (e) => {
  const allFiles = [...e.target.files].slice(0, props.maxFiles);
  const filesAreValid = allFiles.map(item => {
    const itemSize = (item.size / 1024 / 1024).toFixed(2)
    return itemSize <= props.maxFileSize
  })

  if (filesAreValid.every(item => item === true)) {
    files.value = allFiles.map(item => {
      return {
        file: item,
        id: Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
      }
    })
  } else {
    localState.value = 'error'
    localMessageState.value = props.multiple ? `Files are too large, maximum file size is ${props.maxFileSize}MB`
        : `File is too large, maximum file size is ${props.maxFileSize}MB`
  }

  const generatedUrls = []

  files.value.map((item) => {
    generatedUrls.push({
      src: URL.createObjectURL(item.file),
      name: item.file.name,
      size: item.file.size,
      type: item.file.type,
      id: item.id
    })
  })
  previewUrls.value = generatedUrls;
}

// Toggles active state for dropping files(styles)
const toggleActive = () => {
  active.value = !active.value
}

// Handles dropped files and input them
const drop = (e) => {
  toggleActive()
  const files = {
    target: {
      files: [...e.dataTransfer.files]
    }
  }
  emit('drop', e)
  inputFiles(files)
}

// Removes img from files list
const removeImg = (item) => {
  previewUrls.value = previewUrls.value.filter(url => url.id !== item.id)
  files.value = files.value.filter(file => file.id !== item.id)
}

// Hover and blur manager
const hover = () => {
  if (!files.value.length && props.state === 'indeterminate') {
    active.value = true
  }
}
const blur = () => {
  active.value = false
}

// Click outside blur for clearing error state
const useDetectOutsideClick = (component, callback) => {
  if (!component) return
  const listener = (event) => {
    if (event.target !== component.value && event.composedPath().includes(component.value)) {
      return
    }
    if (typeof callback === 'function') {
      callback()
    }
  }
  onMounted(() => {
    window.addEventListener('click', listener)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('click', listener)
  })

  return {listener}
}
useDetectOutsideClick(dropzoneWrapper, () => {
  if (props.blurOnClickOutside) {
    localState.value = 'indeterminate'
    localMessageState.value = ''
  }
})
</script>

<style scoped lang="scss">
.hidden {
  display: none;
}

.dropzone-wrapper {
  border: 2px dashed var(--v3-dropzone--border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  height: 200px;
  transition: .3s all ease;
  justify-content: space-between;

  &--active {
    border-color: rgba(var(--v3-dropzone--primary));
    background: rgba(var(--v3-dropzone--primary), 0.1);
  }

  &--error {
    border-color: rgba(var(--v3-dropzone--error)) !important;
  }

  &--success {
    border-color: rgba(var(--v3-dropzone--success)) !important;
  }
}

.select-file {
  background: rgba(var(--v3-dropzone--primary));
  border-radius: 10px;
  font-weight: 500;
  font-size: 12px;
  border: none;
  padding: 10px 20px;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
}

.description {
  font-size: 12px;
  color: var(--v3-dropzone--description);
}

.titles {
  text-align: center;

  h1 {
    font-weight: 400;
    font-size: 20px;
  }

  h3 {
    margin-top: 30px;
    font-weight: 400;
  }
}

.preview-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.preview {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  flex-shrink: 0;
  position: relative;

  &--multiple {
    height: 90% !important;
    width: 90% !important;
  }

  &:hover {
    .img-details {
      opacity: 1 !important;
      visibility: visible !important;
    }
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }

}

.img-details {
  position: absolute;
  width: 100%;
  height: 100%;
  inset-inline-start: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(var(--v3-dropzone--overlay), var(--v3-dropzone-overlay--opacity));
  border-radius: 8px;
  transition: all 0.2s linear;
  backdrop-filter: blur(4px);
  filter: grayscale(1%);
  opacity: 0;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    color: white;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    @media (max-width: 400px) {
      max-width: 200px;
    }
  }

  span {
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    color: white;
  }
}

.img-remove {
  background: rgba(var(--v3-dropzone--error));
  border-radius: 10px;
  border: none;
  padding: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 20px;
  right: 20px;
  transition: all .2s linear;

  &:active {
    transform: scale(0.9);
  }

  &:hover {
    background: rgba(var(--v3-dropzone--error), .8);
  }
}

.message {
  margin-top: 10px !important;
  font-weight: 400;
  font-size: 14px;
  color: var(--v3-dropzone--overlay);
  transition: all 0.2s linear;


  &--error {
    color: rgba(var(--v3-dropzone--error)) !important;
  }

  &--success {
    color: rgba(var(--v3-dropzone--success)) !important;
  }
}

.image-placeholder {
  background: rgba(var(--v3-dropzone--overlay), .01);
  padding: 5px;
  border-radius: 8px;
}

.fade-in-enter-from {
  opacity: 0;
}

.fade-in-leave-to {
  opacity: 0;
}

.fade-in-enter-active,
.fade-in-leave-active {
  transition: all 0.2s linear;
}
</style>