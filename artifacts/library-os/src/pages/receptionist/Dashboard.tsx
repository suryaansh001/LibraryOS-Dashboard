import { motion } from "framer-motion";
import { QrCode, Search, Wallet, UserCheck, Users, DoorOpen } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import ReceptionistLayout from "@/layouts/ReceptionistLayout";
import { useApi } from "@/hooks/useApi";
import { getOccupancy, listAttendance, type OccupancyActiveSessionDTO } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ReceptionistDashboard() {
  const { data: occupancy, loading: occLoading, error: occError } = useApi(getOccupancy);
  const { data: todaysAttendance } = useApi(() => listAttendance({ limit: 100 }));

  const insideStudents: OccupancyActiveSessionDTO[] = occupancy?.activeSessions ?? [];
  const todaysCount = todaysAttendance?.length ?? 0;

  return (
    <ReceptionistLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-lg font-bold text-foreground">Good Morning, Sunita</h1>
          <p className="text-sm text-muted-foreground">Tuesday, March 12, 2024 · ReadSpace Pro</p>
        </motion.div>

        {/* Big Action Buttons */}
        <div className="grid grid-cols-1 gap-3">
          {[
            { label: "Scan QR / Check In", icon: QrCode, href: "/receptionist/scan", color: "bg-primary hover:bg-primary/90 text-primary-foreground", desc: "Scan student QR code for attendance" },
            { label: "Search Student", icon: Search, href: "/receptionist/search", color: "bg-blue-600 hover:bg-blue-700 text-white", desc: "Find student and check in manually" },
            { label: "Record Payment", icon: Wallet, href: "/payments", color: "bg-emerald-600 hover:bg-emerald-700 text-white", desc: "Accept and record fee payments" },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.div key={action.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                <Link href={action.href}>
                  <button className={`w-full flex items-center gap-4 p-4 rounded-xl font-medium text-sm transition-all active:scale-[0.98] ${action.color}`} data-testid={`action-${action.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">{action.label}</p>
                      <p className="text-xs opacity-75 font-normal mt-0.5">{action.desc}</p>
                    </div>
                  </button>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Currently Inside", value: occLoading ? "—" : (occupancy?.currentCount ?? 0).toString(), icon: UserCheck, color: "text-emerald-500" },
            { label: "Today's Attendance", value: todaysCount.toString(), icon: Users, color: "text-indigo-400" },
            { label: "Available Seats", value: occLoading ? "—" : (occupancy?.availableFlexible ?? 0).toString(), icon: DoorOpen, color: "text-blue-400" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="bg-card border border-card-border rounded-xl p-4 text-center">
                <Icon className={`w-5 h-5 mx-auto mb-1.5 ${s.color}`} />
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Students Inside */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-card border border-card-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Students Currently Inside</h3>
            <span className="flex items-center gap-1 text-xs text-emerald-500">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>
          <div className="divide-y divide-border/50">
            {occError && (
              <div className="px-4 py-3 text-xs text-destructive">Failed to load occupancy: {occError}</div>
            )}
            {!occError && insideStudents.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">No students currently inside</div>
            )}
            {insideStudents.slice(0, 8).map((s) => (
              <div key={s.sessionId} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="text-xs bg-primary/15 text-primary">{s.studentName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{s.studentName}</p>
                  <p className="text-xs text-muted-foreground">Seat {s.seatNumber ?? "—"}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-emerald-500 font-medium">{format(new Date(s.checkInAt), "dd MMM HH:mm")}</p>
                  <p className="text-xs text-muted-foreground">Check-in</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </ReceptionistLayout>
  );
}
