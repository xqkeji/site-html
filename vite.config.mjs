import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import xqInclude from 'vite-plugin-xq-include'
import xqMultiInput from 'vite-plugin-xq-multi-input'
import xqCpDep from 'vite-plugin-xq-cp-dep'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  // 源码根目录（vite-plugin-xq-multi-input 内部用 path.join(process.cwd(), root) 拼接，
  // 因此 root 必须是相对路径；设为 'src' 即把 src/ 作为源码根，html/ 产物生成在 src 同级）
  root: 'src',
  // 静态资源目录：放在项目根（src 的同级）。vite-plugin-xq-cp-dep 会把 package.json 的
  // dependencies（bootstrap / bootstrap-icons / xq-util）按原目录结构拷贝到此处，
  // 页面通过相对路径直接引用（顶层页 bootstrap/...，doc 页 ../bootstrap/...）。
  // 插件内部读取的是 Vite 解析后的 config.publicDir，因此 public 可以放在 src 同级。
  publicDir: '../public',
  // 相对路径，方便构建产物直接以 file:// 打开 / 导出 PDF
  base: './',
  // 开发/预览时自动打开浏览器（默认打开首页 /，多页应用可改成具体页面如 '/doc/index.html'）
  server: {
    open: true,
  },
  plugins: [
    xqInclude(),
    xqMultiInput(),
    xqCpDep(),
  ],
  build: {
    outDir: '../html',
    emptyOutDir: true,
    rollupOptions: {
      // 每个目录只列一个入口，vite-plugin-xq-multi-input 会自动发现同目录其余 .html
      input: {
        "index": resolve(__dirname, "src/index.html"),
        "doc/index": resolve(__dirname, "src/doc/index.html"),
      },
    },
  },
})
