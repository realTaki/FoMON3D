"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useChainId } from "wagmi";
import { parseEther } from "viem";
import { toast } from "sonner";
import { getContractAddresses } from "@/lib/contracts";
import { friendlyError } from "@/lib/toast";
import { gameVaultAbiJson } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DepositForm({ onSuccess }: { onSuccess?: () => void }) {
  const chainId = useChainId();
  const { address } = useAccount();
  const { gameVault } = getContractAddresses(chainId);
  const [amount, setAmount] = useState("");

  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  useEffect(() => {
    if (isSuccess && onSuccess) {
      toast.success("MON deposited. Countdown reset.");
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  useEffect(() => {
    if (error) toast.error(friendlyError(error.message));
  }, [error]);

  const handleDeposit = () => {
    const wei = parseEther(amount || "0");
    if (wei === BigInt(0)) return;
    writeContract({
      address: gameVault,
      abi: gameVaultAbiJson,
      functionName: "deposit",
      value: wei,
    } as Parameters<typeof writeContract>[0] & { value: bigint });
  };

  if (!address)
    return (
      <p className="text-slate-500 text-sm">Connect your wallet first.</p>
    );

  return (
    <div className="space-y-3">
      <Label htmlFor="deposit-amount">Amount (MON)</Label>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          id="deposit-amount"
          type="text"
          placeholder="0.01 MON"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="font-mono flex-1"
        />
        <Button
          variant="neon"
          onClick={handleDeposit}
          disabled={isPending || !amount}
          className="sm:w-auto"
        >
          {isPending ? "Confirming…" : "Deposit"}
        </Button>
      </div>
    </div>
  );
}
