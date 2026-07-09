import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Users, UserCheck, Scan } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { mockStudents, mockAttendance } from "@/data/mockData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StatusBadge from "@/components/StatusBadge";
import MembershipBadge from "@/components/MembershipBadge";
import { Card, CardContent } from "@/components/ui/card";

export default function Attendance() {
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<typeof mockStudents[0] | null>(null);
  const [scanStatus, setScanStatus] = useState<"in" | "out">("in");

  const handleScan = () => {
    const student = mockStudents[0];
    setScanResult(student);
    setScanStatus(student.checkedIn ? "out" : "in");
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
            <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden cursor-pointer" onClick={handleScan} data-testid="qr-scanner-area">
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
              {/* Scan line */}
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
            {scanned && scanResult && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`p-5 border-t ${scanStatus === "in" ? "border-emerald-500/30 bg-emerald-500/5" : "border-blue-500/30 bg-blue-500/5"}`}>
                <div className={`text-center text-lg font-bold mb-4 ${scanStatus === "in" ? "text-emerald-500" : "text-blue-400"}`}>
                  {scanStatus === "in" ? "CHECKED IN" : "CHECKED OUT"}
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/15 text-primary font-semibold">{scanResult.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-foreground">{scanResult.name}</p>
                    <p className="text-sm text-muted-foreground">Seat {scanResult.seat}</p>
                    <div className="flex gap-2 mt-1"><MembershipBadge type={scanResult.membership} /><StatusBadge status={scanResult.status} /></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Today's log */}
          <div className="mt-4 bg-card border border-card-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border"><p className="text-sm font-medium">Today's Attendance Log</p></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/30">
                  {["Student", "Seat", "Check In", "Check Out", "Duration", "Status"].map((h, i) => (
                    <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mockAttendance.map((a, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-medium text-sm">{a.student}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{a.seat}</td>
                      <td className="px-4 py-2.5 text-sm">{a.checkIn}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">{a.checkOut}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{a.duration}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-4">
          {[
            { label: "Current Occupancy", value: "23/80", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Currently Inside", value: "23", icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", live: true },
            { label: "Today's Total", value: "47", icon: QrCode, color: "text-indigo-400", bg: "bg-indigo-500/10" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}><Icon className={`w-4.5 h-4.5 ${s.color}`} /></div>
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
            <div className="space-y-2">
              {mockStudents.filter(s => s.checkedIn).slice(0, 6).map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Avatar className="w-6 h-6"><AvatarFallback className="text-xs bg-primary/15 text-primary">{s.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.seat} · {s.checkInTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
