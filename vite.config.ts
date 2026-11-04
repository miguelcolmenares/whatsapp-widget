import { defineConfig, Plugin, UserConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import fs from "fs";

// Load package.json to get version and CDN info
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

// The sources carry `{{package}}` and `{{url}}` where the widget needs its own name and its CDN address (the stylesheet is
// loaded from there). The Webpack build replaced them with string-replace-loader; this does the same in the Vite build.
const sourceTokens: Record<string, string> = {
  "{{package}}": packageJson.name,
  "{{url}}": packageJson.cdn,
};

const replaceSourceTokens = (): Plugin => ({
  name: "replace-source-tokens",
  enforce: "pre",
  transform(code, id) {
    if (!id.endsWith(".ts")) return null;
    let replaced = code;
    for (const [token, value] of Object.entries(sourceTokens)) replaced = replaced.split(token).join(value);
    return replaced === code ? null : { code: replaced, map: null };
  },
});

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
      replaceSourceTokens(),
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
