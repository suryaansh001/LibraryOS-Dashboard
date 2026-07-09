import { motion } from "framer-motion";
import { Calendar, Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import StudentLayout from "@/layouts/StudentLayout";
import { studentAttendance } from "@/data/studentData";
import { cn } from "@/lib/utils";

export default function StudentAttendance() {
  const present = studentAttendance.filter(a => a.status === "Present");
  const absent = studentAttendance.filter(a => a.status === "Absent");
  const totalHours = present.reduce((acc, a) => {
    const parts = a.duration.match(/(\d+)h\s(\d+)m/);
    if (!parts) return acc;
    return acc + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  }, 0);
  const avgMinutes = present.length > 0 ? Math.round(totalHours / present.length) : 0;

  const fmtHours = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`;
  const pct = Math.round((present.length / studentAttendance.length) * 100);

  return (
    <StudentLayout>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your complete attendance history</p>
      </div>

      {/* Monthly summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Visits", value: present.length, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
          { label: "Total Study Hours", value: fmtHours(totalHours), icon: Clock, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
          { label: "Avg Daily Hours", value: fmtHours(avgMinutes), icon: TrendingUp, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
          { label: "Attendance Rate", value: `${pct}%`, icon: Calendar, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
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
          <p className="text-sm font-semibold">March 2024 Overview</p>
          <span className={cn("text-sm font-bold", pct >= 80 ? "text-emerald-500" : pct >= 60 ? "text-amber-400" : "text-destructive")}>{pct}% attendance</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.5, ease: "easeOut" }} className={cn("h-full rounded-full", pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-400" : "bg-destructive")} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{present.length} days present</span>
          <span>{absent.length} days absent</span>
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
                {["Date", "Check In", "Check Out", "Duration", "Status"].map((h, i) => (
                  <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentAttendance.map((a, i) => (
                <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className={cn("border-b border-border/50 transition-colors", a.status === "Absent" ? "bg-destructive/3 hover:bg-destructive/5" : "hover:bg-muted/30")}>
                  <td className="px-4 py-3 text-sm font-medium">{a.date}</td>
                  <td className="px-4 py-3 text-sm">{a.checkIn}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{a.checkOut}</td>
                  <td className="px-4 py-3 text-sm font-medium">{a.duration}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-md border", a.status === "Present" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/20" : "bg-destructive/15 text-destructive border-destructive/20")}>
                      {a.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </StudentLayout>
  );
}
