import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// GitHub Pages 專案頁面路徑為 https://<user>.github.io/exp-wall/,
// 因此 base 需設為 '/exp-wall/'
export default defineConfig({
  base: '/exp-wall/',
  plugins: [react()],
})
