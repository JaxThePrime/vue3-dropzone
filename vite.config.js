import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build:{
    lib:{
      entry: path.resolve(__dirname,'src/index.js'),
      name:'Vue3Dropzone',
      fileName: (format)=> `${format}.js`
    },
    rollupOptions:{
      external:['vue'],
      globals:{
        vue:'vue'
      }
    }
  }
})
