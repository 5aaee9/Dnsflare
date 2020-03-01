# Dnsflare

可视化的修改 Cloudflare Zone 的解析地址

## TODO List
- [x] 列出 Zone 列表
- [x] 列出 Zone 下的 DNS 信息
- [x] 增删改 Zone 的 DNS 信息
- [] cloudflare/wrangler 部署成 Worker Site


## 原因
Cloudflare 非常鸡贼的 ban 掉了 `externallyManaged` 用户访问 Cloudflare 控制台编辑 DNS Record 的功能, 然后有些 Partner 又已经跑了 ~~不是~~, 但是又眼馋 pro

### 优点
所有请求由本地浏览器产生, 服务端仅进行 CORS 处理

Partner 无法直接添加 A 记录 (据说), 而且 Partner API 在开启 2FA 的情况下无法使用


## License
Open sourced under the MIT license.
