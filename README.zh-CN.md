# FoMON3D

[English README](README.md) | [演示脚本](docs/DEMO_SCRIPT.zh-CN.md)

FoMON3D 的核心不是“再做一个链游”，而是为 AI Agent 金库做“信任冷启动”。  
我们的判断是：AI Agent 也许有能力在 Launchpad 上交易 MEME，但人类出资人并不会在第一天就把资金直接交给 AI 自主操作。  
FoMON3D 用游戏机制先聚合资金与注意力，再把资金沉淀进 Agent Treasury，让 AI 策略尝试在社会信任和经济激励上都变得可行。

![FoMON3D game flow](docs/fomon3d-flowchart.svg)

## Monad Hackathon 提交信息

- 项目名称：`FoMON3D`
- 赛道：Consumer dApp / On-chain Game
- 网络：Monad
- 团队：FoMON3D
- 在线演示：https://fomon3d.vercel.app/
- 演示视频：`TBD`
- 合约仓库 / 代码：`TBD`

### 要求对齐检查清单

- [ ] 在 Monad（或测试网）上可验证的可运行演示。
- [x] 清晰说明本项目原创部分。
- [x] 清晰划分复用组件和外部依赖边界。
- [x] 明确解释为何该项目需要 Monad 性能特性。
- [x] 具备新颖玩法与代币机制（非简单改壳复制）。

## 1. 我们解决的问题

AI 交易 Agent 面临的核心问题是“信任冷启动”：
- 能力可能存在，但人类 LP 的信任尚未建立。
- “直接把钱交给 AI 去交易”的产品天然会引发怀疑。
- 没有初始资金池，Agent Treasury 就无法规模化运行策略。

FoMON3D 把这个问题转化为可参与的资金形成过程：
- 通过游戏回合吸引用户参与和流动性，
- 通过份额机制把参与者与金库长期绑定，
- 最终为 Agent 金库提供可运作的资本基础。

## 2. 核心创新

FoMON3D 的创新是“把信任转化为资本”，通过双层结构实现：
- 回合层（FOMO 游戏）：每次有效存入都会重置 30 秒倒计时，最后存入者拿走本轮奖励。
- 金库层（份额系统）：用户存入后铸造 `$FoMON`，对应金库净值（NAV）和未来收益敞口。

这使得用户参与不再只是一次性博彩，而是阶段性的信任建立：
- 先通过熟悉的游戏机制进入，
- 再通过结构化金库沉淀资金，
- 最终由社区形成的资金池支持 Agent 策略运作，而不是盲目信任式委托。

未获胜用户并非零和归零，可继续持有、排队赎回，或在有流动性时交易。

## 3. 为什么是 Monad

FoMON3D 对交互速度要求很高：
- 低延迟：保证实时倒计时竞速体验。
- 低手续费：支持小额高频参与。
- 高吞吐：在高并发时维持稳定执行。

Monad 是该交互模型的匹配执行环境。

## 4. 玩法流程

1. 用户存入 `$MON`。
2. 协议给用户铸造 `$FoMON`。
3. 每次有效存入都会重置 30 秒倒计时。
4. 倒计时结束时，最后存入者获得本轮奖励。
5. 其他用户保留 `$FoMON`，可选择：
- 持有以保留金库敞口，
- 通过 7 天队列赎回成 `$MON`。

## 5. 合约架构（规划 / 开发中）

- `GameRound`：倒计时管理、回合状态、赢家结算。
- `FoMONToken`：ERC-20 份额代币。
- `TreasuryVault`：存款、NAV 记账、赎回队列。
- `StrategyAdapter`：策略执行与风控限制。

## 6. 黑客松原创贡献说明

本次黑客松由团队原创完成：
- FoMON3D 玩法与激励模型设计。
- 回合机制 + 金库机制的混合架构。
- 代币流转与赎回机制设计。
- 演示叙事与产品文档。

开源 / 外部依赖：
- 标准 Solidity / EVM 基础库（将在最终代码发布时列出）。
- Monad 开发工具链。

## 7. 评委演示重点

演示将覆盖：
- 完整回合生命周期（存入 -> 重置倒计时 -> 结算）。
- 回合结束后的用户路径（持有 / 赎回队列）。
- `$MON` 与 `$FoMON` 的份额逻辑。
- 为什么该机制依赖 Monad 的性能优势。

## 8. 路线图

- `v0`：核心合约与本地模拟。
- `v1`：Monad 测试网部署与可交互前端。
- `v2`：策略风控强化与公开测试。

## 9. 风险披露

- 策略收益不保证。
- 市场风险与合约风险始终存在。
- 用户应仅投入可承受损失的资金。

## 10. AI 声明

本仓库包含 AI 生成内容。
- 生成工具：Codex
- 模型版本：GPT-5

## 11. 联系方式

如需黑客松后续沟通，请联系 FoMON3D 团队。

## 12. Demo 流程与合约信息

**环境**：Node.js >= 20（前端）、Foundry（合约）。

**合约（Monad 测试网）**

| 项目 | 值 |
|------|-----|
| 网络 | Monad Testnet |
| RPC | `https://testnet-rpc.monad.xyz` |
| Chain ID | `10143` |
| FoMONToken | `0xd08934afd2affffacc8ccfffde8a7ca5a61f2549` |
| GameVault | `0x5f0dae5fc34b739f62e63bdc5dabfb830cade5a3` |

**部署**（需测试网 MON 付 gas，私钥勿提交）：

```bash
cd contracts
PRIVATE_KEY=<你的私钥> forge script script/Deploy.s.sol --rpc-url https://testnet-rpc.monad.xyz --broadcast --chain-id 10143
```

将终端输出的 FoMONToken、GameVault 地址填入 `frontend/lib/contracts.ts` 中 `10143` 的 `fomonToken`、`gameVault`。

**Demo 流程**

1. **在线**：打开 https://fomon3d.vercel.app/ 即可体验；或本地运行：`cd frontend && npm install && npm run dev`，再访问 http://localhost:3000 。
2. 钱包添加 Monad 测试网（RPC 与 Chain ID 见上表），连接钱包。
3. **存入 MON** → 倒计时重置 30s，获得等量 $FoMON。
4. 倒计时归零后出现**赢家横幅**，任意钱包可点 **Settle & start next round** 结算并开启下一轮。
5. **赎回**：在 Redeem 区可把当前 $FoMON 加入 7 天赎回队列（队列状态在页面上展示）。

本地链：Anvil RPC `http://127.0.0.1:8545`、Chain ID `31337`，部署后同样在 `contracts.ts` 中配置对应地址。

---

最后更新：2026 年 2 月 15 日
