import { useRunBenchmark } from "@/hooks/useCompiler";
import {
  BENCHMARK_PROMPTS,
  type BenchmarkPrompt,
  EDGE_PROMPTS,
  NORMAL_PROMPTS,
} from "@/lib/benchmark-prompts";
import type { CompileResult } from "@/types/compiler";
import {
  CheckCircle,
  ChevronRight,
  Play,
  PlayCircle,
  XCircle,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type RunStatus = "idle" | "running" | "success" | "failed";

interface BenchmarkState {
  status: RunStatus;
  result?: CompileResult;
  error?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatMs(ms: bigint | undefined): string {
  if (ms === undefined) return "—";
  return `${Number(ms).toLocaleString()} ms`;
}

function StatusDot({ status }: { status: RunStatus }) {
  if (status === "idle")
    return (
      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 shrink-0" />
    );
  if (status === "running")
    return (
      <span className="w-2 h-2 rounded-full bg-primary shrink-0 animate-pulse" />
    );
  if (status === "success")
    return <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />;
  return <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />;
}

function StatusBadge({ success }: { success: boolean }) {
  return success ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-code font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
      <CheckCircle className="w-3 h-3" /> PASS
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] font-code font-semibold px-2 py-0.5 rounded bg-destructive/15 text-destructive border border-destructive/30">
      <XCircle className="w-3 h-3" /> FAIL
    </span>
  );
}

// ─── JSON Detail Viewer ───────────────────────────────────────────────────────
function JsonViewer({ label, value }: { label: string; value: unknown }) {
  const [open, setOpen] = useState(false);
  const json = JSON.stringify(
    value,
    (_, v) => (typeof v === "bigint" ? Number(v) : v),
    2,
  );
  return (
    <div className="border border-border/50 rounded overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-muted/20 text-xs font-code text-muted-foreground hover:bg-muted/30 transition-colors"
      >
        <span className="text-primary/80">{label}</span>
        <ChevronRight
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && (
        <pre className="text-[10px] font-code text-foreground/70 bg-muted/10 p-3 overflow-auto max-h-48 leading-relaxed">
          {json}
        </pre>
      )}
    </div>
  );
}

