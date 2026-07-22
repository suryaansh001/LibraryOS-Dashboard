import { motion } from "framer-motion";
import { Calendar, Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import StudentLayout from "@/layouts/StudentLayout";
import { useApi } from "@/hooks/useApi";
import { getStudentMeAttendance } from "@/lib/api";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const fmtTime = (d: string) => format(new Date(d), "hh:mm a");
const fmtDate = (d: string) => format(new Date(d), "dd MMM yyyy");
const fmtHours = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`;

export default function StudentAttendance() {
  const { data, loading, error } = useApi(getStudentMeAttendance);
  const sessions = data ?? [];

  const completed = sessions.filter((a) => a.checkOutAt);
  const totalMinutes = sessions.reduce((acc, a) => acc + (a.durationMinutes ?? 0), 0);
  const avgMinutes = sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0;
  const pct = sessions.length > 0 ? Math.round((completed.length / sessions.length) * 100) : 0;

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">Loading…</div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64 text-sm text-destructive">{error}</div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your complete attendance history</p>
      </div>

      {/* Monthly summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Visits", value: sessions.length, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
          { label: "Total Study Hours", value: fmtHours(totalMinutes), icon: Clock, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
          { label: "Avg Daily Hours", value: fmtHours(avgMinutes), icon: TrendingUp, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
          { label: "Completion Rate", value: `${pct}%`, icon: Calendar, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className={`bg-card border ${s.bg} rounded-xl p-4`}>
              <div className={`w-8 h-8 rounded-lg bg-current/10 flex items-center justify-center mb-3 ${s.bg.replace("border-", "").split(" ")[0]}`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Attendance rate bar */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-card-border rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">Overview</p>
          <span className={cn("text-sm font-bold", pct >= 80 ? "text-emerald-500" : pct >= 60 ? "text-amber-400" : "text-destructive")}>{pct}% completed</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.5, ease: "easeOut" }} className={cn("h-full rounded-full", pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-400" : "bg-destructive")} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{completed.length} sessions completed</span>
          <span>{sessions.length - completed.length} in progress</span>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Attendance History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Date", "Check In", "Check Out", "Duration", "Method", "Status"].map((h, i) => (
                  <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">No attendance records yet</td>
                </tr>
              ) : (
                sessions.map((a, i) => {
                  const status = a.checkOutAt ? "Completed" : "Active";
                  return (
                    <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className={cn("border-b border-border/50 transition-colors", status === "Active" ? "bg-amber-500/3 hover:bg-amber-500/5" : "hover:bg-muted/30")}>
                      <td className="px-4 py-3 text-sm font-medium">{fmtDate(a.checkInAt)}</td>
                      <td className="px-4 py-3 text-sm">{fmtTime(a.checkInAt)}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{a.checkOutAt ? fmtTime(a.checkOutAt) : "—"}</td>
                      <td className="px-4 py-3 text-sm font-medium">{a.durationMinutes != null ? fmtHours(a.durationMinutes) : "—"}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-secondary border border-border text-secondary-foreground font-medium capitalize">{a.checkInMethod}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-md border", status === "Completed" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/20" : "bg-amber-500/15 text-amber-400 border-amber-500/20")}>
                          {status}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </StudentLayout>
  );
}
