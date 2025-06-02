# Vue3 Dropzone

A flexible Vue 3 dropzone component with unified preview and edit capabilities. Perfect for file uploads, image
galleries, and product management interfaces.
<a href="https://vue-dropzone-preview.vercel.app/"><strong>Demo</strong></a>

## 🎯 Key Features

### **Unified Data Handling**

- **Multiple Data Sources**: Combines File objects (new uploads) with URL strings (existing files)
- **Smart Type Detection**: Automatically handles different file types and sources
- **Two-Way Binding**: Reactive updates for both new files and existing previews

### **Three Flexible Modes**

- **Drop Mode**: Standard dropzone for new file selection
- **Preview Mode**: Display existing files with optional interaction
- **Edit Mode**: Combined functionality - show existing files AND allow modifications

### **File Management**

- **Drag & Drop Support**: Native HTML5 drag and drop with visual feedback
- **File Validation**: Size limits, type restrictions, and custom validation
- **Progress Tracking**: Built-in upload progress with server-side support
- **Error Handling**: Comprehensive error states and user feedback

### **Layout Options**

- **Preview Positioning**: Display previews inside or outside the dropzone
- **Responsive Design**: Adapts to different screen sizes and containers
- **Customizable Styling**: CSS variables for easy theming
- **Slot Support**: Override any part of the interface

## 📋 Props Reference

### **Core Configuration**

| Prop         | Type      | Default  | Description                                                                                                        |
|--------------|-----------|----------|--------------------------------------------------------------------------------------------------------------------|
| `modelValue` | `Array`   | `[]`     | Array of File objects representing newly selected files. Two-way binding with v-model.                             |
| `previews`   | `Array`   | `[]`     | Array of URL strings for existing files/images. Two-way binding with v-model:previews.                             |
| `mode`       | `String`  | `"drop"` | Component behavior mode: `"drop"` (new files only), `"preview"` (display only), `"edit"` (combined functionality). |
| `multiple`   | `Boolean` | `false`  | Allow selection of multiple files simultaneously.                                                                  |
| `disabled`   | `Boolean` | `false`  | Completely disable all interactions with the dropzone.                                                             |

### **File Selection & Strategy**

| Prop                   | Type      | Default     | Description                                                                                                                                                                                                                                             |
|------------------------|-----------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `selectFileStrategy`   | `String`  | `"replace"` | How new files interact with existing ones: `"replace"` (clear existing), `"merge"` (add to existing).                                                                                                                                                   |
| `allowSelectOnPreview` | `Boolean` | `false`     | Allow file selection in preview mode. When true, clicking on empty areas in the preview container triggers file selection, while clicks on images and preview items are prevented to avoid accidental selection. When false, preview mode is read-only. |
| `maxFiles`             | `Number`  | `5`         | Maximum number of files that can be selected at once.                                                                                                                                                                                                   |
| `maxFileSize`          | `Number`  | `5`         | Maximum file size allowed in megabytes (MB).                                                                                                                                                                                                            |
| `accept`               | `String`  | `undefined` | Comma-separated list of allowed file types (MIME types). Example: "image/*,application/pdf".                                                                                                                                                            |

### **Visual Layout & Positioning**

| Prop                    | Type            | Default    | Description                                                                                 |
|-------------------------|-----------------|------------|---------------------------------------------------------------------------------------------|
| `width`                 | `Number/String` | `auto`     | Width of the dropzone container. Can be px, %, or any CSS unit.                             |
| `height`                | `Number/String` | `200px`    | Height of the dropzone container. Can be px, %, or any CSS unit.                            |
| `previewPosition`       | `String`        | `"inside"` | Where to display file previews: `"inside"` (within dropzone), `"outside"` (below dropzone). |
| `imgWidth`              | `Number/String` | `auto`     | Width of individual preview images.                                                         |
| `imgHeight`             | `Number/String` | `auto`     | Height of individual preview images.                                                        |
| `previewWrapperClasses` | `String`        | `""`       | Additional CSS classes to apply to the preview container.                                   |

### **User Interface Elements**

| Prop               | Type      | Default           | Description                                                                                     |
|--------------------|-----------|-------------------|-------------------------------------------------------------------------------------------------|
| `showSelectButton` | `Boolean` | `true`            | Display the "Select File" button within the dropzone interface.                                 |
| `fileInputId`      | `String`  | `auto-generated`  | Custom ID for the hidden file input element. Auto-generated if not provided.                    |
| `state`            | `String`  | `"indeterminate"` | Visual state of the dropzone: `"indeterminate"`, `"success"`, `"error"`. Affects border colors. |

### **Server Integration**

