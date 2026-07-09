import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  subtitle?: string;
  live?: boolean;
  index?: number;
};

export default function StatCard({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  subtitle,
  live,
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      className="bg-card border border-card-border rounded-xl p-5 hover:border-border transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            {live && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-500 font-medium">Live</span>
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-foreground mt-1.5 leading-none">{value}</p>
          {(trend || subtitle) && (
            <div className="mt-2 flex items-center gap-2">
              {trend && (
                <span className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  trendUp ? "text-emerald-500" : "text-destructive"
                )}>
                  {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {trend}
                </span>
              )}
              {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
            </div>
          )}
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", iconBg)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>
    </motion.div>
  );
}
