import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        admin: resolve(__dirname, 'admin.html'),
        loginAdmin: resolve(__dirname, 'loginAdmin.html'),
        meny: resolve(__dirname, 'meny.html'),
        reviews: resolve(__dirname, 'reviews.html')
      }
    }
  }
})