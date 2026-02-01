import { Clock, CheckCircle, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type AdminSection = "pending" | "approved" | "activity";

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  pendingCount: number;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const sidebarItems = [
  {
    id: "pending" as const,
    label: "Pending Voice Notes",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    id: "approved" as const,
    label: "Approved Voice Notes",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: "activity" as const,
    label: "User Activity History",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
];

export function AdminSidebar({
  activeSection,
  onSectionChange,
  pendingCount,
  collapsed,
  onCollapsedChange,
}: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Collapse toggle */}
        <div className="flex justify-end p-2 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCollapsedChange(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? `${item.bgColor} ${item.color} font-medium`
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon className={cn("h-5 w-5", isActive && item.color)} />
                  {item.id === "pending" && pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                      {pendingCount > 9 ? "9+" : pendingCount}
                    </span>
                  )}
                </div>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Status indicators legend */}
        {!collapsed && (
          <div className="p-4 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3">Status Indicators</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="text-muted-foreground">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-muted-foreground">Rejected</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
