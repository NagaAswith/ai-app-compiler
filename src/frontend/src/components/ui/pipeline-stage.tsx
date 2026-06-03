import { cn } from "@/lib/utils";
import { PipelineStageStatus } from "@/types/compiler";
import {
  CheckCircle2,
  Clock,
  Loader2,
  MinusCircle,
  XCircle,
} from "lucide-react";

interface PipelineStageProps {
  index: number;
  name: string;
  status: PipelineStageStatus;
  icon: React.ReactNode;
  duration_ms?: number;
  isLast?: boolean;
}

function StatusIcon({ status }: { status: PipelineStageStatus }) {
  switch (status) {
    case PipelineStageStatus.RUNNING:
      return <Loader2 className="h-3.5 w-3.5 animate-spin" />;
    case PipelineStageStatus.COMPLETED:
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    case PipelineStageStatus.FAILED:
      return <XCircle className="h-3.5 w-3.5" />;
    case PipelineStageStatus.SKIPPED:
      return <MinusCircle className="h-3.5 w-3.5" />;
    default:
      return <Clock className="h-3.5 w-3.5" />;
  }
}

const statusConfig: Record<
  PipelineStageStatus,
  { ring: string; bg: string; text: string; badge: string; glow: string }
> = {
  [PipelineStageStatus.PENDING]: {
    ring: "border-border",
    bg: "bg-muted/30",
    text: "text-muted-foreground",
    badge: "bg-muted/50 text-muted-foreground",
    glow: "",
  },
  [PipelineStageStatus.RUNNING]: {
    ring: "border-primary",
    bg: "bg-primary/10",
    text: "text-primary",
    badge: "bg-primary/20 text-primary",
    glow: "glow-primary animate-pulse-glow",
  },
  [PipelineStageStatus.COMPLETED]: {
    ring: "border-[oklch(0.7_0.18_142)]",
    bg: "bg-[oklch(0.7_0.18_142/0.1)]",
    text: "text-[oklch(0.7_0.18_142)]",
    badge: "bg-[oklch(0.7_0.18_142/0.15)] text-[oklch(0.7_0.18_142)]",
    glow: "glow-success",
  },
  [PipelineStageStatus.FAILED]: {
    ring: "border-destructive",
    bg: "bg-destructive/10",
    text: "text-destructive",
    badge: "bg-destructive/20 text-destructive",
    glow: "glow-error",
  },
  [PipelineStageStatus.SKIPPED]: {
    ring: "border-border",
    bg: "bg-muted/20",
    text: "text-muted-foreground/50",
    badge: "bg-muted/30 text-muted-foreground/50",
    glow: "",
  },
};

export function PipelineStageCard({
  index,
  name,
  status,
  icon,
  duration_ms,
  isLast = false,
}: PipelineStageProps) {
  const cfg = statusConfig[status];

  return (
    <div className="flex items-stretch gap-0">
      <div
        className={cn(
          "flex flex-col items-center gap-2 rounded-lg border p-3 min-w-[100px] flex-1 transition-smooth",
          cfg.ring,
          cfg.bg,
          cfg.glow,
        )}
        data-ocid={`pipeline.stage.${index + 1}`}
      >
        {/* Stage number + status icon */}
        <div className="flex items-center justify-between w-full">
          <span
            className={cn(
              "flex items-center justify-center h-5 w-5 rounded-full border text-[10px] font-bold font-code",
              cfg.ring,
              cfg.text,
            )}
          >
            {index + 1}
          </span>
          <span className={cn("transition-smooth", cfg.text)}>
            <StatusIcon status={status} />
          </span>
        </div>

        {/* Stage icon */}
        <div className={cn("text-xl", cfg.text)}>{icon}</div>

        {/* Stage name */}
        <p
          className={cn(
            "text-[11px] font-semibold text-center leading-tight",
            cfg.text,
          )}
        >
          {name}
        </p>

        {/* Status badge */}
        <span
          className={cn(
            "text-[9px] font-code uppercase px-1.5 py-0.5 rounded tracking-wider",
            cfg.badge,
          )}
        >
          {status}
        </span>

        {/* Duration */}
        {duration_ms !== undefined && (
          <span className="text-[9px] text-muted-foreground font-code">
            {duration_ms}ms
          </span>
        )}
      </div>

      {/* Connector arrow */}
      {!isLast && (
        <div className="flex items-center px-1 self-center">
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            className="text-muted-foreground/40"
            aria-hidden="true"
            role="presentation"
          >
            <path
              d="M0 5 H13 M10 1 L15 5 L10 9"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
