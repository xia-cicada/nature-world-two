import { Component, lazy } from 'solid-js'

// 预先加载所有页面的 title
const titles = import.meta.glob('./pages/*/index.tsx', {
  eager: true,
  import: 'title',
})

// 创建路由配置
const routes = Object.entries(
  import.meta.glob<{ default: Component }>('./pages/*/index.tsx')
).map(([path, loader]) => {
  const p = path.replace(/.*pages\/(.*)\/index\.tsx/, '$1').toLowerCase()

  // 获取当前路径对应的 title
  const title = titles[path] || p // 如果没有 title，使用路径名作为 fallback

  return {
    path: p,
    component: lazy(loader),
    title: typeof title === 'function' ? title() : title, // 处理 title 可能是函数的情况
  }
})

export const routesList = () => routes
