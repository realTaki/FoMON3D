"use client";

import { useAccount, useReadContract, useChainId } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { getContractAddresses, isContractConfigured } from "@/lib/contracts";
import { gameVaultAbiJson } from "@/lib/contracts";
import { Countdown } from "@/components/Countdown";
import { DepositForm } from "@/components/DepositForm";
import { BalanceCard } from "@/components/BalanceCard";
import { WinnerBanner } from "@/components/WinnerBanner";
import { RedeemCta } from "@/components/RedeemCta";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const queryClient = useQueryClient();
  const chainIdSafe = typeof chainId === "number" ? chainId : 31337;
  const { gameVault } = getContractAddresses(chainIdSafe);

  const configured = isContractConfigured(chainIdSafe);
  const shouldReadContract = configured && isConnected;
  const { data: deadline, refetch: refetchDeadline } = useReadContract({
    address: shouldReadContract ? gameVault : undefined,
    abi: gameVaultAbiJson,
    functionName: "deadline",
    query: {
      refetchInterval: 1_000,
    },
  });

  const deadlineSeconds = deadline != null ? Number(deadline) : undefined;

  const refreshGameState = () => {
    refetchDeadline();
    queryClient.invalidateQueries();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex flex-col">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0a0a0f]/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1
              className="text-xl sm:text-2xl font-bold text-[#00fff5] tracking-tight"
              style={{ textShadow: "0 0 20px rgba(0,255,245,0.4)" }}
            >
              FoMON3D
            </h1>
            <span className="hidden sm:inline text-slate-500 text-sm font-medium">
              FOMO + Treasury on Monad
            </span>
          </div>
          <ConnectButton />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {!isContractConfigured(chainIdSafe) && (
          <Card className="border-amber-500/40 bg-amber-950/20">
            <CardContent className="pt-6">
              <p className="text-amber-200/90 text-sm">
                Contract not configured for this network. Deploy and set addresses in{" "}
                <code className="bg-black/40 px-1.5 py-0.5 rounded text-xs">frontend/lib/contracts.ts</code>.
              </p>
            </CardContent>
          </Card>
        )}

        {configured && isConnected && (
          <>
            <section className="text-center space-y-3">
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                Round countdown
              </p>
              <Countdown deadlineSeconds={deadlineSeconds} onReachZero={refreshGameState} />
            </section>

            <Card>
              <CardHeader>
                <CardTitle>Deposit MON</CardTitle>
                <p className="text-slate-500 text-sm font-normal mt-1">
                  Send MON to join the round. Resets the 30s timer and mints $FoMON 1:1.
                </p>
              </CardHeader>
              <CardContent>
                <DepositForm onSuccess={refreshGameState} />
              </CardContent>
            </Card>

            <WinnerBanner onSettled={refreshGameState} />

            <div className="grid gap-4 sm:grid-cols-2">
              <BalanceCard />
              <Card>
                <CardHeader>
                  <CardTitle>Redeem</CardTitle>
                  <p className="text-slate-500 text-sm font-normal mt-1">
                    Request to redeem $FoMON (7-day queue).
                  </p>
                </CardHeader>
                <CardContent>
                  <RedeemCta />
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {configured && !isConnected && (
          <div className="text-center py-16 px-4">
            <p className="text-slate-500 mb-2">Connect your wallet to play</p>
            <p className="text-slate-600 text-sm">Demo uses MON on Monad Testnet (10143). Add the network and get testnet MON to try.</p>
          </div>
        )}

        <footer className="text-center text-slate-600 text-xs sm:text-sm pt-8">
          Low latency · Low fees · High throughput — Built for Monad
        </footer>
      </main>
    </div>
  );
}
