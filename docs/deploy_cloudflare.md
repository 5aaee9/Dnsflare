# 部署到 Cloudflare

安装 wrangler cli:

```
npm i -g wrangler
```

构建前端页面

```
corepack pnpm install --frozen-lockfile
corepack pnpm run build
```

部署页面

```
wrangler pages publish dist
```
