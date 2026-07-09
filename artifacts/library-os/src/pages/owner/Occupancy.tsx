import { motion } from "framer-motion";
import { Users, DoorOpen, Building2 } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { mockStudents } from "@/data/mockData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const insideStudents = mockStudents.filter(s => s.checkedIn).map((s, i) => ({
  ...s,
  duration: ["1h 45m", "2h 30m", "3h 15m", "4h 00m", "2h 10m", "5h 30m", "1h 20m"][i % 7],
  statusLabel: i < 5 ? "Normal" : i === 5 ? "Extended" : "Overtime",
}));

export default function Occupancy() {
  const capacity = 80;
  const occupied = insideStudents.length;
  const available = capacity - occupied;
  const pct = Math.round((occupied / capacity) * 100);

  return (
    <DashboardLayout>
      <PageHeader title="Live Occupancy" description="Real-time view of who is currently in the library" />

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Capacity", value: capacity, icon: Building2, color: "text-muted-foreground", bg: "bg-muted" },
          { label: "Occupied", value: occupied, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Available", value: available, icon: DoorOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="bg-card border border-card-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-4.5 h-4.5 ${s.color}`} />
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs text-emerald-500 font-medium">Live</span>
                </div>
              </div>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Progress */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Occupancy Rate</p>
          <span className={cn("text-sm font-bold", pct > 80 ? "text-destructive" : pct > 60 ? "text-amber-400" : "text-emerald-500")}>{pct}%</span>
        </div>
        <Progress value={pct} className="h-3" />
        <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
          <span>{occupied} occupied</span>
          <span>{available} available</span>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <p className="text-sm font-medium">Currently Inside</p>
          <span className="flex items-center gap-1 text-xs text-emerald-500">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/30">
              {["Student", "Seat", "Check-in Time", "Time Spent", "Status"].map((h, i) => (
                <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {insideStudents.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className={cn("border-b border-border/50 transition-colors hover:bg-muted/30",
                    s.statusLabel === "Extended" ? "bg-amber-500/5" : s.statusLabel === "Overtime" ? "bg-destructive/5" : ""
                  )}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-7 h-7"><AvatarFallback className="text-xs bg-primary/15 text-primary">{s.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback></Avatar>
                      <span className="font-medium text-sm">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.seat}</td>
                  <td className="px-4 py-3 text-sm">{s.checkInTime}</td>
                  <td className="px-4 py-3 text-sm font-medium">{s.duration}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-md border",
                      s.statusLabel === "Normal" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/20" :
                      s.statusLabel === "Extended" ? "bg-amber-500/15 text-amber-400 border-amber-500/20" :
                      "bg-destructive/15 text-destructive border-destructive/20"
                    )}>{s.statusLabel}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
