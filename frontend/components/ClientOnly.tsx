"use client";

import { useState, useEffect } from "react";

/** Renders children only after client mount to avoid hydration issues and blocking on wallet/RPC init. */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#00fff5] border-t-transparent" />
          <p className="mt-4 text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
