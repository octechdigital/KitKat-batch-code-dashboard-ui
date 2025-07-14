import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "@svgr/rollup";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), svgr()],
    base: env.VITE_BASE_URL,
    build: {
      commonjsOptions: { transformMixedEsModules: true },
    },
  };
});
