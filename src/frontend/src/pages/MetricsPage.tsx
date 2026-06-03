import { useMetrics } from "@/hooks/useCompiler";
import type { FailureType, MetricsResult } from "@/types/compiler";
import {
  Activity,
  BarChart3,
  Clock,
  RefreshCw,
  Shield,
  Wrench,
  Zap,
} from "lucide-react";

// ─── KPI Card ────────────────────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

function KpiCard({
  label,
  value,
  icon,
  colorClass,
  bgClass,
  borderClass,
}: KpiCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border ${borderClass} ${bgClass} p-4 flex flex-col gap-2`}
    >
      <div
        className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest ${colorClass} opacity-70`}
      >
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div
        className={`font-mono text-3xl font-bold tracking-tight ${colorClass}`}
      >
        {value}
      </div>
      <div
        className="absolute bottom-0 left-0 h-[2px] w-full opacity-40"
        style={{ background: "currentColor" }}
      />
    </div>
  );
}

// ─── CSS Bar Chart Row ───────────────────────────────────────────────────────
interface BarChartRowProps {
  label: string;
  count: bigint;
  maxCount: bigint;
  index: number;
}

const BAR_GRADIENTS = [
  "from-primary to-primary/50",
  "from-secondary to-secondary/50",
  "from-chart-3 to-chart-3/50",
  "from-chart-4 to-chart-4/50",
  "from-destructive to-destructive/50",
];