// ─── Right Panel ─────────────────────────────────────────────────────────────
function ResultPanel({
  prompt,
  state,
}: {
  prompt: BenchmarkPrompt | null;
  state: BenchmarkState | null;
}) {
  if (!prompt || !state || state.status === "idle") {
    return (
      <div
        className="flex flex-col items-center justify-center h-full text-center p-8"
        data-ocid="evaluation.result_panel.empty_state"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
          <PlayCircle className="w-6 h-6 text-primary/50" />
        </div>
        <p className="text-sm font-code text-muted-foreground">
          Select a benchmark and run it
        </p>
        <p className="text-xs text-muted-foreground/50 mt-1 font-code">
          Results will appear here
        </p>
      </div>
    );
  }

  if (state.status === "running") {
    return (
      <div
        className="flex flex-col items-center justify-center h-full"
        data-ocid="evaluation.result_panel.loading_state"
      >
        <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-4" />
        <p className="text-sm font-code text-primary animate-pulse">Running…</p>
        <p className="text-xs text-muted-foreground mt-1 font-code">
          {prompt.label}
        </p>
      </div>
    );
  }

  const r = state.result;
  if (!r) return null;
  const validationErrors = r.validation?.errors?.length ?? 0;
  const repairs = r.repair?.repairs_made?.length ?? 0;
  const assumptions = r.assumptions ?? [];

  return (
    <div
      className="p-4 space-y-4 overflow-auto h-full"
      data-ocid="evaluation.result_panel"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-code font-bold text-foreground truncate">
            {prompt.label}
          </h3>
          <p className="text-[10px] text-muted-foreground font-code mt-0.5 capitalize">
            {prompt.category === "edge" ? "Edge Case" : "Normal SaaS"}
          </p>
        </div>
        <StatusBadge success={r.success} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-muted/20 border border-border/50 rounded p-3">
          <p className="text-[10px] font-code text-muted-foreground uppercase tracking-wider mb-1">
            Processing Time
          </p>
          <p className="text-base font-code font-bold text-primary">
            {formatMs(r.processing_time_ms)}
          </p>
        </div>
        <div className="bg-muted/20 border border-border/50 rounded p-3">
          <p className="text-[10px] font-code text-muted-foreground uppercase tracking-wider mb-1">
            Validation Errors
          </p>
          <p
            className={`text-base font-code font-bold ${
              validationErrors > 0 ? "text-destructive" : "text-emerald-400"
            }`}
          >
            {validationErrors}
          </p>
        </div>
        <div className="bg-muted/20 border border-border/50 rounded p-3">
          <p className="text-[10px] font-code text-muted-foreground uppercase tracking-wider mb-1">
            Repairs Made
          </p>
          <p
            className={`text-base font-code font-bold ${
              repairs > 0 ? "text-yellow-400" : "text-emerald-400"
            }`}
          >
            {repairs}
          </p>
        </div>
        <div className="bg-muted/20 border border-border/50 rounded p-3">
          <p className="text-[10px] font-code text-muted-foreground uppercase tracking-wider mb-1">
            Assumptions
          </p>
          <p className="text-base font-code font-bold text-secondary">
            {assumptions.length}
          </p>
        </div>
      </div>

      {/* Error message */}
      {r.error_message && (
        <div className="bg-destructive/10 border border-destructive/30 rounded p-3">
          <p className="text-[10px] font-code text-destructive font-semibold uppercase mb-1">
            Error
          </p>
          <p className="text-xs font-code text-destructive/80 break-words">
            {r.error_message}
          </p>
        </div>
      )}

      {/* Assumptions */}
      {assumptions.length > 0 && (
        <div className="border border-border/50 rounded p-3 bg-muted/10">
          <p className="text-[10px] font-code text-muted-foreground uppercase tracking-wider mb-2">
            Assumptions ({assumptions.length})
          </p>
          <ul className="space-y-1">
            {assumptions.map((a, i) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: ordered assumptions
                key={i}
                className="text-xs font-code text-foreground/70 flex gap-2"
              >
                <span className="text-secondary shrink-0">›</span>
                <span className="break-words">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Final config summary */}
      {r.final_config && (
        <div className="border border-border/50 rounded p-3 bg-muted/10 space-y-1">
          <p className="text-[10px] font-code text-muted-foreground uppercase tracking-wider mb-2">
            Generated Config
          </p>
          <p className="text-xs font-code text-foreground/80">
            <span className="text-primary">app_name</span>:{" "}
            {r.final_config.app_name}
          </p>
          <p className="text-xs font-code text-foreground/80">
            <span className="text-primary">entities</span>:{" "}
            {r.final_config.entities?.length ?? 0}
          </p>
          <p className="text-xs font-code text-foreground/80">
            <span className="text-primary">roles</span>:{" "}
            {r.final_config.roles?.length ?? 0}
          </p>
          <p className="text-xs font-code text-foreground/80">
            <span className="text-primary">pages</span>:{" "}
            {r.final_config.pages?.length ?? 0}
          </p>
          <p className="text-xs font-code text-foreground/80">
            <span className="text-primary">api_endpoints</span>:{" "}
            {r.final_config.api?.endpoints?.length ?? 0}
          </p>
        </div>
      )}

      {/* Collapsible JSON viewers */}
      {r.intent && <JsonViewer label="Intent Extraction" value={r.intent} />}
      {r.validation && (
        <JsonViewer label="Validation Result" value={r.validation} />
      )}
      {r.repair && <JsonViewer label="Repair Result" value={r.repair} />}
    </div>
  );
}

// ─── Benchmark Row ────────────────────────────────────────────────────────────
function BenchmarkRow({
  prompt,
  state,
  isSelected,
  onSelect,
  onRun,
}: {
  prompt: BenchmarkPrompt;
  state: BenchmarkState;
  isSelected: boolean;
  onSelect: () => void;
  onRun: (e: React.MouseEvent) => void;
}) {
  const truncatedPrompt =
    prompt.prompt.length > 80
      ? `${prompt.prompt.slice(0, 80)}…`
      : prompt.prompt;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded transition-colors group ${
        isSelected
          ? "bg-primary/15 border border-primary/30"
          : "border border-transparent hover:bg-muted/30 hover:border-border/40"
      }`}
      data-ocid={`evaluation.benchmark.item.${prompt.id + 1}`}
    >
      <div className="flex items-center gap-2 shrink-0 mt-0.5">
        <StatusDot status={state.status} />
        <span className="text-[10px] font-code text-muted-foreground/60 w-5 text-right">
          {prompt.id + 1}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-xs font-code font-semibold truncate ${
            isSelected ? "text-primary" : "text-foreground"
          }`}
        >
          {prompt.label}
        </p>
        <p className="text-[10px] font-code text-muted-foreground/60 mt-0.5 leading-relaxed line-clamp-2">
          {truncatedPrompt}
        </p>
      </div>
      <button
        type="button"
        onClick={onRun}
        disabled={state.status === "running"}
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 focus:opacity-100"
        data-ocid={`evaluation.benchmark.run_button.${prompt.id + 1}`}
        aria-label={`Run ${prompt.label}`}
      >
        <Play className="w-3 h-3" />
      </button>
    </button>
  );
}

// ─── Aggregate Stats ──────────────────────────────────────────────────────────
function AggregateStats({
  states,
}: {
  states: Record<number, BenchmarkState>;
}) {
  const completed = Object.values(states).filter(
    (s) => s.status === "success" || s.status === "failed",
  );
  if (completed.length === 0) return null;

  const passed = completed.filter((s) => s.result?.success).length;
  const successRate = Math.round((passed / completed.length) * 100);
  const totalErrors = completed.reduce(
    (acc, s) => acc + (s.result?.validation?.errors?.length ?? 0),
    0,
  );
  const totalRepairs = completed.reduce(
    (acc, s) => acc + (s.result?.repair?.repairs_made?.length ?? 0),
    0,
  );
  const avgTime =
    completed.length > 0
      ? Math.round(
          completed.reduce(
            (acc, s) => acc + Number(s.result?.processing_time_ms ?? 0),
            0,
          ) / completed.length,
        )
      : 0;

  // Failure breakdown
  const totalFailed = completed.filter((s) => !s.result?.success).length;

  return (
    <div
      className="border-t border-border/50 bg-card/50 rounded-b-lg p-4"
      data-ocid="evaluation.aggregate_stats"
    >
      <h3 className="text-[10px] font-code text-muted-foreground uppercase tracking-widest mb-3">
        Aggregate Results — {completed.length}/{BENCHMARK_PROMPTS.length}{" "}
        completed
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-muted/20 border border-border/50 rounded p-3 text-center">
          <p
            className={`text-2xl font-code font-bold ${
              successRate >= 80
                ? "text-emerald-400"
                : successRate >= 50
                  ? "text-yellow-400"
                  : "text-destructive"
            }`}
          >
            {successRate}%
          </p>
          <p className="text-[10px] font-code text-muted-foreground mt-1 uppercase tracking-wider">
            Success Rate
          </p>
        </div>
        <div className="bg-muted/20 border border-border/50 rounded p-3 text-center">
          <p
            className={`text-2xl font-code font-bold ${
              totalErrors > 0 ? "text-destructive" : "text-emerald-400"
            }`}
          >
            {totalErrors}
          </p>
          <p className="text-[10px] font-code text-muted-foreground mt-1 uppercase tracking-wider">
            Total Errors
          </p>
        </div>
        <div className="bg-muted/20 border border-border/50 rounded p-3 text-center">
          <p
            className={`text-2xl font-code font-bold ${
              totalRepairs > 0 ? "text-yellow-400" : "text-emerald-400"
            }`}
          >
            {totalRepairs}
          </p>
          <p className="text-[10px] font-code text-muted-foreground mt-1 uppercase tracking-wider">
            Repairs Made
          </p>
        </div>
        <div className="bg-muted/20 border border-border/50 rounded p-3 text-center">
          <p className="text-2xl font-code font-bold text-primary">
            {avgTime.toLocaleString()}
          </p>
          <p className="text-[10px] font-code text-muted-foreground mt-1 uppercase tracking-wider">
            Avg ms
          </p>
        </div>
      </div>
      {totalFailed > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-[10px] font-code text-muted-foreground/60 uppercase tracking-wider self-center">
            Failures:
          </span>
          <span className="text-[10px] font-code px-2 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20">
            {totalFailed} total failed
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EvaluationPage() {
  const runBenchmark = useRunBenchmark();
  const [states, setStates] = useState<Record<number, BenchmarkState>>(() =>
    Object.fromEntries(
      BENCHMARK_PROMPTS.map((p) => [p.id, { status: "idle" as RunStatus }]),
    ),
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [runAllProgress, setRunAllProgress] = useState(0);
  const abortRef = useRef(false);

  const runSingle = useCallback(
    async (index: number) => {
      setStates((prev) => ({
        ...prev,
        [index]: { status: "running" },
      }));
      setSelectedId(index);
      try {
        const result = await runBenchmark.mutateAsync(index);
        setStates((prev) => ({
          ...prev,
          [index]: { status: result.success ? "success" : "failed", result },
        }));
      } catch (err) {
        setStates((prev) => ({
          ...prev,
          [index]: {
            status: "failed",
            error: err instanceof Error ? err.message : "Unknown error",
          },
        }));
      }
    },
    [runBenchmark],
  );

  const handleRunAll = useCallback(async () => {
    if (isRunningAll) {
      abortRef.current = true;
      setIsRunningAll(false);
      return;
    }
    abortRef.current = false;
    setIsRunningAll(true);
    setRunAllProgress(0);

    for (let i = 0; i < BENCHMARK_PROMPTS.length; i++) {
      if (abortRef.current) break;
      await runSingle(BENCHMARK_PROMPTS[i].id);
      setRunAllProgress(i + 1);
      if (i < BENCHMARK_PROMPTS.length - 1) {
        await new Promise((res) => setTimeout(res, 500));
      }
    }

    setIsRunningAll(false);
  }, [isRunningAll, runSingle]);

  const progressPct = isRunningAll
    ? Math.round((runAllProgress / BENCHMARK_PROMPTS.length) * 100)
    : 0;

  const selectedState =
    selectedId !== null ? (states[selectedId] ?? null) : null;
  const selectedPrompt =
    selectedId !== null
      ? (BENCHMARK_PROMPTS.find((p) => p.id === selectedId) ?? null)
      : null;

  return (
    <div className="flex flex-col h-full" data-ocid="evaluation.page">
      {/* ── Header ── */}
      <div className="flex-none border-b border-border/50 bg-card/50 px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-code text-secondary bg-secondary/10 border border-secondary/30 px-2 py-0.5 rounded">
                20 PROMPTS
              </span>
              <h2 className="text-base font-bold font-code text-foreground">
                Evaluation Dashboard
              </h2>
            </div>
            <p className="text-xs text-muted-foreground font-code mt-0.5">
              10 normal SaaS · 10 edge cases
            </p>
          </div>
          <button
            type="button"
            onClick={handleRunAll}
            disabled={!isRunningAll && runBenchmark.isPending}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-code font-semibold transition-colors ${
              isRunningAll
                ? "bg-destructive/20 text-destructive border border-destructive/40 hover:bg-destructive/30"
                : "bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            data-ocid="evaluation.run_all_button"
          >
            {isRunningAll ? (
              <>
                <span className="w-3 h-3 rounded-sm bg-destructive/70" />
                Stop ({runAllProgress}/{BENCHMARK_PROMPTS.length})
              </>
            ) : (
              <>
                <PlayCircle className="w-3.5 h-3.5" />
                Run All Benchmarks
              </>
            )}
          </button>
        </div>

        {/* Progress bar */}
        {isRunningAll && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-code text-muted-foreground">
                Running benchmark {runAllProgress + 1} of{" "}
                {BENCHMARK_PROMPTS.length}
              </span>
              <span className="text-[10px] font-code text-primary">
                {progressPct}%
              </span>
            </div>
            <div
              className="h-1 bg-muted/30 rounded-full overflow-hidden"
              data-ocid="evaluation.progress_bar"
            >
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* ── Left: Benchmark list ── */}
        <div
          className="w-72 shrink-0 flex flex-col border-r border-border/50 bg-background overflow-hidden"
          data-ocid="evaluation.benchmark_list"
        >
          <div className="flex-1 overflow-y-auto">
            {/* Normal SaaS section */}
            <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b border-border/30 px-3 py-2">
              <span className="text-[10px] font-code font-semibold text-primary uppercase tracking-widest">
                Normal SaaS
              </span>
              <span className="ml-2 text-[10px] font-code text-muted-foreground/50">
                {
                  NORMAL_PROMPTS.filter(
                    (p) => states[p.id]?.status === "success",
                  ).length
                }
                /{NORMAL_PROMPTS.length} passed
              </span>
            </div>
            <div className="p-1.5 space-y-0.5">
              {NORMAL_PROMPTS.map((prompt) => (
                <BenchmarkRow
                  key={prompt.id}
                  prompt={prompt}
                  state={states[prompt.id] ?? { status: "idle" }}
                  isSelected={selectedId === prompt.id}
                  onSelect={() => setSelectedId(prompt.id)}
                  onRun={(e) => {
                    e.stopPropagation();
                    runSingle(prompt.id);
                  }}
                />
              ))}
            </div>

            {/* Edge Cases section */}
            <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b border-border/30 border-t border-t-border/30 px-3 py-2 mt-1">
              <span className="text-[10px] font-code font-semibold text-secondary uppercase tracking-widest">
                Edge Cases
              </span>
              <span className="ml-2 text-[10px] font-code text-muted-foreground/50">
                {
                  EDGE_PROMPTS.filter((p) => states[p.id]?.status === "success")
                    .length
                }
                /{EDGE_PROMPTS.length} passed
              </span>
            </div>
            <div className="p-1.5 space-y-0.5">
              {EDGE_PROMPTS.map((prompt) => (
                <BenchmarkRow
                  key={prompt.id}
                  prompt={prompt}
                  state={states[prompt.id] ?? { status: "idle" }}
                  isSelected={selectedId === prompt.id}
                  onSelect={() => setSelectedId(prompt.id)}
                  onRun={(e) => {
                    e.stopPropagation();
                    runSingle(prompt.id);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Result panel ── */}
        <div className="flex-1 min-w-0 flex flex-col bg-background overflow-hidden">
          <ResultPanel prompt={selectedPrompt} state={selectedState} />
        </div>
      </div>

      {/* ── Aggregate stats footer ── */}
      <div className="flex-none">
        <AggregateStats states={states} />
      </div>
    </div>
  );
}
