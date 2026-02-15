"use client";

import { useEffect, useState } from "react";
import { useReadContract, useWriteContract, useChainId } from "wagmi";
import { toast } from "sonner";
import { getContractAddresses } from "@/lib/contracts";
import { friendlyError } from "@/lib/toast";
import { gameVaultAbiJson } from "@/lib/contracts";
import { Button } from "@/components/ui/button";

export function WinnerBanner({ onSettled }: { onSettled?: () => void }) {
  const chainId = useChainId();
  const { gameVault } = getContractAddresses(chainId);

  const { data: deadline } = useReadContract({
    address: gameVault,
    abi: gameVaultAbiJson,
    functionName: "deadline",
  });
  const { data: lastDepositor } = useReadContract({
    address: gameVault,
    abi: gameVaultAbiJson,
    functionName: "lastDepositor",
  });

  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  useEffect(() => {
    if (isSuccess && onSettled) {
      toast.success("Round settled. Next round started.");
      onSettled();
    }
  }, [isSuccess, onSettled]);

  useEffect(() => {
    if (error) toast.error(friendlyError(error.message));
  }, [error]);

  const ended = typeof deadline === "bigint" && BigInt(now) >= deadline;
  const winner =
    ended && typeof lastDepositor === "string" && lastDepositor !== "0x0000000000000000000000000000000000000000"
      ? `${lastDepositor.slice(0, 6)}…${lastDepositor.slice(-4)}`
      : null;

  const handleSettle = () => {
    writeContract({
      address: gameVault,
      abi: gameVaultAbiJson,
      functionName: "settleRound",
    });
  };

  if (!ended) return null;

  return (
    <div className="rounded-xl border border-[rgba(255,0,255,0.5)] bg-[#0f0f18] p-4 shadow-[0_0_20px_rgba(255,0,255,0.2)]">
      <p className="text-[#ff00ff] font-semibold mb-2">
        Round winner: {winner ?? "—"}
      </p>
      <p className="text-slate-500 text-xs mb-3">
        Any connected wallet can settle: queues ~80% reward to winner and starts the next round.
      </p>
      <Button variant="neon" onClick={handleSettle} disabled={isPending}>
        {isPending ? "Settling…" : "Settle & start next round"}
      </Button>
    </div>
  );
}
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);