function BarChartRow({ label, count, maxCount, index }: BarChartRowProps) {
  const pct = maxCount === 0n ? 0 : Number((count * 100n) / maxCount);
  const gradient = BAR_GRADIENTS[index % BAR_GRADIENTS.length];

  return (
    <div
      className="flex flex-col gap-1.5"
      data-ocid={`metrics.failure_type.item.${index + 1}`}
    >
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-muted-foreground truncate max-w-[160px]">
          {label}
        </span>
        <span className="text-foreground font-bold tabular-nums ml-2">
          {count.toString()}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
interface ProgressBarProps {
  label: string;
  pct: number;
  gradient: string;
}

function ProgressBar({ label, pct, gradient }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold text-foreground tabular-nums">
          {clamped.toFixed(1)}%
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-20 text-center"
      data-ocid="metrics.empty_state"
    >
      <BarChart3 className="h-12 w-12 text-primary/30" />
      <p className="font-mono text-lg text-muted-foreground">No data yet</p>
      <p className="max-w-xs text-sm text-muted-foreground/60 font-mono">
        Run a compilation on the Compiler page to start collecting metrics.
      </p>
    </div>
  );
}

// ─── MetricsPage ──────────────────────────────────────────────────────────────
export default function MetricsPage() {
  const { data, isLoading, error, dataUpdatedAt, isFetching } = useMetrics();

  const metrics: MetricsResult | undefined = data;

  const total = metrics?.total_compilations ?? 0n;
  const successful = metrics?.successful_compilations ?? 0n;
  const validationErrors = metrics?.validation_errors_total ?? 0n;
  const repairs = metrics?.repairs_made_total ?? 0n;
  const avgTime = metrics?.average_processing_time_ms ?? 0n;
  const failureTypes: FailureType[] = metrics?.failure_types ?? [];

  const successRatePct =
    total === 0n ? 0 : Number((successful * 1000n) / total) / 10;
  const validationPassPct =
    total === 0n
      ? 0
      : Number(((total - validationErrors) * 1000n) / total) / 10;
  const repairRatePct =
    total === 0n ? 0 : Number((repairs * 1000n) / total) / 10;

  const maxFailureCount =
    failureTypes.length > 0
      ? failureTypes.reduce((acc, ft) => (ft.count > acc ? ft.count : acc), 0n)
      : 0n;

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString()
    : "—";

  const kpis = [
    {
      label: "Total Compilations",
      value: total.toString(),
      icon: <Activity className="h-3 w-3" />,
      colorClass: "text-primary",
      bgClass: "bg-primary/5",
      borderClass: "border-primary/20",
    },
    {
      label: "Successful",
      value: successful.toString(),
      icon: <Zap className="h-3 w-3" />,
      colorClass: "text-chart-3",
      bgClass: "bg-chart-3/5",
      borderClass: "border-chart-3/20",
    },
    {
      label: "Validation Errors",
      value: validationErrors.toString(),
      icon: <Shield className="h-3 w-3" />,
      colorClass: "text-destructive",
      bgClass: "bg-destructive/5",
      borderClass: "border-destructive/20",
    },
    {
      label: "Repairs Made",
      value: repairs.toString(),
      icon: <Wrench className="h-3 w-3" />,
      colorClass: "text-secondary",
      bgClass: "bg-secondary/5",
      borderClass: "border-secondary/20",
    },
    {
      label: "Avg Time (ms)",
      value: avgTime.toString(),
      icon: <Clock className="h-3 w-3" />,
      colorClass: "text-chart-5",
      bgClass: "bg-chart-5/5",
      borderClass: "border-chart-5/20",
    },
    {
      label: "Success Rate",
      value: `${successRatePct.toFixed(1)}%`,
      icon: <BarChart3 className="h-3 w-3" />,
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      borderClass: "border-primary/30",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6" data-ocid="metrics.page">
      {/* ── Header ── */}
      <div
        className="flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between"
        data-ocid="metrics.section"
      >
        <div>
          <h1 className="font-mono text-xl font-bold tracking-tight text-foreground">
            System Metrics
          </h1>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            Pipeline performance &amp; compilation analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            Updated: {lastUpdated}
          </span>
          <div
            className={`flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary ${
              isFetching ? "animate-pulse" : ""
            }`}
            data-ocid="metrics.loading_state"
          >
            <RefreshCw
              className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>{isFetching ? "Refreshing…" : "Auto-refresh 30s"}</span>
          </div>
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton tiles
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div
          className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 font-mono text-sm text-destructive"
          data-ocid="metrics.error_state"
        >
          Failed to load metrics: {error.message}
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && !error && total === 0n && <EmptyState />}

      {/* ── Main content (data present) ── */}
      {!isLoading && total > 0n && (
        <>
          {/* KPI cards */}
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
            data-ocid="metrics.panel"
          >
            {kpis.map((kpi, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: stable KPI order
              <KpiCard key={i} {...kpi} />
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Failure Type Breakdown */}
            <div
              className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4"
              data-ocid="metrics.failure_breakdown.card"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h2 className="font-mono text-sm font-semibold text-foreground">
                  Failure Type Breakdown
                </h2>
              </div>
              {failureTypes.length === 0 ? (
                <p className="py-6 text-center font-mono text-xs text-muted-foreground">
                  No failures recorded
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {failureTypes.map((ft, i) => (
                    <BarChartRow
                      // biome-ignore lint/suspicious/noArrayIndexKey: ordered list
                      key={i}
                      label={ft.type_name}
                      count={ft.count}
                      maxCount={maxFailureCount}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Success Rate Visual */}
            <div
              className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4"
              data-ocid="metrics.success_rate.card"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <h2 className="font-mono text-sm font-semibold text-foreground">
                  Success Rate Visual
                </h2>
              </div>

              {/* SVG donut ring */}
              <div className="flex items-center justify-center py-2">
                <div className="relative flex h-32 w-32 items-center justify-center">
                  <svg
                    className="absolute inset-0 -rotate-90"
                    viewBox="0 0 128 128"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      strokeWidth="10"
                      className="stroke-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      strokeWidth="10"
                      strokeLinecap="round"
                      className="stroke-primary transition-all duration-700"
                      strokeDasharray={`${339.3 * (successRatePct / 100)} 339.3`}
                    />
                  </svg>
                  <div className="flex flex-col items-center z-10">
                    <span className="font-mono text-2xl font-bold text-primary">
                      {successRatePct.toFixed(0)}%
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      success
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail progress bars */}
              <div className="flex flex-col gap-3">
                <ProgressBar
                  label="Compilations success"
                  pct={successRatePct}
                  gradient="from-primary to-primary/50"
                />
                <ProgressBar
                  label="Validation pass rate"
                  pct={validationPassPct}
                  gradient="from-chart-3 to-chart-3/50"
                />
                <ProgressBar
                  label="Repair rate"
                  pct={repairRatePct}
                  gradient="from-secondary to-secondary/50"
                />
              </div>
            </div>
          </div>

          {/* System Info */}
          <div
            className="rounded-lg border border-border bg-muted/30 p-5"
            data-ocid="metrics.system_info.panel"
          >
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h2 className="font-mono text-sm font-semibold text-foreground">
                System Info
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ["Platform", "Internet Computer"],
                  ["Architecture", "6-Stage Compilation Pipeline"],
                  [
                    "Stages",
                    "Intent → Design → Schema → Refine → Validate → Repair → Execute",
                  ],
                  ["Storage", "Canister State (Stable Memory)"],
                ] as [string, string][]
              ).map(([key, val]) => (
                <div key={key} className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {key}
                  </span>
                  <span className="font-mono text-xs text-foreground break-words">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
