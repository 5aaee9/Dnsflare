# Dnsflare

可视化的修改 Cloudflare Zone 的解析地址


## 原因
Cloudflare 非常鸡贼的 ban 掉了 `externallyManaged` 用户访问 Cloudflare 控制台编辑 DNS Record 的功能, 然后有些 Partner 又已经跑了 ~~不是~~, 但是又眼馋 pro

### 优点
所有请求由本地浏览器产生, 服务端仅进行 CORS 处理

Partner 无法直接添加 A 记录 (据说), 而且 Partner API 在开启 2FA 的情况下无法使用

## 使用
到 [Cloudflare 的 API Token 设定](https://dash.cloudflare.com/profile/api-tokens) 中新建一个 Token, 给这个 Token 以下权限

- Zone.DNS 写权限 (用于写入 DNS 记录)
- Zone.Zone 读权限 (用于读取域名列表)

- Zone.SSL and Certificates 读写权限 (用于展示和修改 SSL 证书供应商)

然后访问 [Example](https://dnsflare-indexyz.vercel.app) 来登录到面板

## 部署
[使用 Cloudflare Pages 部署](docs/deploy_cloudflare.md)

## License
Open sourced under the MIT license.
