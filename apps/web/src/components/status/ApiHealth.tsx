"use client";
import { useEffect, useState } from "react";

type Status = "idle" | "ok" | "error";

export function ApiHealth() {
  const [status, setStatus] = useState<Status>("idle");
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const t0 = performance.now();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/health`, { cache: "no-store" });
        const t1 = performance.now();
        setLatencyMs(Math.round(t1 - t0));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setStatus("ok");
      } catch (e) {
        setStatus("error");
        const message = e instanceof Error ? e.message : "Unknown error";
        setError(message);
      }
    };
    run();
  }, []);

  const color = status === "ok" ? "bg-green-500" : status === "error" ? "bg-red-500" : "bg-gray-400";

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} />
      <span>API health</span>
      <span className="text-black/60 dark:text-white/60">{status === "ok" ? "OK" : status === "error" ? "ERROR" : "..."}</span>
      {latencyMs != null && <span className="text-black/60 dark:text-white/60">• {latencyMs} ms</span>}
      {status === "error" && error && <span className="text-red-500">• {error}</span>}
    </div>
  );
}