| Prop             | Type      | Default     | Description                                                          |
|------------------|-----------|-------------|----------------------------------------------------------------------|
| `serverSide`     | `Boolean` | `false`     | Enable server-side file upload functionality with progress tracking. |
| `uploadEndpoint` | `String`  | `undefined` | URL endpoint for file uploads when serverSide is enabled.            |
| `deleteEndpoint` | `String`  | `undefined` | URL endpoint for file deletion when serverSide is enabled.           |
| `headers`        | `Object`  | `{}`        | Additional HTTP headers to send with server requests.                |

## 🔄 Events Reference

| Event               | Payload  | Description                                                                     |
|---------------------|----------|---------------------------------------------------------------------------------|
| `update:modelValue` | `Array`  | Emitted when the files array changes. Contains File objects.                    |
| `update:previews`   | `Array`  | Emitted when the previews array changes. Contains URL strings.                  |
| `drop`              | `Event`  | Emitted when files are dropped onto the dropzone.                               |
| `fileUploaded`      | `Object` | Emitted when a file successfully uploads (server-side mode).                    |
| `fileRemoved`       | `Object` | Emitted when a File object is removed from the list.                            |
| `previewRemoved`    | `Object` | Emitted when a preview URL is removed from the list.                            |
| `error`             | `Object` | Emitted on validation errors or upload failures. Contains error type and files. |

## 🎨 Styling & Customization

### **CSS Variables**

The component uses CSS custom properties for easy theming:

| Variable                         | Default         | Purpose                               |
|----------------------------------|-----------------|---------------------------------------|
| `--v3-dropzone--primary`         | `94, 112, 210`  | Primary color (RGB values)            |
| `--v3-dropzone--border`          | `214, 216, 220` | Border color (RGB values)             |
| `--v3-dropzone--description`     | `190, 191, 195` | Description text color (RGB values)   |
| `--v3-dropzone--error`           | `255, 76, 81`   | Error state color (RGB values)        |
| `--v3-dropzone--success`         | `36, 179, 100`  | Success state color (RGB values)      |
| `--v3-dropzone--overlay`         | `40, 44, 53`    | Overlay background color (RGB values) |
| `--v3-dropzone--overlay-opacity` | `0.3`           | Overlay opacity value                 |

### **Slot Support**

Override default content with custom implementations:

| Slot              | Purpose                                           |
|-------------------|---------------------------------------------------|
| `placeholder-img` | Replace the default placeholder image             |
| `title`           | Replace the default "Drop your files here" title  |
| `button`          | Replace the default "Select File" button          |
| `description`     | Replace the default file requirements description |
| `preview`         | Custom preview item rendering                     |

## 🔧 Component Methods

Access these methods via template ref:

| Method            | Parameters | Description                               |
|-------------------|------------|-------------------------------------------|
| `clearFiles()`    | None       | Remove all File objects (new uploads)     |
| `clearPreviews()` | None       | Remove all preview URLs (existing files)  |
| `clearAll()`      | None       | Remove both files and previews completely |
| `clearPreview()`  | None       | Legacy method - equivalent to clearAll()  |

## 🎯 Use Cases

### **Product Management**

Perfect for e-commerce platforms where users need to manage product images - showing existing images while allowing
additions, removals, and replacements.

### **Profile/Avatar Updates**

Ideal for user profile interfaces where you display current profile pictures and allow users to upload new ones.

### **Document Management**

Great for document upload interfaces where users can see existing documents and add new ones.

### **Gallery Applications**

Excellent for photo gallery management where users can view existing images and upload additional ones.

### **Content Management Systems**

Perfect for CMS interfaces where content creators need to manage media files alongside text content.

### **General Media Management Admin Panels**

Ideal for administrative interfaces across various platforms where administrators need to manage user-uploaded content,
system assets, or shared media libraries. Works well for social platforms, educational systems, corporate portals, and
any application requiring centralized media administration.

## 🚀 Features

### **File Handling**

- Automatically detects file types and displays appropriate previews
- Handles both image files (with thumbnails) and other file types (with icons)
- Maintains file metadata and upload status

### **Interaction Models**

- Read-only preview mode for display purposes
- Interactive preview mode for file management
- Combined edit mode for comprehensive file management
- Smart click handling:
    - Click on empty preview container areas to select new files
    - Click prevention on images and preview items to avoid accidental file selection
    - Dedicated remove buttons for each preview item

### **Responsive Design**

- Adapts to container sizes automatically
- Supports both fixed and flexible dimensions
- Mobile-friendly touch interactions

### **Error Prevention**

- File size validation before upload
- File type validation against accepted formats
- Clear error messaging for user guidance

This component provides a complete solution for file management interfaces with the flexibility to adapt to various use
cases and design requirements.
