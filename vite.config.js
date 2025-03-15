// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 必须配置的黄金三件套 👇
export default defineConfig({
  plugins: [react()],
  
  // 🔥 核心配置：base路径必须与仓库名一致！
  base: "/Class/",  // 注意斜杠开头结尾，严格对应 https://laneyxmax.github.io/Class/

  // 🛠️ 构建配置：保持默认即可
  build: {
    outDir: "dist",         // 构建输出目录（必须叫dist）
    assetsDir: "assets",    // 静态资源目录
    emptyOutDir: true,      // 构建前清空目录
    sourcemap: false        // 关闭sourcemap（避免暴露源码）
  },

  // 🚀 开发服务器配置（本地调试用）
  server: {
    port: 3000,
    open: true // 自动打开浏览器
  }
})