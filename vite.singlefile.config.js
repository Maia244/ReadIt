import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Produces one self-contained HTML file (JS + CSS inlined) that runs from
// file:// with no server — handy for sharing a clickable preview.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-single',
    emptyOutDir: true,
  },
})
