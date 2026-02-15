# FoMON3D 前端

赛博朋克霓虹风格 Demo：Next.js + Tailwind + wagmi/viem，与链上合约交互。

## 要求

- Node.js >= 20
- 已部署合约并在 `lib/contracts.ts` 中配置当前链的合约地址

## 安装与运行

```bash
npm install
npm run dev
```

打开 http://localhost:3000 ，连接钱包（需切到与 `contracts.ts` 中地址对应的网络，如本地 Anvil 31337）。

## 合约地址

本地 Anvil 部署后，默认已写入 `lib/contracts.ts` 的 31337。其它网络需在 `lib/contracts.ts` 的 `addresses` 中按 chainId 填写。
