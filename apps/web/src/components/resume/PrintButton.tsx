"use client";

export function PrintButton() {
  return (
    <button
      className="text-sm px-3 py-2 rounded-md border border-black/10 dark:border-white/10 hover:bg-white/10"
      onClick={() => window.print()}
    >
      Print / Save as PDF
    </button>
  );
}


