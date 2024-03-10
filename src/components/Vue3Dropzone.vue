<template>
  <div class="dropzone-wrapper">
    <slot name="placeholder-img">
    </slot>
    <slot name="title">
      <h1>Drop your files here</h1>
    </slot>
    <slot name="description">
      <p></p>
    </slot>
    <slot name="button">
      <button>Select</button>
    </slot>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: []
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
    acceptedFiles: {
      type: Array,
      default: ["png", "jpg", "jpeg"]
    },
    maxFiles: {
      type: [String, Number],
      default: 3
    },
    validate: {
      type: Boolean,
      default: false
    },
    maxFileSize: {
      type: [String, Number],
      default: 10
    },
  }

})
</script>

<style scoped>

</style>