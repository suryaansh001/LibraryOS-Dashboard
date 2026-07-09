import { motion } from "framer-motion";
import { LogIn, LogOut, CreditCard, UserPlus, RefreshCw, Wrench, Bell } from "lucide-react";
import { activityFeed } from "@/data/mockData";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  checkin: LogIn,
  checkout: LogOut,
  payment: CreditCard,
  student: UserPlus,
  renewal: RefreshCw,
  maintenance: Wrench,
  reminder: Bell,
};

const iconColorMap: Record<string, string> = {
  checkin: "text-emerald-500 bg-emerald-500/10",
  checkout: "text-blue-400 bg-blue-500/10",
  payment: "text-green-500 bg-green-500/10",
  student: "text-indigo-400 bg-indigo-500/10",
  renewal: "text-purple-400 bg-purple-500/10",
  maintenance: "text-amber-400 bg-amber-500/10",
  reminder: "text-orange-400 bg-orange-500/10",
};

export default function ActivityFeed() {
  return (
    <div className="space-y-1">
      {activityFeed.map((item, i) => {
        const Icon = iconMap[item.type] ?? Bell;
        const colors = iconColorMap[item.type] ?? "text-gray-400 bg-gray-500/10";
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
            className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors cursor-default"
          >
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", colors)}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground leading-tight">{item.text}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
