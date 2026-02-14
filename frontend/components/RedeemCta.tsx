"use client";

import { useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useChainId } from "wagmi";
import { formatEther } from "viem";
import { toast } from "sonner";
import { getContractAddresses } from "@/lib/contracts";
import { fomonTokenAbiJson, gameVaultAbiJson } from "@/lib/contracts";
import { friendlyError } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { RedeemQueue } from "@/components/RedeemQueue";

export function RedeemCta() {
  const chainId = useChainId();
  const { address } = useAccount();
  const { fomonToken, gameVault } = getContractAddresses(chainId);

  const { data: balance } = useReadContract({
    address: fomonToken,
    abi: fomonTokenAbiJson,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  useEffect(() => {
    if (isSuccess) toast.success("Added to 7-day redeem queue.");
  }, [isSuccess]);

  useEffect(() => {
    if (error) toast.error(friendlyError(error.message));
  }, [error]);

  const handleRedeem = () => {
    if (typeof balance !== "bigint" || balance === BigInt(0)) return;
    writeContract({
      address: gameVault,
      abi: gameVaultAbiJson,
      functionName: "requestRedeem",
      args: [balance],
    });
  };

  if (!address) return null;

  const balanceStr = typeof balance === "bigint" ? formatEther(balance) : "0";
  const hasBalance = typeof balance === "bigint" && balance > BigInt(0);

  return (
    <div className="space-y-4">
      <RedeemQueue />
      <div className="space-y-2">
        <p className="text-slate-500 text-sm">
          Redeemable: <span className="font-mono text-[#00fff5]">{balanceStr}</span> $FoMON
        </p>
        <Button
          variant="outline"
          onClick={handleRedeem}
          disabled={isPending || !hasBalance}
          className="w-full sm:w-auto"
        >
          {isPending ? "Submitting…" : "Redeem all"}
        </Button>
      </div>
    </div>
  );
}
