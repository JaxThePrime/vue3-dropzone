<template>
  <div class="dropzone">
    <div
        class="dropzone-wrapper" :style="{width,height}"
        @dragenter.prevent="toggleActive"
        @dragleave.prevent="toggleActive"
        @drop.prevent="drop"
        @dragover.prevent
        @mouseover="hover"
        @mouseleave="blur"
        :class="[{'dropzone-wrapper--active': active, 'dropzone-wrapper--disabled': disabled}, localState? `dropzone-wrapper--${localState}` : '']"
        ref="dropzoneWrapper"
        @click.self="openSelectFile"
        id="dropzoneWrapper"
    >
      <!--   Input   -->
      <input type="file" ref="fileInput" class="hidden" :id="id" :accept="accept" @input="inputFiles"
             :multiple="multiple">

      <!--   Placeholder content   -->
      <template v-if="!previewUrls.length">
        <slot name="placeholder-img">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none"
               class="transition-all decoration-neutral-150 ease-linear">
            <path opacity=".4"
                  d="M22 7.81v6.09l-1.63-1.4c-.78-.67-2.04-.67-2.82 0l-4.16 3.57c-.78.67-2.04.67-2.82 0l-.34-.28c-.71-.62-1.84-.68-2.64-.14l-4.92 3.3-.11.08c-.37-.8-.56-1.75-.56-2.84V7.81C2 4.17 4.17 2 7.81 2h8.38C19.83 2 22 4.17 22 7.81Z"
                  fill="#c3c3c3"></path>
            <path
                d="M9.001 10.381a2.38 2.38 0 1 0 0-4.76 2.38 2.38 0 0 0 0 4.76ZM21.999 13.899v2.29c0 3.64-2.17 5.81-5.81 5.81h-8.38c-2.55 0-4.39-1.07-5.25-2.97l.11-.08 4.92-3.3c.8-.54 1.93-.48 2.64.14l.34.28c.78.67 2.04.67 2.82 0l4.16-3.57c.78-.67 2.04-.67 2.82 0l1.63 1.4Z"
                fill="#c3c3c3"></path>
          </svg>
        </slot>
        <slot name="title">
          <div class="titles">
            <h1 class="m-0">Drop your files here</h1>
          </div>
        </slot>
        <slot name="button" :fileInput="fileInput">
          <button @click="fileInput?.click()" v-if="showSelectButton" class="select-file">Select File</button>
        </slot>
        <slot name="description">
          <p class="m-0 description">
            Files must be under {{ maxFileSize }}MB {{ accept.length ? `and in ${accept.join(', ')} formats` : '' }}</p>
        </slot>
      </template>

      <!--   Images previews   -->
      <template v-else>
        <div class="preview-container" :class="previewWrapperClasses">
          <slot name="preview" v-for="img in previewUrls" :data="img">
            <div class="preview"
                 :class="{'preview__multiple': multiple, 'preview__file': img && img.type && !img.type.includes('image/')}"
                 :style="{width: `${imgWidth} !important`, height: `${imgHeight} !important`}">
              <img :src="img.src" :alt="img.name" v-if="img && img.type && img.type.includes('image/')">
              <Icon :name="img.name.split('.').pop()" v-if="img && img.type && !img.type.includes('image/')"/>
              <div class="img-details" v-if="img.name || img.size">
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
    </div>
    <div class="dropzone-wrapper__disabled" @click.prevent @drop.prevent @dragover.prevent
         v-if="disabled"></div>

    <!--   Message   -->
    <Transition name="fade-in" mode="in-out">
      <p class="m-0 message" :class="localState? `message--${localState}` : ''" v-if="localMessageState">
        {{ localMessageState }}</p>
    </Transition>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref, watchEffect} from "vue";
import Icon from "./Icon.vue";

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
  if (!props.disabled && props.mode !== 'preview') {
    active.value = !active.value
  }
}

