import { cn } from "@/lib/utils";
import {
  BarChart3,
  ChevronRight,
  Cpu,
  FlaskConical,
  LayoutDashboard,
} from "lucide-react";

export type NavTab = "compiler" | "evaluation" | "metrics";

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "compiler",
    label: "Compiler",
    icon: <Cpu className="h-4 w-4" />,
    description: "Generate app configs from natural language",
  },
  {
    id: "evaluation",
    label: "Evaluation",
    icon: <FlaskConical className="h-4 w-4" />,
    description: "Run benchmark test suite",
  },
  {
    id: "metrics",
    label: "Metrics",
    icon: <BarChart3 className="h-4 w-4" />,
    description: "System performance metrics",
  },
];

interface MainLayoutProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  children: React.ReactNode;
}

export function MainLayout({
  activeTab,
  onTabChange,
  children,
}: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center justify-center h-7 w-7 rounded-md bg-primary/20 border border-primary/40 glow-primary">
            <Cpu className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold font-code text-foreground truncate leading-tight">
              AI App Compiler
            </p>
            <p className="text-[9px] text-muted-foreground font-code truncate">
              v1.0 · ICP
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-smooth group",
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent",
                )}
                data-ocid={`nav.${item.id}_tab`}
              >
                <span
                  className={cn(
                    "transition-smooth",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-xs font-semibold font-code leading-tight",
                      isActive ? "text-primary" : "",
                    )}
                  >
                    {item.label}
                  </p>
                </div>
                {isActive && (
                  <ChevronRight className="h-3 w-3 text-primary flex-shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-sidebar-border">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[oklch(0.7_0.18_142)] animate-pulse" />
            <span className="text-[10px] font-code text-muted-foreground">
              Canister Online
            </span>
          </div>
          <p className="text-[9px] text-muted-foreground/50 font-code mt-0.5">
            © {new Date().getFullYear()} ·{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            <h1 className="text-sm font-semibold font-code text-foreground">
              {NAV_ITEMS.find((i) => i.id === activeTab)?.label}
            </h1>
            <span className="text-muted-foreground text-xs">/</span>
            <span className="text-xs text-muted-foreground">
              {NAV_ITEMS.find((i) => i.id === activeTab)?.description}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-code text-muted-foreground bg-muted/30 px-2 py-0.5 rounded border border-border">
              NL → IR → ARCH → SCHEMA → VALID → RUNTIME
            </span>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto scrollbar-dark">{children}</div>
      </main>
    </div>
  );
}
