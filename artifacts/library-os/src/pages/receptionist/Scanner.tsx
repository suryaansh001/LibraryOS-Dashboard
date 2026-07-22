import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Users, UserCheck, QrCode, Loader2 } from "lucide-react";
import ReceptionistLayout from "@/layouts/ReceptionistLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import {
  qrCheckIn,
  qrCheckOut,
  getOccupancy,
  type CheckInResponseDTO,
  type AttendanceSessionDTO,
} from "@/lib/api";

interface ScanResult {
  action: "in" | "out";
  data: CheckInResponseDTO | AttendanceSessionDTO;
}

export default function ReceptionistScanner() {
  const [token, setToken] = useState("");
  const [mode, setMode] = useState<"in" | "out">("in");
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: occupancy } = useApi(getOccupancy);

  const handleScan = async () => {
    if (!token.trim()) {
      setError("Enter a QR token before scanning");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = mode === "in" ? await qrCheckIn(token.trim()) : await qrCheckOut(token.trim());
      setResult({ action: mode, data });
      setScanned(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scan failed");
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  const resultName = result ? ("studentName" in result.data ? result.data.studentName : (result.data as AttendanceSessionDTO).studentName) : "";
  const resultSeat = result ? (result.data.seatNumber ?? "—") : "";
  const resultTime = result
    ? "studentId" in result.data
      ? (result.data.checkOutAt
          ? format(new Date(result.data.checkOutAt), "dd MMM yyyy HH:mm")
          : "—")
      : format(new Date(result.data.checkInAt), "dd MMM yyyy HH:mm")
    : "";

  return (
    <ReceptionistLayout>
      <div className="max-w-lg mx-auto space-y-5">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground mb-1">QR Scanner</h1>
          <p className="text-sm text-muted-foreground">Enter a QR token and tap to scan</p>
        </div>

        {/* Token + mode */}
        <div className="space-y-3">
          <Input
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Paste or scan QR token"
            className="h-12 text-base"
            data-testid="qr-token-input"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => setMode("in")}
              variant={mode === "in" ? "default" : "outline"}
              className="flex-1"
              data-testid="mode-in"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Check In
            </Button>
            <Button
              type="button"
              onClick={() => setMode("out")}
              variant={mode === "out" ? "default" : "outline"}
              className="flex-1"
              data-testid="mode-out"
            >
              <XCircle className="w-4 h-4 mr-1.5" /> Check Out
            </Button>
          </div>
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
            {loading ? (
              <Loader2 className="w-16 h-16 mb-3 animate-spin" />
            ) : (
              <QrCode className="w-16 h-16 mb-3" />
            )}
            <p className="text-sm font-medium">{loading ? "Processing..." : "Tap to scan"}</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" data-testid="scan-error">
            {error}
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {scanned && result && !error && (
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }}>
              <div className={`rounded-2xl border p-5 ${result.action === "in" ? "border-emerald-500/30 bg-emerald-500/5" : "border-blue-500/30 bg-blue-500/5"}`}>
                <div className="flex items-center justify-center gap-2 mb-4">
                  {result.action === "in"
                    ? <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                    : <XCircle className="w-7 h-7 text-blue-400" />}
                  <span className={`text-2xl font-black tracking-tight ${result.action === "in" ? "text-emerald-500" : "text-blue-400"}`}>
                    CHECKED {result.action === "in" ? "IN" : "OUT"}
                  </span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-background/50 rounded-xl">
                  <Avatar className="w-14 h-14">
                    <AvatarFallback className="text-lg bg-primary/15 text-primary font-bold">{resultName.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-base font-bold text-foreground">{resultName}</p>
                    <p className="text-sm text-muted-foreground">Seat {resultSeat}</p>
                    <p className="text-xs text-muted-foreground mt-1">Occupancy: {occupancy?.currentCount ?? "—"}/{occupancy?.capacity ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{result.action === "in" ? "Checked in" : "Checked out"}: {resultTime}</p>
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
            <p className="text-2xl font-bold text-emerald-500">{occupancy?.currentCount ?? "—"}</p>
            <p className="text-xs text-muted-foreground">Currently Inside</p>
          </div>
          <div className="bg-card border border-card-border rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-indigo-400">{occupancy?.capacity ?? "—"}</p>
            <p className="text-xs text-muted-foreground">Total Capacity</p>
          </div>
        </div>
      </div>
    </ReceptionistLayout>
  );
}
