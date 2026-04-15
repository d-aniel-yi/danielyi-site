import { createRoot } from "react-dom/client";
import { DuckDBProvider, useConnectionStatus } from "./duckdb-provider";
import Dive from "./dive";
import "./index.css";

function ConnectionGate({ children }: { children: React.ReactNode }) {
  const { isConnected, isConnecting, error } = useConnectionStatus();
  if (isConnecting) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", color: "#64748b", fontFamily: "monospace", gap: 8 }}>
      Loading DuckDB + data…
    </div>
  );
  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", color: "#ef4444", fontFamily: "monospace", gap: 8 }}>
      Error: {error.message}
    </div>
  );
  if (!isConnected) return null;
  return <>{children}</>;
}

const parquetFiles = [
  { url: import.meta.env.BASE_URL + "cases.parquet", tableName: "cases" },
  { url: import.meta.env.BASE_URL + "cases_unclassified.parquet", tableName: "cases_unclassified" },
];

createRoot(document.getElementById("root")!).render(
  <DuckDBProvider parquetFiles={parquetFiles}>
    <ConnectionGate>
      <Dive />
    </ConnectionGate>
  </DuckDBProvider>
);
