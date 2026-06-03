import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonViewer } from "@/components/ui/json-viewer";
import { PipelineStageCard } from "@/components/ui/pipeline-stage";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompile, useExecute } from "@/hooks/useCompiler";
import {
  BENCHMARK_PROMPTS,
  EDGE_PROMPTS,
  NORMAL_PROMPTS,
} from "@/lib/benchmark-prompts";
import { cn } from "@/lib/utils";
import type {
  CompileResult,
  DeploymentCheck,
  DeploymentReport,
  RepairAction,
  ValidationError,
} from "@/types/compiler";
import { PipelineStage, PipelineStageStatus } from "@/types/compiler";
import {
  AlertCircle,
  Braces,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Cpu,
  DatabaseZap,
  FileCode2,
  Filter,
  GitCompareArrows,
  Layers,
  Lightbulb,
  ListChecks,
  Loader2,
  Play,
  Rocket,
  Sparkles,
  TriangleAlert,
  Wand2,
  Wrench,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Stage definitions ──────────────────────────────────────────────────────
const STAGE_DEFS = [
  {
    stage: PipelineStage.INTENT,
    label: "Intent Extraction",
    icon: <Braces className="h-4 w-4" />,
  },
  {
    stage: PipelineStage.DESIGN,
    label: "System Design",
    icon: <Layers className="h-4 w-4" />,
  },
  {
    stage: PipelineStage.SCHEMAS,
    label: "Schema Generation",
    icon: <DatabaseZap className="h-4 w-4" />,
  },
  {
    stage: PipelineStage.REFINEMENT,
    label: "Refinement Layer",
    icon: <Filter className="h-4 w-4" />,
  },
  {
    stage: PipelineStage.VALIDATION,
    label: "Validation Engine",
    icon: <ListChecks className="h-4 w-4" />,
  },
  {
    stage: PipelineStage.REPAIR,
    label: "Repair Engine",
    icon: <Wrench className="h-4 w-4" />,
  },
  {
    stage: PipelineStage.RUNTIME,
    label: "Runtime Execution",
    icon: <Rocket className="h-4 w-4" />,
  },
] as const;

type StageStatuses = Record<PipelineStage, PipelineStageStatus>;
type StageDurations = Partial<Record<PipelineStage, number>>;

const PENDING_STATUSES: StageStatuses = {
  [PipelineStage.INTENT]: PipelineStageStatus.PENDING,
  [PipelineStage.DESIGN]: PipelineStageStatus.PENDING,
  [PipelineStage.SCHEMAS]: PipelineStageStatus.PENDING,
  [PipelineStage.REFINEMENT]: PipelineStageStatus.PENDING,
  [PipelineStage.VALIDATION]: PipelineStageStatus.PENDING,
  [PipelineStage.REPAIR]: PipelineStageStatus.PENDING,
  [PipelineStage.RUNTIME]: PipelineStageStatus.PENDING,
};

function deriveStageStatuses(
  result: CompileResult | undefined,
  isCompiling: boolean,
  runningStage: PipelineStage | null,
  deployReport: DeploymentReport | undefined,
  isExecuting: boolean,
): StageStatuses {
  if (!result && !isCompiling) return PENDING_STATUSES;

  const s = { ...PENDING_STATUSES };

  if (isCompiling && runningStage) {
    const idx = STAGE_DEFS.findIndex((d) => d.stage === runningStage);
    STAGE_DEFS.forEach((d, i) => {
      if (i < idx) s[d.stage] = PipelineStageStatus.COMPLETED;
      else if (i === idx) s[d.stage] = PipelineStageStatus.RUNNING;
    });
    return s;
  }

  if (!result) return s;

  if (!result.success) {
    s[PipelineStage.INTENT] = result.intent
      ? PipelineStageStatus.COMPLETED
      : PipelineStageStatus.FAILED;
    s[PipelineStage.DESIGN] = result.design
      ? PipelineStageStatus.COMPLETED
      : result.intent
        ? PipelineStageStatus.FAILED
        : PipelineStageStatus.SKIPPED;
    s[PipelineStage.SCHEMAS] = result.schemas
      ? PipelineStageStatus.COMPLETED
      : result.design
        ? PipelineStageStatus.FAILED
        : PipelineStageStatus.SKIPPED;
    s[PipelineStage.REFINEMENT] = result.refinement
      ? PipelineStageStatus.COMPLETED
      : result.schemas
        ? PipelineStageStatus.FAILED
        : PipelineStageStatus.SKIPPED;
    s[PipelineStage.VALIDATION] = result.validation
      ? PipelineStageStatus.COMPLETED
      : result.refinement
        ? PipelineStageStatus.FAILED
        : PipelineStageStatus.SKIPPED;
    s[PipelineStage.REPAIR] = result.repair
      ? PipelineStageStatus.COMPLETED
      : PipelineStageStatus.SKIPPED;
    s[PipelineStage.RUNTIME] = PipelineStageStatus.SKIPPED;
    return s;
  }

  s[PipelineStage.INTENT] = result.intent
    ? PipelineStageStatus.COMPLETED
    : PipelineStageStatus.SKIPPED;
  s[PipelineStage.DESIGN] = result.design
    ? PipelineStageStatus.COMPLETED
    : PipelineStageStatus.SKIPPED;
  s[PipelineStage.SCHEMAS] = result.schemas
    ? PipelineStageStatus.COMPLETED
    : PipelineStageStatus.SKIPPED;
  s[PipelineStage.REFINEMENT] = result.refinement
    ? PipelineStageStatus.COMPLETED
    : PipelineStageStatus.SKIPPED;
  s[PipelineStage.VALIDATION] = result.validation
    ? PipelineStageStatus.COMPLETED
    : PipelineStageStatus.SKIPPED;
  s[PipelineStage.REPAIR] = result.repair
    ? PipelineStageStatus.COMPLETED
    : PipelineStageStatus.SKIPPED;
  if (isExecuting) s[PipelineStage.RUNTIME] = PipelineStageStatus.RUNNING;
  else if (deployReport)
    s[PipelineStage.RUNTIME] = PipelineStageStatus.COMPLETED;
  return s;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-center"
      data-ocid="compiler.empty_state"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
        <Cpu className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Ready to Compile
      </h3>
      <p className="text-sm text-muted-foreground max-w-md">
        Describe your application in plain English. The AI pipeline will extract
        intent, generate schemas, validate and repair issues, then produce a
        deployable configuration.
      </p>
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {[
          "CRM System",
          "E-commerce Platform",
          "Customer Helpdesk",
          "Learning Management System",
        ].map((label) => {
          const p = BENCHMARK_PROMPTS.find((bp) => bp.label === label);
          if (!p) return null;
          return (
            <span
              key={label}
              className="text-xs px-2 py-1 rounded border border-border bg-muted/30 text-muted-foreground font-code"
            >
              {p.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function ValidationItem({
  item,
  type,
}: { item: ValidationError; type: "error" | "warning" }) {
  const isError = type === "error";
  return (
    <div
      className={cn(
        "flex gap-2 p-2 rounded-md border text-xs",
        isError
          ? "border-destructive/40 bg-destructive/5"
          : "border-yellow-500/30 bg-yellow-500/5",
      )}
    >
      {isError ? (
        <XCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-px" />
      ) : (
        <TriangleAlert className="h-3.5 w-3.5 text-yellow-500 shrink-0 mt-px" />
      )}
      <div className="min-w-0">
        <span
          className={cn(
            "font-code font-semibold",
            isError ? "text-destructive" : "text-yellow-500",
          )}
        >
          [{item.error_code}]
        </span>{" "}
        <span className="text-foreground/80">{item.message}</span>
        {item.field && (
          <div className="text-muted-foreground mt-0.5">
            Field:{" "}
            <span className="font-code text-secondary">{item.field}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function RepairItem({
  repair,
  index,
}: { repair: RepairAction; index: number }) {
  return (
    <div
      className="flex gap-2 p-2 rounded-md border border-primary/20 bg-primary/5 text-xs"
      data-ocid={`compiler.repair.item.${index + 1}`}
    >
      <Wand2 className="h-3.5 w-3.5 text-primary shrink-0 mt-px" />
      <div className="min-w-0">
        <span className="font-code font-semibold text-primary">
          [{repair.repair_type}]
        </span>{" "}
        <span className="text-foreground/80">{repair.description}</span>
        <div className="text-muted-foreground mt-0.5">
          Field:{" "}
          <span className="font-code text-secondary">{repair.field}</span>
        </div>
      </div>
    </div>
  );
}

function DeployCheckItem({ check }: { check: DeploymentCheck }) {
  return (
    <div
      className={cn(
        "flex gap-2 p-2 rounded-md border text-xs",
        check.passed
          ? "border-[oklch(0.7_0.18_142/0.4)] bg-[oklch(0.7_0.18_142/0.05)]"
          : "border-destructive/40 bg-destructive/5",
      )}
    >
      {check.passed ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-[oklch(0.7_0.18_142)] shrink-0 mt-px" />
      ) : (
        <XCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-px" />
      )}
      <div className="min-w-0">
        <span
          className={cn(
            "font-code font-semibold",
            check.passed ? "text-[oklch(0.7_0.18_142)]" : "text-destructive",
          )}
        >
          {check.check_name}
        </span>
        <div className="text-muted-foreground mt-0.5">{check.detail}</div>
      </div>
    </div>
  );
}

function StageOutputAccordion({
  label,
  data,
  index,
}: { label: string; data: unknown; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-lg border border-border overflow-hidden"
      data-ocid={`compiler.stage_output.${index + 1}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full px-3 py-2 bg-muted/20 hover:bg-muted/40 transition-colors text-xs font-semibold text-foreground"
      >
        <span className="flex items-center gap-1.5">
          <FileCode2 className="h-3.5 w-3.5 text-primary" />
          {label}
        </span>
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="p-2">
          <JsonViewer data={data} height={280} defaultExpanded={false} />
        </div>
      )}
    </div>
  );
}

// ─── Tab types ───────────────────────────────────────────────────────────────
type ResultTab = "config" | "stages" | "validation" | "repairs" | "runtime";

const RESULT_TABS: { id: ResultTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "config",
    label: "Final Config",
    icon: <Braces className="h-3.5 w-3.5" />,
  },
  {
    id: "stages",
    label: "Stage Outputs",
    icon: <GitCompareArrows className="h-3.5 w-3.5" />,
  },
  {
    id: "validation",
    label: "Validation",
    icon: <ListChecks className="h-3.5 w-3.5" />,
  },
  { id: "repairs", label: "Repairs", icon: <Wand2 className="h-3.5 w-3.5" /> },
  {
    id: "runtime",
    label: "Runtime Report",
    icon: <Rocket className="h-3.5 w-3.5" />,
  },
];

// ─── Main component ──────────────────────────────────────────────────────────
export default function CompilerPage() {
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<ResultTab>("config");
  const [runningStage, setRunningStage] = useState<PipelineStage | null>(null);
  const [durations, setDurations] = useState<StageDurations>({});
  const stageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const compile = useCompile();
  const execute = useExecute();

  const result = compile.data;
  const deployReport = execute.data;
  const isCompiling = compile.isPending;
  const isExecuting = execute.isPending;
  const isRunning = isCompiling || isExecuting;

  // Simulate staged progression while compiling
  useEffect(() => {
    if (!isCompiling) {
      if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
      setRunningStage(null);
      return;
    }
    const stages = [
      PipelineStage.INTENT,
      PipelineStage.DESIGN,
      PipelineStage.SCHEMAS,
      PipelineStage.REFINEMENT,
      PipelineStage.VALIDATION,
      PipelineStage.REPAIR,
    ];
    let idx = 0;
    setRunningStage(stages[0]);
    const advance = () => {
      idx++;
      if (idx < stages.length) {
        setRunningStage(stages[idx]);
        stageTimerRef.current = setTimeout(advance, 900 + Math.random() * 600);
      }
    };
    stageTimerRef.current = setTimeout(advance, 900 + Math.random() * 600);
    return () => {
      if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
    };
  }, [isCompiling]);

  // Auto-run execute after compile succeeds
  useEffect(() => {
    if (
      result?.success &&
      result.final_config &&
      !execute.data &&
      !execute.isPending
    ) {
      execute.mutate(JSON.stringify(result.final_config));
    }
  }, [result, execute]);

  // Record approximate durations per stage when result arrives
  useEffect(() => {
    if (result?.processing_time_ms) {
      const total = Number(result.processing_time_ms);
      const avg = Math.floor(total / 6);
      const d: StageDurations = {};
      const stages = [
        PipelineStage.INTENT,
        PipelineStage.DESIGN,
        PipelineStage.SCHEMAS,
        PipelineStage.REFINEMENT,
        PipelineStage.VALIDATION,
        PipelineStage.REPAIR,
      ];
      stages.forEach((s, i) => {
        d[s] = avg + (i % 2 === 0 ? 12 : -12);
      });
      setDurations(d);
    }
  }, [result]);

  const stageStatuses = deriveStageStatuses(
    result,
    isCompiling,
    runningStage,
    deployReport,
    isExecuting,
  );

  const handleGenerate = useCallback(() => {
    if (!prompt.trim() || isRunning) return;
    compile.reset();
    execute.reset();
    setDurations({});
    setActiveTab("config");
    compile.mutate(prompt.trim());
  }, [prompt, isRunning, compile, execute]);

  const handleQuickFill = useCallback((value: string) => {
    setPrompt(value);
  }, []);

  const hasResult = !!result;
  const hasError = !!compile.error || (result && !result.success);
  const errorMsg =
    compile.error?.message ?? result?.error_message ?? "Compilation failed";

  const validationErrors = result?.validation?.errors ?? [];
  const validationWarnings = result?.validation?.warnings ?? [];
  const repairs = result?.repair?.repairs_made ?? [];
  const validationBadgeCount =
    validationErrors.length + validationWarnings.length;

  return (
    <div
      className="flex flex-col gap-5 p-5 min-h-full"
      data-ocid="compiler.page"
    >
      {/* ── PROMPT INPUT ─────────────────────────────────────────────────── */}
      <section
        className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
        data-ocid="compiler.prompt.section"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/20">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            AI App Compiler
          </h2>
          <span className="text-xs text-muted-foreground ml-1">
            — Natural Language → Deployable Config
          </span>
        </div>

        <div className="p-4 space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your application... e.g. 'Build a CRM system with contacts, deals pipeline, activity tracking for a B2B sales team'"
            className="w-full h-32 bg-background/80 border border-input rounded-lg px-3 py-2.5 text-sm text-foreground font-code placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-smooth scrollbar-dark"
            data-ocid="compiler.prompt.textarea"
          />

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={!prompt.trim() || isRunning}
              className="gap-2 min-w-[140px]"
              data-ocid="compiler.generate_button"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Compiling...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" /> Generate
                </>
              )}
            </Button>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Quick-fill:</span>
              <select
                className="h-8 bg-background border border-input rounded-md px-2 text-xs text-foreground font-code focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) handleQuickFill(e.target.value);
                }}
                data-ocid="compiler.quickfill.select"
              >
                <option value="" disabled>
                  Select benchmark prompt...
                </option>
                <optgroup label="Normal SaaS (10)">
                  {NORMAL_PROMPTS.map((p) => (
                    <option key={p.id} value={p.prompt}>
                      {p.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Edge Cases (10)">
                  {EDGE_PROMPTS.map((p) => (
                    <option key={p.id} value={p.prompt}>
                      {p.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {result && (
              <div className="ml-auto flex items-center gap-2">
                {result.success ? (
                  <Badge
                    variant="outline"
                    className="border-[oklch(0.7_0.18_142/0.5)] text-[oklch(0.7_0.18_142)] text-xs gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Compiled in {Number(result.processing_time_ms)}ms
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs gap-1">
                    <XCircle className="h-3 w-3" /> Failed
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PIPELINE VISUALIZATION ───────────────────────────────────────── */}
      <section
        className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
        data-ocid="compiler.pipeline.section"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/20">
          <Cpu className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Pipeline Visualization
          </h2>
          {isRunning && (
            <span className="text-xs font-code text-primary animate-pulse ml-auto">
              ● Processing...
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-stretch gap-0 overflow-x-auto pb-1 scrollbar-dark">
            {STAGE_DEFS.map((def, i) => (
              <PipelineStageCard
                key={def.stage}
                index={i}
                name={def.label}
                status={stageStatuses[def.stage]}
                icon={def.icon}
                duration_ms={durations[def.stage]}
                isLast={i === STAGE_DEFS.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS PANEL ─────────────────────────────────────────────────── */}
      {(hasResult || isRunning) && (
        <section
          className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
          data-ocid="compiler.results.section"
        >
          <div className="border-b border-border bg-muted/20">
            <div className="flex items-center gap-0 overflow-x-auto scrollbar-dark">
              {RESULT_TABS.map((tab) => {
                const count =
                  tab.id === "validation"
                    ? validationBadgeCount
                    : tab.id === "repairs"
                      ? repairs.length
                      : 0;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-smooth whitespace-nowrap",
                      activeTab === tab.id
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30",
                    )}
                    data-ocid={`compiler.results.${tab.id}.tab`}
                  >
                    {tab.icon} {tab.label}
                    {count > 0 && (
                      <span
                        className={cn(
                          "ml-0.5 px-1.5 py-px text-[10px] rounded-full font-code",
                          tab.id === "validation" && validationErrors.length > 0
                            ? "bg-destructive/20 text-destructive"
                            : "bg-primary/20 text-primary",
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4">
            {/* Loading skeleton */}
            {isCompiling && (
              <div
                className="space-y-3"
                data-ocid="compiler.results.loading_state"
              >
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-48 w-full mt-4" />
              </div>
            )}

            {/* Error state */}
            {!isCompiling && hasError && (
              <div
                className="flex gap-3 p-4 rounded-lg border border-destructive/40 bg-destructive/5"
                data-ocid="compiler.results.error_state"
              >
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-px" />
                <div>
                  <p className="text-sm font-semibold text-destructive mb-1">
                    Compilation Failed
                  </p>
                  <p className="text-xs text-muted-foreground font-code">
                    {errorMsg}
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Final Config */}
            {!isCompiling && activeTab === "config" && result && (
              <div data-ocid="compiler.config.panel">
                {result.final_config ? (
                  <JsonViewer
                    data={result.final_config}
                    title="AppConfig"
                    height={480}
                    defaultExpanded
                  />
                ) : (
                  <p className="text-xs text-muted-foreground font-code italic">
                    No final config produced.
                  </p>
                )}
              </div>
            )}

            {/* Tab: Stage Outputs */}
            {!isCompiling && activeTab === "stages" && result && (
              <div className="space-y-2" data-ocid="compiler.stages.panel">
                {result.intent && (
                  <StageOutputAccordion
                    label="1. Intent Extraction"
                    data={result.intent}
                    index={0}
                  />
                )}
                {result.design && (
                  <StageOutputAccordion
                    label="2. System Design"
                    data={result.design}
                    index={1}
                  />
                )}
                {result.schemas && (
                  <StageOutputAccordion
                    label="3. Schema Generation"
                    data={result.schemas}
                    index={2}
                  />
                )}
                {result.refinement && (
                  <StageOutputAccordion
                    label="4. Refinement Layer"
                    data={result.refinement}
                    index={3}
                  />
                )}
                {result.validation && (
                  <StageOutputAccordion
                    label="5. Validation Engine"
                    data={result.validation}
                    index={4}
                  />
                )}
                {result.repair && (
                  <StageOutputAccordion
                    label="6. Repair Engine"
                    data={result.repair}
                    index={5}
                  />
                )}
                {!result.intent && !result.design && (
                  <p className="text-xs text-muted-foreground font-code italic">
                    No stage outputs available.
                  </p>
                )}
              </div>
            )}

            {/* Tab: Validation */}
            {!isCompiling && activeTab === "validation" && result && (
              <div className="space-y-3" data-ocid="compiler.validation.panel">
                {validationErrors.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-destructive flex items-center gap-1.5">
                      <XCircle className="h-3.5 w-3.5" /> Errors (
                      {validationErrors.length})
                    </h3>
                    {validationErrors.map((e, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: validation errors are positional
                      <ValidationItem key={i} item={e} type="error" />
                    ))}
                  </div>
                )}
                {validationWarnings.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-yellow-500 flex items-center gap-1.5">
                      <TriangleAlert className="h-3.5 w-3.5" /> Warnings (
                      {validationWarnings.length})
                    </h3>
                    {validationWarnings.map((w, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: validation warnings are positional
                      <ValidationItem key={i} item={w} type="warning" />
                    ))}
                  </div>
                )}
                {validationErrors.length === 0 &&
                  validationWarnings.length === 0 && (
                    <div
                      className="flex items-center gap-2 text-[oklch(0.7_0.18_142)] text-sm"
                      data-ocid="compiler.validation.empty_state"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>No validation errors or warnings.</span>
                    </div>
                  )}
                {result.validation && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className={
                        result.validation.is_valid
                          ? "border-[oklch(0.7_0.18_142/0.5)] text-[oklch(0.7_0.18_142)]"
                          : "border-destructive/50 text-destructive"
                      }
                    >
                      {result.validation.is_valid ? "Valid" : "Invalid"}
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Repairs */}
            {!isCompiling && activeTab === "repairs" && result && (
              <div className="space-y-2" data-ocid="compiler.repairs.panel">
                {repairs.length > 0 ? (
                  <>
                    <h3 className="text-xs font-semibold text-primary flex items-center gap-1.5 mb-2">
                      <Wand2 className="h-3.5 w-3.5" /> Repairs Made (
                      {repairs.length})
                    </h3>
                    {repairs.map((r, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: repairs are positional
                      <RepairItem key={i} repair={r} index={i} />
                    ))}
                  </>
                ) : (
                  <div
                    className="flex items-center gap-2 text-[oklch(0.7_0.18_142)] text-sm"
                    data-ocid="compiler.repairs.empty_state"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>No repairs were necessary.</span>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Runtime Report */}
            {!isCompiling && activeTab === "runtime" && (
              <div className="space-y-3" data-ocid="compiler.runtime.panel">
                {isExecuting && (
                  <div
                    className="space-y-2"
                    data-ocid="compiler.runtime.loading_state"
                  >
                    <div className="flex items-center gap-2 text-primary text-xs">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="font-code">
                        Running deployment simulation...
                      </span>
                    </div>
                    <Skeleton className="h-24 w-full" />
                  </div>
                )}
                {execute.error && !isExecuting && (
                  <div
                    className="flex gap-3 p-3 rounded-lg border border-destructive/40 bg-destructive/5"
                    data-ocid="compiler.runtime.error_state"
                  >
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-px" />
                    <p className="text-xs text-destructive font-code">
                      {execute.error.message}
                    </p>
                  </div>
                )}
                {deployReport && !isExecuting && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-code gap-1",
                          deployReport.status === "READY"
                            ? "border-[oklch(0.7_0.18_142/0.5)] text-[oklch(0.7_0.18_142)]"
                            : "border-yellow-500/50 text-yellow-500",
                        )}
                      >
                        <Zap className="h-3 w-3" /> {deployReport.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Readiness Score:{" "}
                        <span className="font-code font-bold text-foreground">
                          {Number(deployReport.readiness_score)}%
                        </span>
                      </span>
                    </div>
                    {deployReport.checks.length > 0 && (
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Deployment Checks
                        </h3>
                        {deployReport.checks.map((check, i) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: checks are positional
                          <DeployCheckItem key={i} check={check} />
                        ))}
                      </div>
                    )}
                    {deployReport.warnings.length > 0 && (
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">
                          Warnings
                        </h3>
                        {deployReport.warnings.map((w, i) => (
                          <div
                            // biome-ignore lint/suspicious/noArrayIndexKey: warnings are positional
                            key={i}
                            className="flex gap-2 p-2 rounded-md border border-yellow-500/30 bg-yellow-500/5 text-xs text-foreground/80"
                          >
                            <TriangleAlert className="h-3.5 w-3.5 text-yellow-500 shrink-0 mt-px" />
                            {w}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {!deployReport && !isExecuting && !execute.error && (
                  <p
                    className="text-xs text-muted-foreground font-code italic"
                    data-ocid="compiler.runtime.empty_state"
                  >
                    Runtime report will appear after compilation completes.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── ASSUMPTIONS PANEL ────────────────────────────────────────────── */}
      {result && result.assumptions.length > 0 && (
        <section
          className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
          data-ocid="compiler.assumptions.section"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/20">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <h2 className="text-sm font-semibold text-foreground">
              Assumptions Made
            </h2>
            <Badge
              variant="outline"
              className="ml-1 text-xs border-yellow-500/40 text-yellow-500"
            >
              {result.assumptions.length}
            </Badge>
          </div>
          <ul className="p-4 space-y-1.5">
            {result.assumptions.map((assumption, i) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: assumptions are positional
                key={i}
                className="flex gap-2 text-xs text-foreground/80"
                data-ocid={`compiler.assumption.item.${i + 1}`}
              >
                <span className="text-yellow-500 font-code shrink-0">
                  {i + 1}.
                </span>
                <span>{assumption}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── EMPTY STATE ──────────────────────────────────────────────────── */}
      {!hasResult && !isRunning && <EmptyState />}
    </div>
  );
}
