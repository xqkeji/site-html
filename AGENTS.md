# 前端生成规范（AI 必读）

本目录是由 xq-template 生成的**纯 HTML 多页面**产品原型，构建工具为 Vite，UI **强制统一使用 Bootstrap 5** 风格。任何由 AI 生成或改写的页面 / 组件都必须遵守以下约定，否则视为不合格。

## 1. 核心规则：用 Bootstrap 5，不要手写布局 CSS
- 一切布局、间距、排版、颜色、卡片、按钮、表单、表格、提示、徽章等都**优先使用 Bootstrap 5 的 class**。
- **禁止**用自写 `<style>` 或内联 `style=` 去实现 Bootstrap 已提供的效果（栅格、margin/padding、字体颜色/粗细、圆角、阴影等）。
- 仅在极少数品牌定制（如主题色）时才写 CSS，且放进 `src/css/style.css`，用 Bootstrap 变量/工具类扩展，不另起炉灶。
- 不要引入 Tailwind / Bulma 等其它 UI 框架，也不要使用 React / Vue 等前端框架——本项目就是原生 HTML + Bootstrap。

## 2. Bootstrap 已自动注入，不要再引
- `src/js/main.js` 已经 `import 'bootstrap/html/css/bootstrap.min.css'` 和 `import * as bootstrap from 'bootstrap'`，构建时自动注入每个页面。
- 因此 **不要在 HTML 里写** `<link ... bootstrap.css>` 或 `<script ... bootstrap.bundle.js>`。
- 下拉、折叠、模态、标签页等交互组件，直接用 Bootstrap 的 `data-bs-*` 属性即可自动初始化，无需手写 JS。

## 3. 页面骨架（新增页面照抄）
```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>页面标题</title>
</head>
<body>
  <xq-include file="/partials/header.html"></xq-include>

  <main class="container py-4">
    <!-- 正文：全部用 Bootstrap class 布局 -->
  </main>

  <xq-include file="/partials/footer.html"></xq-include>

  <script type="module" src="/js/main.js"></script>
</body>
</html>
```
- 顶部导航在 `src/partials/header.html`（Bootstrap navbar，已存在），不要在页面里重复写导航。
- 页脚在 `src/partials/footer.html`，不要重复写。
- 复用公共片段用 `<xq-include file="/partials/xxx.html">`，路径以 `/` 开头时相对源码根目录（src/）。

## 4. 必须套用的 Bootstrap 写法示例
- 容器与栅格：`<main class="container py-4">`、`<div class="row g-3"><div class="col-md-6">…</div></div>`、`.container-fluid`。
- 卡片：`<div class="card shadow-sm"><div class="card-body">…</div></div>`，标题用 `.card-title`、文本用 `.card-text`。
- 按钮：`<a class="btn btn-primary">`、`<button class="btn btn-outline-secondary">`。
- 表单：`<div class="mb-3"><label class="form-label">姓名</label><input class="form-control"></div>`；栅格表单用 `.row.g-3` + `.col-*`。
- 表格：`<table class="table table-striped table-hover align-middle">`。
- 提示与徽章：`<div class="alert alert-info">`、`<span class="badge bg-success rounded-pill">`。
- 工具类：间距 `mt-4`/`py-5`、文字 `text-muted`/`fw-bold`/`text-center`、弹性 `d-flex align-items-center justify-content-between` 等。
- 主题强调色变量为 `--xq-accent`（见 `src/css/style.css`），需要自定义颜色时优先复用它。
- 想看完整可运行范例，参考 `src/pages/components/index.html`（组件陈列页，集中展示上述所有组件的写法，新增页面应优先模仿它）。

## 5. 新增一个页面三步
1. 在 `src/pages/<页面名>/index.html` 新建，套用上方骨架并用 Bootstrap 写内容。
2. 在 `vite.config.mjs` 的 `build.rollupOptions.input` 增加一条：`<页面名>: resolve(__dirname, 'src/src/pages/<页面名>/index.html')`。
3. 在 `src/partials/header.html` 导航加一项：`<li class="nav-item"><a class="nav-link" href="/src/pages/<页面名>/index.html">菜单名</a></li>`。

## 6. 禁止事项
- 禁止写 `<style>` 块做布局；禁止引入其它 CSS / JS 框架。
- 禁止在 HTML 里再引入一次 Bootstrap（已自动注入）。
- 禁止用前端框架（React/Vue 等）重写页面。

## 7. 运行与预览（AI 必读）

本项目是 Vite 多页静态站。源码 `src/*.html` **不能用浏览器直接打开**，必须经 Vite 处理才能正常显示：

- 页面通过 `<xq-include file="...">` 引入公共片段（`src/partials/doc-start.html`、`doc-end.html`、`footer.html` 等），并用 `<?=$变量?>` 占位符（由 `<xq-include ... 变量="值">` 注入标题 / 样式令牌等）。
- `xq-include` 与 `<?=$...?>` 只有在 Vite 构建 / 预览时才会被解析替换。直接双击 `src/index.html` 只会看到未替换的占位标签，且 bootstrap 等依赖不会加载，页面是「坏的」。

正确预览（任选其一）：

- 开发预览（推荐）：`npm run dev` —— 启动 Vite 开发服务器，终端输出本地地址（默认 http://localhost:5173/ ），浏览器打开该地址即可看到完整渲染的站点。
- 构建产物：`npm run build` —— 产出到仓库根的 `html/` 目录（`build.outDir='../html'`），之后可直接用浏览器打开 `html/index.html`（含 file:// 也兼容，已做相对路径处理）。

package.json 脚本一览：

| 命令 | 作用 |
|------|------|
| `npm run dev` | 启动开发服务器（预览 / 调试首选） |
| `npm run build` | 构建到 `html/` |
| `npm run build:full` | 构建并打 xq 横幅 |
| `npm run preview` | 预览 build 产物 |
| `npm run pdf` | 用 export-pdf.mjs 导出 PDF |
| `npm run typecheck` | 仅 TS 类型检查（tsc --noEmit） |

补充（与上方模板示例的差异，务必以实际项目为准）：入口脚本为 `src/ts/main.ts`（非 `src/js/main.js`），样式源为 `src/scss/style.scss`，页面直接位于 `src/` 根（如 `src/index.html`、`src/service.html`、`src/my-service.html`），公共片段为 `src/partials/doc-start.html` / `doc-end.html` / `footer.html`。bootstrap 等依赖由 `vite-plugin-xq-cp-dep` 拷到 `public/` 并由内联脚本注入，请勿在 HTML 里手引 CDN。
