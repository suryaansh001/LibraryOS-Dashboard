import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Users, UserCheck, Scan, Loader2, ClipboardList } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { useApi } from "@/hooks/useApi";
import { listAttendance, getDashboard, type AttendanceSessionDTO, type DashboardDTO } from "@/lib/api";
import { format } from "date-fns";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatDuration(minutes: number | null): string {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function Attendance() {
  const [scanned, setScanned] = useState(false);
  const [scanStatus] = useState<"in" | "out">("in");

  const { data: sessions, loading: loadingSessions } = useApi<AttendanceSessionDTO[]>(listAttendance);
  const { data: dashboard, loading: loadingDashboard } = useApi<DashboardDTO>(getDashboard);

  const openSessions = (sessions ?? []).filter(s => s.checkOutAt === null);
  const closedToday = (sessions ?? []).filter(s => {
    const today = new Date().toDateString();
    return s.checkOutAt && new Date(s.checkInAt).toDateString() === today;
  });

  const handleScan = () => {
    setScanned(true);
    setTimeout(() => setScanned(false), 4000);
  };

  return (
    <DashboardLayout>
      <PageHeader title="QR Attendance" description="Scan QR codes to check students in and out" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Scanner */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-card-border rounded-xl overflow-hidden">
            {/* Camera area */}
            <div
              className="relative bg-black aspect-video flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={handleScan}
              data-testid="qr-scanner-area"
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, hsl(239 84% 67% / 0.3) 0%, transparent 70%)" }} />
              </div>
              {/* Corner brackets */}
              {[
                "top-8 left-8 border-t-2 border-l-2",
                "top-8 right-8 border-t-2 border-r-2",
                "bottom-8 left-8 border-b-2 border-l-2",
                "bottom-8 right-8 border-b-2 border-r-2",
              ].map((cls, i) => (
                <motion.div key={i} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }} className={`absolute w-8 h-8 border-primary ${cls}`} />
              ))}
              <motion.div
                animate={{ y: ["-100px", "100px"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute w-3/4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
              />
              <div className="text-center z-10">
                <Scan className="w-12 h-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/60 text-sm font-medium">Click to simulate scan</p>
                <p className="text-white/30 text-xs mt-1">In production, camera feed appears here</p>
              </div>
            </div>

            {/* Result */}
            {scanned && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 border-t ${scanStatus === "in" ? "border-emerald-500/30 bg-emerald-500/5" : "border-blue-500/30 bg-blue-500/5"}`}
              >
                <div className={`text-center text-lg font-bold mb-3 ${scanStatus === "in" ? "text-emerald-500" : "text-blue-400"}`}>
                  {scanStatus === "in" ? "✓ CHECKED IN" : "✓ CHECKED OUT"}
                </div>
                <p className="text-center text-sm text-muted-foreground">Scan a real QR code to record attendance</p>
              </motion.div>
            )}
          </div>

          {/* Today's log */}
          <div className="mt-4 bg-card border border-card-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <p className="text-sm font-medium">Today's Attendance Log</p>
              <span className="text-xs text-muted-foreground">{closedToday.length + openSessions.length} records</span>
            </div>

            {loadingSessions ? (
              <div className="flex items-center justify-center py-10 gap-3 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading…</span>
              </div>
            ) : sessions?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <ClipboardList className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No attendance records today</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Student", "Seat", "Check In", "Check Out", "Duration", "Status"].map((h, i) => (
                        <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(sessions ?? []).slice(0, 20).map((a, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium text-sm">{a.studentName}</td>
                        <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{a.seatNumber ?? "—"}</td>
                        <td className="px-4 py-2.5 text-sm">{format(new Date(a.checkInAt), "hh:mm a")}</td>
                        <td className="px-4 py-2.5 text-sm text-muted-foreground">
                          {a.checkOutAt ? format(new Date(a.checkOutAt), "hh:mm a") : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">{formatDuration(a.durationMinutes)}</td>
                        <td className="px-4 py-2.5">
                          <StatusBadge status={a.checkOutAt ? "Present" : "Inside"} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-4">
          {[
            {
              label: "Current Occupancy",
              value: loadingDashboard ? "—" : `${dashboard?.currentOccupancy ?? 0}/${dashboard?.capacity ?? "—"}`,
              icon: Users,
              color: "text-blue-400",
              bg: "bg-blue-500/10"
            },
            {
              label: "Currently Inside",
              value: loadingDashboard ? "—" : String(dashboard?.currentOccupancy ?? 0),
              icon: UserCheck,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
              live: true
            },
            {
              label: "Today's Total",
              value: loadingDashboard ? "—" : String(dashboard?.todayCheckins ?? 0),
              icon: QrCode,
              color: "text-indigo-400",
              bg: "bg-indigo-500/10"
            },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                      <Icon className={`w-4.5 h-4.5 ${s.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        {s.live && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                      </div>
                      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="bg-card border border-card-border rounded-xl p-4">
            <p className="text-xs font-medium text-muted-foreground mb-3">Students Inside Now</p>
            {loadingSessions ? (
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Loader2 className="w-3 h-3 animate-spin" /> Loading…
              </div>
            ) : openSessions.length === 0 ? (
              <p className="text-xs text-muted-foreground">No students currently inside</p>
            ) : (
              <div className="space-y-2">
                {openSessions.slice(0, 6).map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-primary/15 text-primary">{getInitials(s.studentName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{s.studentName}</p>
                      <p className="text-xs text-muted-foreground">{s.seatNumber ?? "No seat"} · {format(new Date(s.checkInAt), "hh:mm a")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