// Handles dropped files and input them
const drop = (e) => {
  toggleActive()
  if (!props.disabled && props.mode !== 'preview') {
    const files = {
      target: {
        files: [...e.dataTransfer.files]
      }
    }
    emit('drop', e)
    inputFiles(files)
  }
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

// Opens os selecting file window
const openSelectFile = (e) => {
  if (!props.disabled && props.mode === 'drop' && e.target.id === 'dropzoneWrapper') {
    fileInput.value.click()
  } else {
    e.preventDefault()
  }
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

// Updates local preview state on previews prop change
watchEffect(() => {
  if (props.previews && props.previews.length) {
    previewUrls.value = props.previews.map(item => {
      return {
        src: item,
        id: Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
      }
    })
  }
})

// Updates local message state on message prop change
watchEffect(() => {
  if (props.message) {
    localMessageState.value = props.message
  }
})

// Updates local state on state prop change
watchEffect(() => {
  if (props.state) {
    localState.value = props.state
  }
})

watchEffect(() => {
  if (files.value && files.value.length) {
    emit('update:modelValue', files.value)
  }
})

</script>

<style scoped>
* {
  font-family: sans-serif
}

.m-0 {
  margin: 0
}

.dropzone {
  --v3-dropzone--primary: 94, 112, 210;
  --v3-dropzone--border: 214, 216, 220;
  --v3-dropzone--description: 190, 191, 195;
  --v3-dropzone--overlay: 40, 44, 53;
  --v3-dropzone--overlay-opacity: .3;
  --v3-dropzone--error: 255, 76, 81;
  --v3-dropzone--success: 36, 179, 100;
  position: relative;
  display: flex;
  flex-direction: column
}

.hidden {
  display: none
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
  transition: .3s all ease;
  justify-content: center
}

.dropzone-wrapper--disabled {
  opacity: .5
}

.dropzone-wrapper__disabled {
  position: absolute;
  top: -2px;
  inset-inline-start: -2px;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  border-radius: 12px;
  background: transparent;
  z-index: 2
}

.dropzone-wrapper--active {
  border-color: rgba(var(--v3-dropzone--primary));
  background: rgba(var(--v3-dropzone--primary), .1)
}

.dropzone-wrapper--error {
  border-color: rgba(var(--v3-dropzone--error)) !important
}

.dropzone-wrapper--success {
  border-color: rgba(var(--v3-dropzone--success)) !important
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
  margin-top: 10px
}

.description {
  font-size: 12px;
  color: rgba(var(--v3-dropzone--description))
}

.titles {
  text-align: center
}

.titles h1 {
  font-weight: 400;
  font-size: 20px
}

.titles h3 {
  margin-top: 30px;
  font-weight: 400
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
  gap: 40px
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
  width: 90% !important
}

.preview__file {
  border: 1px dashed rgba(var(--v3-dropzone--primary));
}

.preview:hover .img-details {
  opacity: 1 !important;
  visibility: visible !important
}

.preview img {
  width: 100%;
  height: 100%;
  border-radius: 8px
}

.img-details {
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  width: 100%;
  height: 100%;
  background: rgba(var(--v3-dropzone--overlay), var(--v3-dropzone--overlay-opacity));
  border-radius: 8px;
  transition: all .2s linear;
  -webkit-backdrop-filter: blur(7px);
  backdrop-filter: blur(7px);
  filter: grayscale(1%);
  opacity: 0;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden
}

.img-details h2 {
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  color: #fff;
  max-width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap
}

@media (max-width: 400px) {
  .img-details h2 {
    max-width: 200px
  }
}

.img-details span {
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  color: #fff
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
  transition: all .2s linear
}

.img-remove:active {
  transform: scale(.9)
}

.img-remove:hover {
  background: rgba(var(--v3-dropzone--error), .8)
}

.message {
  margin-top: 10px !important;
  font-weight: 400;
  font-size: 14px;
  color: var(--v3-dropzone--overlay);
  transition: all .2s linear
}

.message--error {
  color: rgba(var(--v3-dropzone--error)) !important
}

.message--success {
  color: rgba(var(--v3-dropzone--success)) !important
}

.fade-in-enter-from, .fade-in-leave-to {
  opacity: 0
}

.fade-in-enter-active, .fade-in-leave-active {
  transition: all .2s linear
}
</style>