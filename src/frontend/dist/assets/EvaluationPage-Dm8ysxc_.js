import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, C as ChevronRight } from "./index-XVEsl6Ym.js";
import { b as useRunBenchmark } from "./useCompiler-nVVg-t8k.js";
import { B as BENCHMARK_PROMPTS, N as NORMAL_PROMPTS, E as EDGE_PROMPTS, P as Play, C as CircleX } from "./benchmark-prompts-uGGiVe_J.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polygon", { points: "10 8 16 12 10 16 10 8", key: "1cimsy" }]
];
const CirclePlay = createLucideIcon("circle-play", __iconNode);
function formatMs(ms) {
  if (ms === void 0) return "—";
  return `${Number(ms).toLocaleString()} ms`;
}
function StatusDot({ status }) {
  if (status === "idle")
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-muted-foreground/40 shrink-0" });
  if (status === "running")
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-primary shrink-0 animate-pulse" });
  if (status === "success")
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 shrink-0" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-destructive shrink-0" });
}
function StatusBadge({ success }) {
  return success ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-code font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3" }),
    " PASS"
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-code font-semibold px-2 py-0.5 rounded bg-destructive/15 text-destructive border border-destructive/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" }),
    " FAIL"
  ] });
}
function JsonViewer({ label, value }) {
  const [open, setOpen] = reactExports.useState(false);
  const json = JSON.stringify(
    value,
    (_, v) => typeof v === "bigint" ? Number(v) : v,
    2
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/50 rounded overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((o) => !o),
        className: "w-full flex items-center justify-between px-3 py-2 bg-muted/20 text-xs font-code text-muted-foreground hover:bg-muted/30 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary/80", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronRight,
            {
              className: `w-3.5 h-3.5 transition-transform ${open ? "rotate-90" : ""}`
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-[10px] font-code text-foreground/70 bg-muted/10 p-3 overflow-auto max-h-48 leading-relaxed", children: json })
  ] });
}
function ResultPanel({
  prompt,
  state
}) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  if (!prompt || !state || state.status === "idle") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center h-full text-center p-8",
        "data-ocid": "evaluation.result_panel.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "w-6 h-6 text-primary/50" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-code text-muted-foreground", children: "Select a benchmark and run it" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/50 mt-1 font-code", children: "Results will appear here" })
        ]
      }
    );
  }
  if (state.status === "running") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center h-full",
        "data-ocid": "evaluation.result_panel.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-code text-primary animate-pulse", children: "Running…" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 font-code", children: prompt.label })
        ]
      }
    );
  }
  const r = state.result;
  if (!r) return null;
  const validationErrors = ((_b = (_a = r.validation) == null ? void 0 : _a.errors) == null ? void 0 : _b.length) ?? 0;
  const repairs = ((_d = (_c = r.repair) == null ? void 0 : _c.repairs_made) == null ? void 0 : _d.length) ?? 0;
  const assumptions = r.assumptions ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 space-y-4 overflow-auto h-full",
      "data-ocid": "evaluation.result_panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-code font-bold text-foreground truncate", children: prompt.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-code mt-0.5 capitalize", children: prompt.category === "edge" ? "Edge Case" : "Normal SaaS" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { success: r.success })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 border border-border/50 rounded p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-code text-muted-foreground uppercase tracking-wider mb-1", children: "Processing Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-code font-bold text-primary", children: formatMs(r.processing_time_ms) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 border border-border/50 rounded p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-code text-muted-foreground uppercase tracking-wider mb-1", children: "Validation Errors" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-base font-code font-bold ${validationErrors > 0 ? "text-destructive" : "text-emerald-400"}`,
                children: validationErrors
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 border border-border/50 rounded p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-code text-muted-foreground uppercase tracking-wider mb-1", children: "Repairs Made" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-base font-code font-bold ${repairs > 0 ? "text-yellow-400" : "text-emerald-400"}`,
                children: repairs
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 border border-border/50 rounded p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-code text-muted-foreground uppercase tracking-wider mb-1", children: "Assumptions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-code font-bold text-secondary", children: assumptions.length })
          ] })
        ] }),
        r.error_message && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-destructive/10 border border-destructive/30 rounded p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-code text-destructive font-semibold uppercase mb-1", children: "Error" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-code text-destructive/80 break-words", children: r.error_message })
        ] }),
        assumptions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/50 rounded p-3 bg-muted/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-code text-muted-foreground uppercase tracking-wider mb-2", children: [
            "Assumptions (",
            assumptions.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: assumptions.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "text-xs font-code text-foreground/70 flex gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary shrink-0", children: "›" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-words", children: a })
              ]
            },
            i
          )) })
        ] }),
        r.final_config && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/50 rounded p-3 bg-muted/10 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-code text-muted-foreground uppercase tracking-wider mb-2", children: "Generated Config" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-code text-foreground/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "app_name" }),
            ":",
            " ",
            r.final_config.app_name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-code text-foreground/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "entities" }),
            ":",
            " ",
            ((_e = r.final_config.entities) == null ? void 0 : _e.length) ?? 0
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-code text-foreground/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "roles" }),
            ":",
            " ",
            ((_f = r.final_config.roles) == null ? void 0 : _f.length) ?? 0
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-code text-foreground/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "pages" }),
            ":",
            " ",
            ((_g = r.final_config.pages) == null ? void 0 : _g.length) ?? 0
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-code text-foreground/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "api_endpoints" }),
            ":",
            " ",
            ((_i = (_h = r.final_config.api) == null ? void 0 : _h.endpoints) == null ? void 0 : _i.length) ?? 0
          ] })
        ] }),
        r.intent && /* @__PURE__ */ jsxRuntimeExports.jsx(JsonViewer, { label: "Intent Extraction", value: r.intent }),
        r.validation && /* @__PURE__ */ jsxRuntimeExports.jsx(JsonViewer, { label: "Validation Result", value: r.validation }),
        r.repair && /* @__PURE__ */ jsxRuntimeExports.jsx(JsonViewer, { label: "Repair Result", value: r.repair })
      ]
    }
  );
}
function BenchmarkRow({
  prompt,
  state,
  isSelected,
  onSelect,
  onRun
}) {
  const truncatedPrompt = prompt.prompt.length > 80 ? `${prompt.prompt.slice(0, 80)}…` : prompt.prompt;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: onSelect,
      className: `w-full text-left flex items-start gap-3 px-3 py-2.5 rounded transition-colors group ${isSelected ? "bg-primary/15 border border-primary/30" : "border border-transparent hover:bg-muted/30 hover:border-border/40"}`,
      "data-ocid": `evaluation.benchmark.item.${prompt.id + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0 mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusDot, { status: state.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-code text-muted-foreground/60 w-5 text-right", children: prompt.id + 1 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-xs font-code font-semibold truncate ${isSelected ? "text-primary" : "text-foreground"}`,
              children: prompt.label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-code text-muted-foreground/60 mt-0.5 leading-relaxed line-clamp-2", children: truncatedPrompt })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onRun,
            disabled: state.status === "running",
            className: "shrink-0 w-6 h-6 flex items-center justify-center rounded text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 focus:opacity-100",
            "data-ocid": `evaluation.benchmark.run_button.${prompt.id + 1}`,
            "aria-label": `Run ${prompt.label}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3" })
          }
        )
      ]
    }
  );
}
function AggregateStats({
  states
}) {
  const completed = Object.values(states).filter(
    (s) => s.status === "success" || s.status === "failed"
  );
  if (completed.length === 0) return null;
  const passed = completed.filter((s) => {
    var _a;
    return (_a = s.result) == null ? void 0 : _a.success;
  }).length;
  const successRate = Math.round(passed / completed.length * 100);
  const totalErrors = completed.reduce(
    (acc, s) => {
      var _a, _b, _c;
      return acc + (((_c = (_b = (_a = s.result) == null ? void 0 : _a.validation) == null ? void 0 : _b.errors) == null ? void 0 : _c.length) ?? 0);
    },
    0
  );
  const totalRepairs = completed.reduce(
    (acc, s) => {
      var _a, _b, _c;
      return acc + (((_c = (_b = (_a = s.result) == null ? void 0 : _a.repair) == null ? void 0 : _b.repairs_made) == null ? void 0 : _c.length) ?? 0);
    },
    0
  );
  const avgTime = completed.length > 0 ? Math.round(
    completed.reduce(
      (acc, s) => {
        var _a;
        return acc + Number(((_a = s.result) == null ? void 0 : _a.processing_time_ms) ?? 0);
      },
      0
    ) / completed.length
  ) : 0;
  const totalFailed = completed.filter((s) => {
    var _a;
    return !((_a = s.result) == null ? void 0 : _a.success);
  }).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border-t border-border/50 bg-card/50 rounded-b-lg p-4",
      "data-ocid": "evaluation.aggregate_stats",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-[10px] font-code text-muted-foreground uppercase tracking-widest mb-3", children: [
          "Aggregate Results — ",
          completed.length,
          "/",
          BENCHMARK_PROMPTS.length,
          " ",
          "completed"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 border border-border/50 rounded p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: `text-2xl font-code font-bold ${successRate >= 80 ? "text-emerald-400" : successRate >= 50 ? "text-yellow-400" : "text-destructive"}`,
                children: [
                  successRate,
                  "%"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-code text-muted-foreground mt-1 uppercase tracking-wider", children: "Success Rate" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 border border-border/50 rounded p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-2xl font-code font-bold ${totalErrors > 0 ? "text-destructive" : "text-emerald-400"}`,
                children: totalErrors
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-code text-muted-foreground mt-1 uppercase tracking-wider", children: "Total Errors" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 border border-border/50 rounded p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-2xl font-code font-bold ${totalRepairs > 0 ? "text-yellow-400" : "text-emerald-400"}`,
                children: totalRepairs
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-code text-muted-foreground mt-1 uppercase tracking-wider", children: "Repairs Made" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 border border-border/50 rounded p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-code font-bold text-primary", children: avgTime.toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-code text-muted-foreground mt-1 uppercase tracking-wider", children: "Avg ms" })
          ] })
        ] }),
        totalFailed > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-code text-muted-foreground/60 uppercase tracking-wider self-center", children: "Failures:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-code px-2 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20", children: [
            totalFailed,
            " total failed"
          ] })
        ] })
      ]
    }
  );
}
function EvaluationPage() {
  const runBenchmark = useRunBenchmark();
  const [states, setStates] = reactExports.useState(
    () => Object.fromEntries(
      BENCHMARK_PROMPTS.map((p) => [p.id, { status: "idle" }])
    )
  );
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [isRunningAll, setIsRunningAll] = reactExports.useState(false);
  const [runAllProgress, setRunAllProgress] = reactExports.useState(0);
  const abortRef = reactExports.useRef(false);
  const runSingle = reactExports.useCallback(
    async (index) => {
      setStates((prev) => ({
        ...prev,
        [index]: { status: "running" }
      }));
      setSelectedId(index);
      try {
        const result = await runBenchmark.mutateAsync(index);
        setStates((prev) => ({
          ...prev,
          [index]: { status: result.success ? "success" : "failed", result }
        }));
      } catch (err) {
        setStates((prev) => ({
          ...prev,
          [index]: {
            status: "failed",
            error: err instanceof Error ? err.message : "Unknown error"
          }
        }));
      }
    },
    [runBenchmark]
  );
  const handleRunAll = reactExports.useCallback(async () => {
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
  const progressPct = isRunningAll ? Math.round(runAllProgress / BENCHMARK_PROMPTS.length * 100) : 0;
  const selectedState = selectedId !== null ? states[selectedId] ?? null : null;
  const selectedPrompt = selectedId !== null ? BENCHMARK_PROMPTS.find((p) => p.id === selectedId) ?? null : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "evaluation.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-none border-b border-border/50 bg-card/50 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-code text-secondary bg-secondary/10 border border-secondary/30 px-2 py-0.5 rounded", children: "20 PROMPTS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold font-code text-foreground", children: "Evaluation Dashboard" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-code mt-0.5", children: "10 normal SaaS · 10 edge cases" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleRunAll,
            disabled: !isRunningAll && runBenchmark.isPending,
            className: `flex items-center gap-2 px-4 py-2 rounded text-xs font-code font-semibold transition-colors ${isRunningAll ? "bg-destructive/20 text-destructive border border-destructive/40 hover:bg-destructive/30" : "bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30"} disabled:opacity-50 disabled:cursor-not-allowed`,
            "data-ocid": "evaluation.run_all_button",
            children: isRunningAll ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-sm bg-destructive/70" }),
              "Stop (",
              runAllProgress,
              "/",
              BENCHMARK_PROMPTS.length,
              ")"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "w-3.5 h-3.5" }),
              "Run All Benchmarks"
            ] })
          }
        )
      ] }),
      isRunningAll && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-code text-muted-foreground", children: [
            "Running benchmark ",
            runAllProgress + 1,
            " of",
            " ",
            BENCHMARK_PROMPTS.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-code text-primary", children: [
            progressPct,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-1 bg-muted/30 rounded-full overflow-hidden",
            "data-ocid": "evaluation.progress_bar",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-primary rounded-full transition-all duration-300",
                style: { width: `${progressPct}%` }
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex min-h-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-72 shrink-0 flex flex-col border-r border-border/50 bg-background overflow-hidden",
          "data-ocid": "evaluation.benchmark_list",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b border-border/30 px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-code font-semibold text-primary uppercase tracking-widest", children: "Normal SaaS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-[10px] font-code text-muted-foreground/50", children: [
                NORMAL_PROMPTS.filter(
                  (p) => {
                    var _a;
                    return ((_a = states[p.id]) == null ? void 0 : _a.status) === "success";
                  }
                ).length,
                "/",
                NORMAL_PROMPTS.length,
                " passed"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 space-y-0.5", children: NORMAL_PROMPTS.map((prompt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              BenchmarkRow,
              {
                prompt,
                state: states[prompt.id] ?? { status: "idle" },
                isSelected: selectedId === prompt.id,
                onSelect: () => setSelectedId(prompt.id),
                onRun: (e) => {
                  e.stopPropagation();
                  runSingle(prompt.id);
                }
              },
              prompt.id
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b border-border/30 border-t border-t-border/30 px-3 py-2 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-code font-semibold text-secondary uppercase tracking-widest", children: "Edge Cases" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-[10px] font-code text-muted-foreground/50", children: [
                EDGE_PROMPTS.filter((p) => {
                  var _a;
                  return ((_a = states[p.id]) == null ? void 0 : _a.status) === "success";
                }).length,
                "/",
                EDGE_PROMPTS.length,
                " passed"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 space-y-0.5", children: EDGE_PROMPTS.map((prompt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              BenchmarkRow,
              {
                prompt,
                state: states[prompt.id] ?? { status: "idle" },
                isSelected: selectedId === prompt.id,
                onSelect: () => setSelectedId(prompt.id),
                onRun: (e) => {
                  e.stopPropagation();
                  runSingle(prompt.id);
                }
              },
              prompt.id
            )) })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0 flex flex-col bg-background overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResultPanel, { prompt: selectedPrompt, state: selectedState }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AggregateStats, { states }) })
  ] });
}
export {
  EvaluationPage as default
};
