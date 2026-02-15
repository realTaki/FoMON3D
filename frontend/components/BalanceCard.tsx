"use client";

import { useAccount, useReadContract, useChainId } from "wagmi";
import { formatEther } from "viem";
import { getContractAddresses } from "@/lib/contracts";
import { fomonTokenAbiJson, gameVaultAbiJson } from "@/lib/contracts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function BalanceCard() {
  const chainId = useChainId();
  const { address } = useAccount();
  const { fomonToken, gameVault } = getContractAddresses(chainId);

  const { data: balance } = useReadContract({
    address: fomonToken,
    abi: fomonTokenAbiJson,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: lastDepositor } = useReadContract({
    address: gameVault,
    abi: gameVaultAbiJson,
    functionName: "lastDepositor",
  });

  if (!address) return null;

  const balanceStr =
    typeof balance === "bigint" ? formatEther(balance) : "--";
  const short = (addr: string) =>
    `${addr.slice(0, 6)}…${addr.slice(-4)}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your $FoMON</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="font-mono text-2xl text-[#00fff5]">{balanceStr}</p>
        <p className="text-sm text-slate-500">
          Last depositor:{" "}
          {typeof lastDepositor === "string" && lastDepositor !== "0x0000000000000000000000000000000000000000"
            ? short(lastDepositor)
            : "—"}
        </p>
      </CardContent>
    </Card>
  );
}
