import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// export default defineConfig({
//   server: {
//     proxy: {
//       "/test": {
//         target: "http://localhost:5000",
//         secure: false,
//       },
//     },
//   },
//   plugins: [react()],
// });

export default defineConfig({
  server: {
    proxy: {
      "/test": {
        target: "https://defivaultservice.onrender.com",
        secure: false,
      },
    },
  },
  plugins: [react()],
});