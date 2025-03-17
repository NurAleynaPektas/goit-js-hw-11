import { defineConfig } from "vite";

export default defineConfig({
  root: "src", // Vite'nin proje kök dizini olarak 'src' klasörünü kullanmasını sağlar
  server: {
    port: 5173,
  },
  build: {
    outDir: "../dist", // Çıktıyı proje kökünde 'dist' klasörüne alır
  },
});
