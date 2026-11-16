
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = process.env.API_URL || env.API_URL || "";

  return {
    plugins: [react(), tailwindcss()],

    define: {
      "import.meta.env.API_URL": JSON.stringify(apiUrl),
    },
  };
});
