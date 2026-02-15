"use client";

import { useEffect, useRef, useState } from "react";

interface CountdownProps {
  deadlineSeconds: number | undefined;
  onReachZero?: () => void;
}

export function Countdown({ deadlineSeconds, onReachZero }: CountdownProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const hasFiredZero = useRef(false);

  useEffect(() => {
    if (deadlineSeconds == null || deadlineSeconds <= 0) {
      setSecondsLeft(0);
      hasFiredZero.current = true;
      return;
    }
    hasFiredZero.current = false;
  }, [deadlineSeconds]);

  useEffect(() => {
    if (deadlineSeconds == null || deadlineSeconds <= 0) return;

    const compute = () => {
      const now = Math.floor(Date.now() / 1000);
      const left = Math.max(0, deadlineSeconds - now);
      setSecondsLeft(left);
      if (left === 0 && onReachZero && !hasFiredZero.current) {
        hasFiredZero.current = true;
        onReachZero();
      }
    };

    compute();
    const interval = setInterval(compute, 1000);
    return () => clearInterval(interval);
  }, [deadlineSeconds, onReachZero]);

  if (secondsLeft === null && (deadlineSeconds == null || deadlineSeconds === 0))
    return (
      <span className="font-mono text-4xl text-slate-500">--</span>
    );

  const display = secondsLeft !== null ? secondsLeft : Math.max(0, (deadlineSeconds ?? 0) - Math.floor(Date.now() / 1000));
  return (
    <span
      className="font-mono text-5xl tabular-nums text-[#00fff5]"
      style={{ textShadow: "0 0 20px rgba(0,255,245,0.6)" }}
    >
      {display}s
    </span>
  );
}
