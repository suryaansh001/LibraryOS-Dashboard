import { motion } from "framer-motion";
import { Users, DoorOpen, Building2 } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useApi } from "@/hooks/useApi";
import { getOccupancy, type OccupancyDTO } from "@/lib/api";
import { format } from "date-fns";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatTimeSpent(checkInAt: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(checkInAt).getTime()) / 60000));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m.toString().padStart(2, "0")}m` : `${m}m`;
}

function statusLabelFor(checkInAt: string) {
  const minutes = Math.floor((Date.now() - new Date(checkInAt).getTime()) / 60000);
  if (minutes > 240) return "Overtime";
  if (minutes > 180) return "Extended";
  return "Normal";
}

export default function Occupancy() {
  const { data, loading } = useApi<OccupancyDTO>(getOccupancy);
  const capacity = data?.capacity ?? 0;
  const occupied = data?.currentCount ?? 0;
  const availableFlexible = data?.availableFlexible ?? 0;
  const available = capacity - occupied;
  const pct = capacity > 0 ? Math.round((occupied / capacity) * 100) : 0;
  const activeSessions = data?.activeSessions ?? [];
  const seats = data?.seats ?? [];

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
        {availableFlexible > 0 && (
          <p className="text-xs text-muted-foreground mt-1">{availableFlexible} flexible seats available</p>
        )}
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
              {loading && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">Loading live occupancy…</td></tr>
              )}
              {!loading && activeSessions.map((s, i) => {
                const statusLabel = statusLabelFor(s.checkInAt);
                return (
                  <motion.tr key={s.sessionId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className={cn("border-b border-border/50 transition-colors hover:bg-muted/30",
                      statusLabel === "Extended" ? "bg-amber-500/5" : statusLabel === "Overtime" ? "bg-destructive/5" : ""
                    )}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="w-7 h-7"><AvatarFallback className="text-xs bg-primary/15 text-primary">{getInitials(s.studentName)}</AvatarFallback></Avatar>
                        <span className="font-medium text-sm">{s.studentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.seatNumber ?? "—"}</td>
                    <td className="px-4 py-3 text-sm">{format(new Date(s.checkInAt), "hh:mm a")}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatTimeSpent(s.checkInAt)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-md border",
                        statusLabel === "Normal" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/20" :
                        statusLabel === "Extended" ? "bg-amber-500/15 text-amber-400 border-amber-500/20" :
                        "bg-destructive/15 text-destructive border-destructive/20"
                      )}>{statusLabel}</span>
                    </td>
                  </motion.tr>
                );
              })}
              {!loading && activeSessions.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No one is currently inside</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Seats grid */}
      {!loading && seats.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card border border-card-border rounded-xl p-5 mt-5">
          <p className="text-sm font-medium mb-4">Seat Status</p>
          <div className="grid grid-cols-10 gap-2">
            {seats.map((seat) => (
              <div
                key={seat.seatNumber}
                className={cn(
                  "aspect-square rounded-lg text-xs font-mono font-semibold border flex items-center justify-center",
                  seat.status === "available" && "bg-emerald-500/10 border-emerald-500/30 text-emerald-500",
                  seat.status === "occupied" && "bg-destructive/15 border-destructive/30 text-destructive",
                  seat.status === "maintenance" && "bg-amber-500/10 border-amber-500/30 text-amber-400"
                )}
              >
                {seat.seatNumber.split("-").pop()}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
