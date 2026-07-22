import { motion } from "framer-motion";
import { LogIn, LogOut, CreditCard, UserPlus, RefreshCw, Wrench, Bell, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  action: string;
  entityType: string;
  createdAt: string;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs} hr ago`;
  return `${Math.floor(diffHrs / 24)} day ago`;
}

function getActivityMeta(action: string, entityType: string): { icon: React.ElementType; color: string; text: string; type: string } {
  const actionLower = action.toLowerCase();
  const entityLower = entityType.toLowerCase();

  if (actionLower.includes("check_in") || actionLower.includes("checkin")) {
    return { icon: LogIn, color: "text-emerald-500 bg-emerald-500/10", text: "Student checked in", type: "checkin" };
  }
  if (actionLower.includes("check_out") || actionLower.includes("checkout")) {
    return { icon: LogOut, color: "text-blue-400 bg-blue-500/10", text: "Student checked out", type: "checkout" };
  }
  if (actionLower.includes("payment") || entityLower.includes("payment")) {
    return { icon: CreditCard, color: "text-green-500 bg-green-500/10", text: "Payment recorded", type: "payment" };
  }
  if (actionLower.includes("create_student") || actionLower.includes("add_student")) {
    return { icon: UserPlus, color: "text-indigo-400 bg-indigo-500/10", text: "New student registered", type: "student" };
  }
  if (actionLower.includes("membership") || actionLower.includes("renewal")) {
    return { icon: RefreshCw, color: "text-purple-400 bg-purple-500/10", text: "Membership renewed", type: "renewal" };
  }
  if (entityLower.includes("seat")) {
    return { icon: Wrench, color: "text-amber-400 bg-amber-500/10", text: "Seat updated", type: "maintenance" };
  }
  return { icon: Bell, color: "text-orange-400 bg-orange-500/10", text: action.replace(/_/g, " "), type: "other" };
}

interface ActivityFeedProps {
  items?: ActivityItem[];
  loading?: boolean;
}

export default function ActivityFeed({ items = [], loading = false }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="space-y-1 px-3 py-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start gap-3 py-2.5 animate-pulse">
            <div className="w-7 h-7 rounded-lg bg-muted flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-muted rounded w-3/4" />
              <div className="h-2.5 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center px-4">
        <Clock className="w-8 h-8 text-muted-foreground/40 mb-2" />
        <p className="text-sm text-muted-foreground">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item, i) => {
        const { icon: Icon, color, text } = getActivityMeta(item.action, item.entityType);
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
            className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors cursor-default"
          >
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", color)}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground leading-tight">{text}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.entityType} · {formatRelativeTime(item.createdAt)}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
