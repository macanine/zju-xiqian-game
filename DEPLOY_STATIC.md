# 静态站点部署

## 编译

在项目根目录运行：

```sh
pnpm install --frozen-lockfile
pnpm build
```

编译成功后，完整静态站点在 `web/dist/`。将该目录中的**全部文件和子目录**上传到静态网站托管服务的站点根目录。不要只上传 `index.html`：游戏还需要 `assets/` 和 `images/`。

项目使用浏览器端路由。托管服务需要把未知路径回退到 `/index.html`（SPA fallback），并按原路径提供静态文件。静态托管无需 Node.js 服务进程。

## 腾讯云 iWAN

在 iWAN 的静态站点/静态资源部署配置中，将站点目录指向 `web/dist/`，或把此目录的内容整体上传到站点根目录。按 iWAN 控制台要求绑定域名和配置 HTTPS。上传时保留 `assets/`、`images/` 等目录结构；部署规则应将应用路由回退到 `index.html`。

如果 iWAN 采用对象存储或 CDN 源站方式，上传 `web/dist/` 下全部内容，并将默认首页设为 `index.html`；同时配置 SPA 路由回源/重写规则和 HTTPS。

## Cloudflare Workers

仓库根目录的 `wrangler.json` 已指向 `web/dist/`。重新编译后，在 Cloudflare CLI 登录有效的环境中运行：

```sh
pnpm exec wrangler deploy
```

Cloudflare CLI 若未安装，可临时使用：

```sh
pnpm dlx wrangler login
pnpm dlx wrangler deploy
```

当前 demo 部署地址：<https://zju-xq.macacanine.workers.dev>。更新项目后重新运行构建和部署命令即可发布新版本。

部署到自有域名则需在 Cloudflare 将对应域名接入账户并配置 Worker 自定义域名。

## 发布前检查

- `web/dist/index.html`、`assets/` 与 `images/` 均存在。
- 对外发布图片前确认照片及展陈翻拍的使用授权。
- 仓库坐标数据标注为近似值；正式用于导航前应校对。
