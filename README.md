<article ><a name="user-content-readme-top"></a></p>

<div align="center">
  <h1 align="center"></a>Vue 3 dropzone component</h1>
  <p align="center">
    Customizable easy to use dropzone | <strong>Only supported for vue3</strong>
    <br>
    <br>
    <a href="https://vue-dropzone-preview.vercel.app/"><strong>Demo</strong></a>
  </p>
</div>

# About the Project

the features of this package include the following:

- Highly customizable
- Lightweight, powerful and easy to use <g-emoji class="g-emoji" alias="smile"
- Provides with image preview, multiple state like error success and disable, etc...

# Installation

- Install Yarn package

```bash
yarn add @jaxtheprime/vue3-dropzone
```

- Install NPM package

```bash
npm install @jaxtheprime/vue3-dropzone
```

## Usage

Local registration:

```jsx
<template>
    <Vue3Dropzone v-model="files"/>
</template>

<script>
    import Vue3Dropzone from "@jaxtheprime/vue3-dropzone";
    import '@jaxtheprime/vue3-dropzone/dist/style.css'

    const files = ref([])
    };
</script>
```

## Props

| Prop                    | Type              | Default   | Note                                                                  |
|-------------------------|-------------------|-----------|-----------------------------------------------------------------------|
| `modelValue`            | `Array`           | []        | 2 way binding ref                                                     |
| `multiple`              | `Boolean`         | false     | Makes dropzone accept multiple files                                  |
| `previews`              | `Array`           | []        | Preview images links (works with mode props)                          |
| `mode`                  | `string`          | drop      | Defines dropzone functionality to accept drops or just preview images |
| `disabled`              | `Boolean`         | false     | Disables the whole dropzone                                           |
| `accept`                | `String`          | undefined | Accepted type of files                                                |
| `maxFileSize`           | `Number`          | 5         | Max file size in Megabytes                                            |
| `maxFiles`              | `Number`          | 5         | Max files accepted by dropzone                                        |
| `width`                 | `Number` `String` | undefined | Dropzone container width                                              |
| `height`                | `Number` `String` | undefined | Dropzone container height                                             |
| `imgWidth`              | `Number` `String` | undefined | Preview images width                                                  |
| `imgHeight`             | `Number` `String` | undefined | Preview images height                                                 |
| `previewWrapperClasses` | `String`          | undefined | Preview images container classes                                      |
| `showSelectButton`      | `Boolean`         | true      | Select files button in the dropzone                                   |
| `selectFileStrategy`    | `String`          | 'replace' | Defines selecting file strategy (replace, merge)                      |

## Events

| Prop    | Data Type | Note                                                                              |
|---------|-----------|-----------------------------------------------------------------------------------|
| `error` | `Array`   | Emits the error event and also provides data to know which files caused the error |

## Slots

| Name              | data        |    
|-------------------|-------------|
| `button`          | `fileInput` |
| `preview`         | `data`      |
| `description`     | `undefined` |
| `placeholder-img` | `undefined` |
| `title`           | `undefined` |

## Css variables

| Name                             | Value           |    
|----------------------------------|-----------------|
| `--v3-dropzone--primary`         | `94, 112, 210`  |
| `--v3-dropzone--border`          | `214, 216, 220` |
| `--v3-dropzone--description`     | `190, 191, 195` |
| `--v3-dropzone--overlay`         | `40, 44, 53`    |
| `--v3-dropzone--overlay-opacity` | `0.3`           |
| `--v3-dropzone--error`           | `255, 76, 81`   |
| `--v3-dropzone--success`         | `36, 179, 100`  |

## Contact

Emad Moghimi [jaxtheprime@gmail.com](jaxtheprime@gmail.com)

Project Link: [https://github.com/JaxThePrime/vue3-dropzone](https://github.com/JaxThePrime/vue3-dropzone)

</article >
