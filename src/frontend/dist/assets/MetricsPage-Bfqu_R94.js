import { c as createLucideIcon, j as jsxRuntimeExports, e as ChartColumn } from "./index-XVEsl6Ym.js";
import { c as useMetrics } from "./useCompiler-nVVg-t8k.js";
import { Z as Zap, W as Wrench, C as Clock } from "./zap-CKPIcdNR.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode);
function KpiCard({
  label,
  value,
  icon,
  colorClass,
  bgClass,
  borderClass
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `relative overflow-hidden rounded-lg border ${borderClass} ${bgClass} p-4 flex flex-col gap-2`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest ${colorClass} opacity-70`,
            children: [
              icon,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: label })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `font-mono text-3xl font-bold tracking-tight ${colorClass}`,
            children: value
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute bottom-0 left-0 h-[2px] w-full opacity-40",
            style: { background: "currentColor" }
          }
        )
      ]
    }
  );
}
const BAR_GRADIENTS = [
  "from-primary to-primary/50",
  "from-secondary to-secondary/50",
  "from-chart-3 to-chart-3/50",
  "from-chart-4 to-chart-4/50",
  "from-destructive to-destructive/50"
];
function BarChartRow({ label, count, maxCount, index }) {
  const pct = maxCount === 0n ? 0 : Number(count * 100n / maxCount);
  const gradient = BAR_GRADIENTS[index % BAR_GRADIENTS.length];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-1.5",
      "data-ocid": `metrics.failure_type.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs font-mono", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate max-w-[160px]", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold tabular-nums ml-2", children: count.toString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`,
            style: { width: `${pct}%` }
          }
        ) })
      ]
    }
  );
}
function ProgressBar({ label, pct, gradient }) {
  const clamped = Math.min(100, Math.max(0, pct));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs font-mono", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground tabular-nums", children: [
        clamped.toFixed(1),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`,
        style: { width: `${clamped}%` }
      }
    ) })
  ] });
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center gap-4 py-20 text-center",
      "data-ocid": "metrics.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-12 w-12 text-primary/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-lg text-muted-foreground", children: "No data yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-xs text-sm text-muted-foreground/60 font-mono", children: "Run a compilation on the Compiler page to start collecting metrics." })
      ]
    }
  );
}
function MetricsPage() {
  const { data, isLoading, error, dataUpdatedAt, isFetching } = useMetrics();
  const metrics = data;
  const total = (metrics == null ? void 0 : metrics.total_compilations) ?? 0n;
  const successful = (metrics == null ? void 0 : metrics.successful_compilations) ?? 0n;
  const validationErrors = (metrics == null ? void 0 : metrics.validation_errors_total) ?? 0n;
  const repairs = (metrics == null ? void 0 : metrics.repairs_made_total) ?? 0n;
  const avgTime = (metrics == null ? void 0 : metrics.average_processing_time_ms) ?? 0n;
  const failureTypes = (metrics == null ? void 0 : metrics.failure_types) ?? [];
  const successRatePct = total === 0n ? 0 : Number(successful * 1000n / total) / 10;
  const validationPassPct = total === 0n ? 0 : Number((total - validationErrors) * 1000n / total) / 10;
  const repairRatePct = total === 0n ? 0 : Number(repairs * 1000n / total) / 10;
  const maxFailureCount = failureTypes.length > 0 ? failureTypes.reduce((acc, ft) => ft.count > acc ? ft.count : acc, 0n) : 0n;
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "—";
  const kpis = [
    {
      label: "Total Compilations",
      value: total.toString(),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-3 w-3" }),
      colorClass: "text-primary",
      bgClass: "bg-primary/5",
      borderClass: "border-primary/20"
    },
    {
      label: "Successful",
      value: successful.toString(),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }),
      colorClass: "text-chart-3",
      bgClass: "bg-chart-3/5",
      borderClass: "border-chart-3/20"
    },
    {
      label: "Validation Errors",
      value: validationErrors.toString(),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3" }),
      colorClass: "text-destructive",
      bgClass: "bg-destructive/5",
      borderClass: "border-destructive/20"
    },
    {
      label: "Repairs Made",
      value: repairs.toString(),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "h-3 w-3" }),
      colorClass: "text-secondary",
      bgClass: "bg-secondary/5",
      borderClass: "border-secondary/20"
    },
    {
      label: "Avg Time (ms)",
      value: avgTime.toString(),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
      colorClass: "text-chart-5",
      bgClass: "bg-chart-5/5",
      borderClass: "border-chart-5/20"
    },
    {
      label: "Success Rate",
      value: `${successRatePct.toFixed(1)}%`,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-3 w-3" }),
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      borderClass: "border-primary/30"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-6", "data-ocid": "metrics.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between",
        "data-ocid": "metrics.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-mono text-xl font-bold tracking-tight text-foreground", children: "System Metrics" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 font-mono text-xs text-muted-foreground", children: "Pipeline performance & compilation analytics" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
              "Updated: ",
              lastUpdated
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary ${isFetching ? "animate-pulse" : ""}`,
                "data-ocid": "metrics.loading_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RefreshCw,
                    {
                      className: `h-3 w-3 ${isFetching ? "animate-spin" : ""}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isFetching ? "Refreshing…" : "Auto-refresh 30s" })
                ]
              }
            )
          ] })
        ]
      }
    ),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6", children: Array.from({ length: 6 }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton tiles
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 animate-pulse rounded-lg bg-muted" }, i)
    )) }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-lg border border-destructive/30 bg-destructive/10 p-4 font-mono text-sm text-destructive",
        "data-ocid": "metrics.error_state",
        children: [
          "Failed to load metrics: ",
          error.message
        ]
      }
    ),
    !isLoading && !error && total === 0n && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {}),
    !isLoading && total > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
          "data-ocid": "metrics.panel",
          children: kpis.map((kpi, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: stable KPI order
            /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { ...kpi }, i)
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg border border-border bg-card p-5 flex flex-col gap-4",
            "data-ocid": "metrics.failure_breakdown.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-mono text-sm font-semibold text-foreground", children: "Failure Type Breakdown" })
              ] }),
              failureTypes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-center font-mono text-xs text-muted-foreground", children: "No failures recorded" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: failureTypes.map((ft, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                BarChartRow,
                {
                  label: ft.type_name,
                  count: ft.count,
                  maxCount: maxFailureCount,
                  index: i
                },
                i
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg border border-border bg-card p-5 flex flex-col gap-4",
            "data-ocid": "metrics.success_rate.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-mono text-sm font-semibold text-foreground", children: "Success Rate Visual" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-32 w-32 items-center justify-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "svg",
                  {
                    className: "absolute inset-0 -rotate-90",
                    viewBox: "0 0 128 128",
                    fill: "none",
                    "aria-hidden": "true",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          cx: "64",
                          cy: "64",
                          r: "54",
                          strokeWidth: "10",
                          className: "stroke-muted"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          cx: "64",
                          cy: "64",
                          r: "54",
                          strokeWidth: "10",
                          strokeLinecap: "round",
                          className: "stroke-primary transition-all duration-700",
                          strokeDasharray: `${339.3 * (successRatePct / 100)} 339.3`
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center z-10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-2xl font-bold text-primary", children: [
                    successRatePct.toFixed(0),
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground", children: "success" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ProgressBar,
                  {
                    label: "Compilations success",
                    pct: successRatePct,
                    gradient: "from-primary to-primary/50"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ProgressBar,
                  {
                    label: "Validation pass rate",
                    pct: validationPassPct,
                    gradient: "from-chart-3 to-chart-3/50"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ProgressBar,
                  {
                    label: "Repair rate",
                    pct: repairRatePct,
                    gradient: "from-secondary to-secondary/50"
                  }
                )
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-lg border border-border bg-muted/30 p-5",
          "data-ocid": "metrics.system_info.panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-mono text-sm font-semibold text-foreground", children: "System Info" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
              ["Platform", "Internet Computer"],
              ["Architecture", "6-Stage Compilation Pipeline"],
              [
                "Stages",
                "Intent → Design → Schema → Refine → Validate → Repair → Execute"
              ],
              ["Storage", "Canister State (Stable Memory)"]
            ].map(([key, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: key }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-foreground break-words", children: val })
            ] }, key)) })
          ]
        }
      )
    ] })
  ] });
}
export {
  MetricsPage as default
};
