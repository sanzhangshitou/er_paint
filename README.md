# 🎨 儿童涂色乐园

一个专为儿童设计的在线涂色应用，使用 Vue 3 构建。孩子们可以选择喜欢的动物线稿，用蜡笔风格的颜色自由涂色，并保存自己的作品。

**在线体验**: [https://sanzhangshitou.github.io/er_paint/](https://sanzhangshitou.github.io/er_paint/)

## 功能特点

- 🖼️ **丰富的线稿库** - 包含 12 种生肖动物和 6 种恐龙线稿
- 🎨 **蜡笔色调** - 12 种精心挑选的儿童友好颜色
- ✏️ **画笔工具** - 支持三种粗细调节
- 🧹 **橡皮擦** - 方便修正涂色
- 💾 **保存作品** - 一键下载涂色完成的图片
- 📱 **移动端适配** - 首页可滚动浏览，画室页面强制横屏，更适合绘画操作
- 🌈 **温馨界面** - 手绘风格 UI，纸张质感背景

## 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite 8
- **状态管理**: Pinia 3
- **路由**: Vue Router 5
- **测试**: Vitest
- **代码规范**: ESLint + oxlint + Prettier
- **部署**: GitHub Actions + GitHub Pages

## 快速开始

### 环境要求

- Node.js `^20.19.0` 或 `>=22.12.0`

### 安装依赖

```sh
npm install
```

### 开发模式

```sh
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 生产构建

```sh
npm run build
```

构建产物输出到 `dist/` 目录。

### 预览生产版本

```sh
npm run preview
```

### 文档构建

```sh
npm run docs
```

构建产物输出到 `docs/` 目录。

## 项目结构

```text
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 自动部署配置
├── .vscode/                    # VS Code 配置
├── public/
│   ├── 404.html                # SPA 路由 404 重定向处理
│   └── favicon.ico             # 网站图标
├── src/
│   ├── components/
│   │   └── DrawingCanvas.vue   # 绘图画布组件
│   ├── router/
│   │   └── index.ts            # 路由配置
│   ├── static/
│   │   ├── config.json         # 线稿配置文件
│   │   ├── favicon.ico         # 图标源文件
│   │   └── images/             # 线稿图片资源
│   ├── stores/
│   │   └ paint.ts              # Pinia 状态管理
│   ├── views/
│   │   ├── HomeView.vue        # 首页（线稿画廊）
│   │   └── StudioView.vue      # 画室页面
│   ├── style.css               # 全局样式
│   ├── App.vue
│   └── main.ts
├── .nvmrc                      # Node.js 版本声明
├── index.html                  # 入口 HTML
├── package.json
├── tsconfig.json
└── vite.config.ts              # Vite 配置（含 base URL）
```

## 添加更多线稿

编辑 `src/static/config.json` 文件，添加新的线稿配置：

```json
{
  "list": [
    {
      "id": "unique-id",
      "name": "动物名称",
      "path": "./images/your-image.png"
    }
  ]
}
```

然后将对应的 PNG 图片放入 `src/static/images/` 目录。

线稿图片建议：

- 使用透明背景 PNG 格式
- 线条清晰，适合儿童涂色
- 图片尺寸保持一致

## 部署说明

项目使用 GitHub Actions 自动部署到 GitHub Pages。

### 自动部署流程

1. 推送代码到 `master` 分支
2. GitHub Actions 自动执行：
   - 安装依赖 (`npm install`)
   - 构建项目 (`npm run build`)
   - 部署 `dist/` 目录到 GitHub Pages

### 手动触发部署

在 GitHub 仓库页面，进入 **Actions** → **Deploy to GitHub Pages** → **Run workflow**。

### 配置 GitHub Pages

1. 进入仓库 **Settings** → **Pages**
2. **Source** 选择 **GitHub Actions**
3. 部署完成后访问 `https://<username>.github.io/<repo-name>/`

## 开发推荐

### IDE 设置

[VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 扩展。

### 运行测试

```sh
npm run test:unit
```

### 代码检查

```sh
npm run lint
```

### 格式化代码

```sh
npm run format
```

## 移动端体验

- **首页**: 保持竖屏显示，可上下滚动浏览所有线稿
- **画室**: 自动切换为横屏模式，更大的绘画空间

## License

MIT
