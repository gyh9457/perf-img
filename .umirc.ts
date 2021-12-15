// @ts-nocheck
import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'all',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/bg', component: '@/pages/bg' },
  ],
  webpack5: {},
  targets: {
    ie: 11,
  },
  inlineLimit: 0, // 禁用图片内联
  extraPostCSSPlugins: [require('./postcss/postcss-webp.js')],
});
