/**
 * DuckDB-WASM provider that replaces the MotherDuck SDK.
 * Loads Parquet files from /public and exposes the same
 * useSQLQuery API the dive component expects.
 */
import * as duckdb from "@duckdb/duckdb-wasm";
import {
  createContext, useContext, useEffect, useRef, useState,
  useMemo, useCallback, useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";

// ── Types (matching MotherDuck SDK) ─────────────────────────────

type QueryStatus = "idle" | "loading" | "success" | "error";

export type UseSQLQueryResult = {
  data: any[] | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isPlaceholderData: boolean;
  error: Error | null;
  refetch: () => void;
  status: QueryStatus;
};

// ── QueryObserver ───────────────────────────────────────────────

interface ObserverState {
  status: QueryStatus;
  data: any[] | undefined;
  error: Error | undefined;
}

class QueryObserver {
  private state: ObserverState = { status: "idle", data: undefined, error: undefined };
  private listeners = new Set<() => void>();
  private abortId = 0;

  subscribe = (l: () => void) => { this.listeners.add(l); return () => this.listeners.delete(l); };
  getSnapshot = () => this.state;

  private setState(u: Partial<ObserverState>) {
    this.state = { ...this.state, ...u };
    this.listeners.forEach((l) => l());
  }

  async execute(conn: duckdb.AsyncDuckDBConnection, sql: string) {
    const id = ++this.abortId;
    this.setState({ status: "loading", data: undefined, error: undefined });
    try {
      const result = await conn.query(sql);
      if (id !== this.abortId) return;
      const rows = result.toArray().map((row: any) => {
        const obj: Record<string, any> = {};
        for (const field of result.schema.fields) {
          const val = row[field.name];
          // Convert BigInt to Number for compatibility
          obj[field.name] = typeof val === "bigint" ? Number(val) : val;
        }
        return obj;
      });
      this.setState({ status: "success", data: rows, error: undefined });
    } catch (err) {
      if (id !== this.abortId) return;
      this.setState({ status: "error", error: err instanceof Error ? err : new Error(String(err)) });
    }
  }

  reset() { this.abortId++; this.setState({ status: "idle", data: undefined, error: undefined }); }
  cancel() { this.abortId++; }
}

// ── Provider ────────────────────────────────────────────────────

type CtxValue = { conn: duckdb.AsyncDuckDBConnection | null; ready: boolean; error: Error | null };
const Ctx = createContext<CtxValue>({ conn: null, ready: false, error: null });

export function DuckDBProvider({ children, parquetFiles }: {
  children: ReactNode;
  parquetFiles: { url: string; tableName: string }[];
}) {
  const [state, setState] = useState<CtxValue>({ conn: null, ready: false, error: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Initialize DuckDB-WASM
        const DUCKDB_BUNDLES = await duckdb.selectBundle({
          mvp: { mainModule: new URL("@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm", import.meta.url).href,
                 mainWorker: new URL("@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js", import.meta.url).href },
          eh: { mainModule: new URL("@duckdb/duckdb-wasm/dist/duckdb-eh.wasm", import.meta.url).href,
                mainWorker: new URL("@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js", import.meta.url).href },
        });
        const logger = new duckdb.ConsoleLogger();
        const worker = new Worker(DUCKDB_BUNDLES.mainWorker!);
        const db = new duckdb.AsyncDuckDB(logger, worker);
        await db.instantiate(DUCKDB_BUNDLES.mainModule);
        const conn = await db.connect();

        // Load Parquet files as tables
        for (const pf of parquetFiles) {
          const resp = await fetch(pf.url);
          const buf = await resp.arrayBuffer();
          await db.registerFileBuffer(pf.tableName + ".parquet", new Uint8Array(buf));
          await conn.query(`CREATE TABLE "${pf.tableName}" AS SELECT * FROM read_parquet('${pf.tableName}.parquet')`);
        }

        if (!cancelled) setState({ conn, ready: true, error: null });
      } catch (err) {
        if (!cancelled) setState({ conn: null, ready: false, error: err instanceof Error ? err : new Error(String(err)) });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

// ── useSQLQuery (drop-in replacement) ───────────────────────────

export function useSQLQuery(
  sql: string,
  options?: { enabled?: boolean },
): UseSQLQueryResult {
  const { conn, ready } = useContext(Ctx);
  const observerRef = useRef<QueryObserver | null>(null);
  if (!observerRef.current) observerRef.current = new QueryObserver();
  const observer = observerRef.current;

  const snap = useSyncExternalStore(observer.subscribe, observer.getSnapshot, observer.getSnapshot);
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (!enabled || !ready || !conn) {
      observer.reset();
      return;
    }
    // Rewrite table references: remove "consumer_litigation"."main". prefix
    const rewritten = sql.replace(/"consumer_litigation"\."main"\./g, "");
    observer.execute(conn, rewritten);
    return () => observer.cancel();
  }, [sql, enabled, ready, conn]);

  const refetch = useCallback(() => {
    if (conn && ready && enabled) {
      const rewritten = sql.replace(/"consumer_litigation"\."main"\./g, "");
      observer.execute(conn, rewritten);
    }
  }, [observer, conn, ready, enabled, sql]);

  return {
    data: snap.data,
    isLoading: snap.status === "loading" || (!ready && enabled),
    isSuccess: snap.status === "success",
    isError: snap.status === "error",
    isPlaceholderData: false,
    error: snap.error ?? null,
    refetch,
    status: snap.status,
  };
}

export function useConnectionStatus() {
  const { ready, error } = useContext(Ctx);
  return { isConnected: ready, isConnecting: !ready && !error, error };
}
