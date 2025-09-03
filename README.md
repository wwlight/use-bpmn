# use-bpmn

## 说明

- 本项目是基于 [bpmn.js](https://github.com/bpmn-io) 和 [nuxt](https://nuxt.com/) 开发演示
- 涵盖编辑器、属性面板及汉化等
- 覆盖的场景：
  - [x] 读取属性面板数据 [参考](./app/components/bpmn/container.vue#L117)
  - [x] 更新属性面板数据 [参考](./app/components/bpmn/container.vue#L143)
  - [x] 属性面板添加自定义事件 [参考](./app/components/bpmn/_extension/dblclick-event-register.js)
  - [x] 属性面板过滤属性 [参考](./app/components/bpmn/_extension/hide-properties-provider.js)
  - [ ] 属性面板添加属性
  - [ ] 自定义属性面板

## 命令

```bash
pnpm install

pnpm dev

pnpm generate
```

## 访问

| 访问地址 | 部署 | 状态 |
| :-----: | :-----: | :-----: |
| [use-bpmn.netlify.app](https://use-bpmn.netlify.app/) | [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/wwlight/use-bpmn) | [![Netlify Status](https://api.netlify.com/api/v1/badges/1f2a10e0-9894-4c25-8c54-31922c862862/deploy-status)](https://app.netlify.com/projects/wwlight-use-bpmn/deploys) |
| [use-bpmn.vercel.app](https://use-bpmn.vercel.app/) | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wwlight/use-bpmn) | - |

## 效果

![Demo preview](./public/demo-preview.png)

## 问题

- Q：bpmn 自定义扩展模块打包构建报错？
- A：由于 bpmn 构建时变量名被混淆导致，忽略混淆可查看 [`nuxt.config.ts`](./nuxt.config.ts) 中的 `vite` 相关配置。
