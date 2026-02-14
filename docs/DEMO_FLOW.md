# FoMON3D Demo Flow

End-to-end flow for the MVP demo (Monad Testnet with MON).

## 1. Prerequisites

- Wallet (e.g. MetaMask) with **Monad Testnet** added:
  - RPC: `https://testnet-rpc.monad.xyz`
  - Chain ID: `10143`
- Testnet **MON** for gas and deposits (faucet if needed).
- Contracts deployed on Monad Testnet and addresses set in `frontend/lib/contracts.ts` for chain `10143`.

## 2. Page Load

1. Open the app and connect your wallet (RainbowKit button).
2. Switch to **Monad Testnet** in the wallet.
3. You see:
   - **Round countdown** (30s when a round is active, or `0s` when the round has ended).
   - **Deposit MON** card.
   - **Your $FoMON** and **Redeem** cards.

## 3. Round Lifecycle

- **Active round**: Countdown runs down from 30s. Each **deposit** resets the timer to 30s and mints $FoMON 1:1 to the depositor.
- **Round ends**: When the countdown reaches **0s**, the round is over. The **last depositor** is the round winner.
- **Settle & start next round**: After the round ends, a purple **Winner** banner appears. **Any connected wallet** can click **"Settle & start next round"**. That call:
  - Sends ~80% of the round pool to the **winner**.
  - Starts the **next round** (new 30s countdown).
- The UI **refreshes** when:
  - The countdown hits 0 (refetch so you see the winner / new round if someone else settled).
  - After you **deposit** (countdown and state refetch).
  - After **Settle** (new round and countdown refetch).
  - Every **1 second** the countdown/round state is refetched so the page stays in sync.

## 4. Main Actions

| Action | Who | Effect |
|--------|-----|--------|
| **Deposit MON** | Any connected wallet | Sends MON to the vault, resets 30s timer, mints $FoMON 1:1 to sender. |
| **Settle & start next round** | **Any** connected wallet | Pays the round winner and starts the next round. No need to be the winner. |
| **Request redeem** | Any connected wallet with $FoMON | Locks $FoMON and joins the 7-day redeem queue (MVP: on-chain record only). |

## 5. "Settle & start next round" in short

- **What it does**: When the round timer has reached 0, it finalizes the round (pays the last depositor ~80% of the pool) and starts a new 30s round.
- **Who can call it**: **Any** wallet that can send a transaction on the chain (anyone with the app open and connected). The contract does not restrict the caller; it only requires that the current round has ended (`block.timestamp >= deadline`).

## 6. Quick Demo Script

1. Connect wallet → Monad Testnet.
2. Deposit a small amount of MON → countdown resets to 30s, your $FoMON balance increases.
3. Wait for countdown to hit 0 (or use another wallet to deposit to keep the round alive).
4. When the winner banner appears, click **Settle & start next round** (from any wallet).
5. New round starts; countdown shows 30s again. Repeat as needed.
