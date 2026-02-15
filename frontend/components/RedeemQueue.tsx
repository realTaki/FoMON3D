"use client";

import { useAccount, useReadContract, useChainId } from "wagmi";
import { formatEther } from "viem";
import { getContractAddresses } from "@/lib/contracts";
import { gameVaultAbiJson } from "@/lib/contracts";

export function RedeemQueue() {
  const chainId = useChainId();
  const { address } = useAccount();
  const { gameVault } = getContractAddresses(chainId);

  const { data: redeemAmount } = useReadContract({
    address: gameVault,
    abi: gameVaultAbiJson,
    functionName: "redeemAmount",
    args: address ? [address] : undefined,
  });
  const { data: redeemUnlockAt } = useReadContract({
    address: gameVault,
    abi: gameVaultAbiJson,
    functionName: "redeemUnlockAt",
    args: address ? [address] : undefined,
  });

  if (!address) return null;
  if (redeemAmount == null || redeemUnlockAt == null) return null;
  if (typeof redeemAmount !== "bigint" || redeemAmount === BigInt(0)) return null;

  const amountStr = formatEther(redeemAmount);
  const unlockTimestamp = Number(typeof redeemUnlockAt === "bigint" ? redeemUnlockAt : 0);
  const unlockDate = new Date(unlockTimestamp * 1000);
  const now = Date.now() / 1000;
  const isUnlocked = now >= unlockTimestamp;
  const unlockStr = isUnlocked
    ? "Ready to claim"
    : unlockDate.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });

  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-1">
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Redeem queue</p>
      <p className="font-mono text-[#00fff5]">{amountStr} $FoMON</p>
      <p className={`text-xs ${isUnlocked ? "text-emerald-400" : "text-slate-500"}`}>
        {isUnlocked ? "✓ " : ""}{unlockStr}
      </p>
    </div>
  );
}
