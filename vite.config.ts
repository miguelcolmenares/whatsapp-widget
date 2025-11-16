import { defineConfig, UserConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import fs from "fs";

// Load package.json to get version and CDN info
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

// Check if we're building CSS or JS based on environment variable
const buildMode = process.env.BUILD_MODE || "js";

export default defineConfig(() => {
  if (buildMode === "css") {
    // CSS build configuration
    return {
      build: {
        lib: {
          entry: resolve(__dirname, "src/styles-entry.ts"),
          name: "styles",
          fileName: () => `${packageJson.name}-styles.js`,
          formats: ["es"],
        },
        rollupOptions: {
          output: {
            assetFileNames: `${packageJson.name}.css`,
          },
        },
        outDir: "dist/css",
        emptyOutDir: false,
        cssCodeSplit: false,
        assetsInlineLimit: 0,
      },
      css: {
        preprocessorOptions: {
          less: {
            modifyVars: {
              cdnPath: `'${packageJson.cdn}@${packageJson.version}'`,
              version: `'${packageJson.version}'`,
            },
            javascriptEnabled: true,
          },
        },
      },
      clearScreen: false,
    } as UserConfig;
  }

  // JS build configuration (default)
  return {
    build: {
      lib: {
        entry: resolve(__dirname, "src/ts/index.ts"),
        name: "whatsapp",
        fileName: () => `${packageJson.name}.js`,
        formats: ["iife"]
      },
      outDir: "dist/js",
      emptyOutDir: false,
      rollupOptions: {
        output: {
          extend: false,
        },
      },
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: false,
        },
        format: {
          comments: false,
        },
      },
    },
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: "src/fonts/*",
            dest: "../fonts"
          }
        ]
      })
    ],
    clearScreen: false,
  } as UserConfig;
});
