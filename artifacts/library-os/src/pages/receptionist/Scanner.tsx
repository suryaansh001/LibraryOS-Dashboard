import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, CheckCircle2, XCircle, Users, UserCheck, QrCode } from "lucide-react";
import ReceptionistLayout from "@/layouts/ReceptionistLayout";
import { mockStudents } from "@/data/mockData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MembershipBadge from "@/components/MembershipBadge";
import StatusBadge from "@/components/StatusBadge";

export default function ReceptionistScanner() {
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<typeof mockStudents[0] | null>(null);
  const [action, setAction] = useState<"in" | "out">("in");

  const handleScan = () => {
    const s = mockStudents[Math.floor(Math.random() * 7)];
    setResult(s);
    setAction(s.checkedIn ? "out" : "in");
    setScanned(true);
    setTimeout(() => setScanned(false), 5000);
  };

  return (
    <ReceptionistLayout>
      <div className="max-w-lg mx-auto space-y-5">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground mb-1">QR Scanner</h1>
          <p className="text-sm text-muted-foreground">Tap the camera area to simulate a scan</p>
        </div>

        {/* Camera */}
        <div className="relative bg-black rounded-2xl overflow-hidden aspect-square cursor-pointer shadow-2xl" onClick={handleScan} data-testid="scanner-area">
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 50% 50%, hsl(239 84% 67% / 0.4) 0%, transparent 70%)" }} />

          {/* Corner markers */}
          {["top-6 left-6 border-t-4 border-l-4", "top-6 right-6 border-t-4 border-r-4", "bottom-6 left-6 border-b-4 border-l-4", "bottom-6 right-6 border-b-4 border-r-4"].map((cls, i) => (
            <motion.div key={i} animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }} className={`absolute w-10 h-10 border-primary rounded-sm ${cls}`} />
          ))}

          {/* Scan line */}
          <motion.div
            animate={{ y: [-120, 120] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-lg"
            style={{ boxShadow: "0 0 12px hsl(239 84% 67%)" }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
            <QrCode className="w-16 h-16 mb-3" />
            <p className="text-sm font-medium">Tap to scan</p>
          </div>
        </div>

        {/* Result */}
        <AnimatePresence>
          {scanned && result && (
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }}>
              <div className={`rounded-2xl border p-5 ${action === "in" ? "border-emerald-500/30 bg-emerald-500/5" : "border-blue-500/30 bg-blue-500/5"}`}>
                <div className="flex items-center justify-center gap-2 mb-4">
                  {action === "in"
                    ? <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                    : <XCircle className="w-7 h-7 text-blue-400" />}
                  <span className={`text-2xl font-black tracking-tight ${action === "in" ? "text-emerald-500" : "text-blue-400"}`}>
                    CHECKED {action === "in" ? "IN" : "OUT"}
                  </span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-background/50 rounded-xl">
                  <Avatar className="w-14 h-14">
                    <AvatarFallback className="text-lg bg-primary/15 text-primary font-bold">{result.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-base font-bold text-foreground">{result.name}</p>
                    <p className="text-sm text-muted-foreground">Seat {result.seat} · {result.id}</p>
                    <div className="flex gap-2 mt-1.5">
                      <MembershipBadge type={result.membership} />
                      <StatusBadge status={result.status} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-card-border rounded-xl p-4 text-center">
            <UserCheck className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-emerald-500">{mockStudents.filter(s => s.checkedIn).length}</p>
            <p className="text-xs text-muted-foreground">Currently Inside</p>
          </div>
          <div className="bg-card border border-card-border rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-indigo-400">47</p>
            <p className="text-xs text-muted-foreground">Today's Total</p>
          </div>
        </div>
      </div>
    </ReceptionistLayout>
  );
}
