import { motion } from "framer-motion";
import { BadgeCheck, MapPin, Clock, CalendarDays, CreditCard, AlertCircle, QrCode, Wallet, RefreshCw, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import StudentLayout from "@/layouts/StudentLayout";
import { useApi } from "@/hooks/useApi";
import { getStudentMe, getStudentMeAttendance } from "@/lib/api";
import { useRole } from "@/context/RoleContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const quickActions = [
  { label: "Scan QR", icon: QrCode, href: "/student/id-card", color: "bg-sky-500/15 text-sky-400 border-sky-500/20 hover:bg-sky-500/25" },
  { label: "Payments", icon: Wallet, href: "/student/payments", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25" },
  { label: "Attendance", icon: CalendarDays, href: "/student/attendance", color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/25" },
  { label: "Renew", icon: RefreshCw, href: "/student/membership", color: "bg-amber-500/15 text-amber-400 border-amber-500/20 hover:bg-amber-500/25" },
];

const fmtDate = (d: string | null) => (d ? format(new Date(d), "dd MMM yyyy") : "—");

export default function StudentDashboard() {
  const { session } = useRole();
  const { data: student, loading } = useApi(getStudentMe);
  const { data: attendance } = useApi(getStudentMeAttendance);

  const libraryName = session?.library?.name ?? "Library";
  const sessions = attendance ?? [];

  const presentDays = sessions.length;
  const absentDays = 0;
  const total = presentDays + absentDays;
  const rate = total > 0 ? Math.round((presentDays / total) * 100) : 0;
  const recentActivity = sessions.slice(0, 5);

  if (loading || !student) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">Loading…</div>
      </StudentLayout>
    );
  }

  const stats = [
    { label: "Membership Status", value: student.membershipStatus ?? "—", sub: `${student.membershipType ?? "—"} Plan`, icon: BadgeCheck, color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20", valueColor: "text-emerald-500" },
    { label: "Current Seat", value: student.seatNumber ?? "—", sub: "Assigned to you", icon: MapPin, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", valueColor: "text-foreground" },
    { label: "Membership Type", value: student.membershipType ?? "—", sub: "Active plan", icon: CreditCard, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", valueColor: "text-foreground" },
    { label: "Hours Remaining", value: student.hoursRemaining != null ? `${student.hoursRemaining}h` : "—", sub: "Available balance", icon: Clock, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", valueColor: "text-foreground" },
    { label: "Account Status", value: student.status ?? "—", sub: "Account", icon: BadgeCheck, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", valueColor: "text-foreground" },
    { label: "Membership Expiry", value: fmtDate(student.membershipEndDate), sub: "Renew before this", icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", valueColor: "text-amber-400" },
  ];

  return (
    <StudentLayout>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <h1 className="text-xl font-bold text-foreground">Good morning, {student.name.split(" ")[0]} 👋</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{libraryName} · Seat {student.seatNumber ?? "—"} · {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </motion.div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {quickActions.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.div key={a.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={a.href}>
                <button className={`w-full flex flex-col items-center justify-center gap-2 py-3.5 rounded-xl border transition-all ${a.color}`}>
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-semibold">{a.label}</span>
                </button>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }} className={`bg-card border ${s.border} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className={`text-lg font-bold ${s.valueColor}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance Summary */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card border border-card-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Attendance Summary</h3>
            <span className="text-xs text-muted-foreground">This Month</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: "Visits", value: presentDays, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
              { label: "Absent", value: absentDays, color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
              { label: "Total", value: total, color: "text-foreground", bg: "bg-muted border-border" },
            ].map((s, i) => (
              <div key={i} className={`rounded-lg border p-2.5 text-center ${s.bg}`}>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Attendance Rate</span>
              <span className="font-semibold text-emerald-500">{rate}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${rate}%` }} />
            </div>
          </div>
          <Link href="/student/attendance" className="block mt-3 text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1">View full history <ChevronRight className="w-3.5 h-3.5" /></Link>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-card-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Recent Activity</h3>
            <Link href="/student/attendance" className="text-xs text-sky-400 hover:text-sky-300">View all</Link>
          </div>
          <div className="space-y-2.5">
            {recentActivity.length === 0 ? (
              <p className="text-xs text-muted-foreground">No activity yet</p>
            ) : (
              recentActivity.map((a) => (
                <div key={a.id} className="flex items-center gap-2.5 text-sm">
                  <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5", a.checkOutAt ? "bg-emerald-500" : "bg-amber-400")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{format(new Date(a.checkInAt), "dd MMM yyyy")}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(a.checkInAt), "hh:mm a")} – {a.checkOutAt ? format(new Date(a.checkOutAt), "hh:mm a") : "—"} · {a.durationMinutes != null ? `${Math.floor(a.durationMinutes / 60)}h ${a.durationMinutes % 60}m` : "—"}
                    </p>
                  </div>
                  <span className={cn("text-xs font-medium flex-shrink-0", a.checkOutAt ? "text-emerald-500" : "text-amber-400")}>{a.checkOutAt ? "Completed" : "Active"}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-card border border-card-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <Link href="/student/notifications" className="text-xs text-sky-400 hover:text-sky-300">View all</Link>
          </div>
          <div className="space-y-2.5">
            <p className="text-xs text-muted-foreground">No notifications yet</p>
          </div>
        </motion.div>
      </div>
    </StudentLayout>
  );
}
