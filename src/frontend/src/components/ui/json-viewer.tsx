import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, ChevronRight, Copy } from "lucide-react";
import { useCallback, useState } from "react";

interface JsonViewerProps {
  data: unknown;
  title?: string;
  height?: number | string;
  defaultExpanded?: boolean;
  className?: string;
}

interface JsonNodeProps {
  data: unknown;
  depth?: number;
  label?: string;
}

function JsonNode({ data, depth = 0, label }: JsonNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2);
  const indent = depth * 14;

  if (data === null) {
    return (
      <div style={{ paddingLeft: indent }} className="flex gap-1.5 py-px">
        {label && <span className="text-secondary">"{label}"</span>}
        {label && <span className="text-muted-foreground">: </span>}
        <span className="text-muted-foreground italic">null</span>
      </div>
    );
  }

  if (typeof data === "boolean") {
    return (
      <div style={{ paddingLeft: indent }} className="flex gap-1 py-px">
        {label && <span className="text-secondary">"{label}"</span>}
        {label && <span className="text-muted-foreground">: </span>}
        <span className="text-destructive">{data.toString()}</span>
      </div>
    );
  }

  if (
    typeof data === "number" ||
    typeof data === "bigint" ||
    typeof data === "string"
  ) {
    const display = typeof data === "string" ? `"${data}"` : String(data);
    const colorClass =
      typeof data === "string"
        ? "text-[oklch(0.75_0.18_142)]"
        : "text-[oklch(0.75_0.12_70)]";
    return (
      <div style={{ paddingLeft: indent }} className="flex gap-1 py-px">
        {label && <span className="text-secondary">"{label}"</span>}
        {label && <span className="text-muted-foreground">: </span>}
        <span className={colorClass}>{display}</span>
      </div>
    );
  }

  if (Array.isArray(data)) {
    return (
      <div style={{ paddingLeft: indent }}>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors py-px"
        >
          {expanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          {label && <span className="text-secondary">"{label}"</span>}
          {label && <span>: </span>}
          <span className="text-foreground">[ </span>
          {!expanded && (
            <span className="text-muted-foreground text-[10px]">
              {data.length} items
            </span>
          )}
          {!expanded && <span className="text-foreground"> ]</span>}
        </button>
        {expanded && (
          <div>
            {data.map((item, i) => (
              <JsonNode
                // biome-ignore lint/suspicious/noArrayIndexKey: JSON arrays are positional
                key={`item-${i}`}
                data={item}
                depth={depth + 1}
                label={String(i)}
              />
            ))}
            <div style={{ paddingLeft: 0 }} className="text-foreground py-px">
              {"]"}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (typeof data === "object") {
    const keys = Object.keys(data as Record<string, unknown>);
    return (
      <div style={{ paddingLeft: indent }}>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors py-px"
        >
          {expanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          {label && <span className="text-secondary">"{label}"</span>}
          {label && <span>: </span>}
          <span className="text-foreground">{"{ "}</span>
          {!expanded && (
            <span className="text-muted-foreground text-[10px]">
              {keys.length} keys
            </span>
          )}
          {!expanded && <span className="text-foreground">{" }"}</span>}
        </button>
        {expanded && (
          <div>
            {keys.map((key) => (
              <JsonNode
                key={key}
                data={(data as Record<string, unknown>)[key]}
                depth={depth + 1}
                label={key}
              />
            ))}
            <div style={{ paddingLeft: 0 }} className="text-foreground py-px">
              {"}"}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export function JsonViewer({
  data,
  title,
  height = 400,
  defaultExpanded = true,
  className,
}: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(!defaultExpanded);

  const handleCopy = useCallback(() => {
    try {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }, [data]);

  const heightStyle = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCollapsed((v) => !v)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
          {title && (
            <span className="text-xs font-semibold font-code text-foreground">
              {title}
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 px-2 text-muted-foreground hover:text-foreground"
          data-ocid="json-viewer.copy_button"
        >
          {copied ? (
            <Check className="h-3 w-3 text-[oklch(0.7_0.18_142)]" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          <span className="text-[10px] ml-1">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>

      {/* Body */}
      {!isCollapsed && (
        <div
          className="overflow-auto scrollbar-dark p-3 font-code text-xs leading-relaxed"
          style={{ maxHeight: heightStyle }}
        >
          {data === null || data === undefined ? (
            <span className="text-muted-foreground italic">No data</span>
          ) : (
            <JsonNode data={data} depth={0} />
          )}
        </div>
      )}
    </div>
  );
}
