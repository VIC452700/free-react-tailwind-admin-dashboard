import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import http from "https";

// export default defineConfig({
//   server: {
//     proxy: {
//       "/test": {
//         target: "http://localhost:5000",
//         changeOrigin: true,
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
        changeOrigin: true,
        secure: false,
        ws: true,
        agent: new http.Agent(),
      },
    },
  },
  plugins: [react()],
});