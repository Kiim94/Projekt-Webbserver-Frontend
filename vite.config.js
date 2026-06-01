import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        adminMeny: resolve(__dirname, 'adminMeny.html'),
        loginAdmin: resolve(__dirname, 'loginAdmin.html'),
        meny: resolve(__dirname, 'meny.html'),
        reviews: resolve(__dirname, 'reviews.html'),
        handleAdmin: resolve(__dirname, 'admin.html'),
      }
    }
  }
})