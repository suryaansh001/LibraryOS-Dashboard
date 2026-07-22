import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { cn } from "@/lib/utils";
import { useApi } from "@/hooks/useApi";
import { getSeats, type SeatListItemDTO } from "@/lib/api";

export default function Seats() {
  const { data: seats, loading } = useApi<SeatListItemDTO[]>(getSeats);
  const [selected, setSelected] = useState<SeatListItemDTO | null>(null);

  const available = (seats ?? []).filter(s => s.status === "available").length;
  const occupied = (seats ?? []).filter(s => s.status === "occupied").length;
  const maintenance = (seats ?? []).filter(s => s.status === "maintenance").length;

  return (
    <DashboardLayout>
      <PageHeader title="Seat Management" description={`${available} available · ${occupied} occupied · ${maintenance} maintenance`} />

      {/* Legend */}
      <div className="flex items-center gap-5 mb-5">
        {[
          { label: `Available (${available})`, color: "bg-emerald-500/20 border-emerald-500/40" },
          { label: `Occupied (${occupied})`, color: "bg-destructive/20 border-destructive/40" },
          { label: `Maintenance (${maintenance})`, color: "bg-amber-500/20 border-amber-500/40" },
        ].map((l, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className={`w-4 h-4 rounded border ${l.color}`} />
            {l.label}
          </div>
        ))}
      </div>

      <div className="flex gap-5">
        {/* Grid */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex-1 bg-card border border-card-border rounded-xl p-5">
          {loading && <p className="text-sm text-muted-foreground py-8 text-center">Loading seats…</p>}
          {!loading && (
            <div className="grid grid-cols-10 gap-2">
              {(seats ?? []).map((seat, i) => (
                <motion.button
                  key={seat.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.003 }}
                  onClick={() => setSelected(selected?.id === seat.id ? null : seat)}
                  className={cn(
                    "aspect-square rounded-lg text-xs font-mono font-semibold border transition-all",
                    seat.status === "available" && "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20",
                    seat.status === "occupied" && "bg-destructive/15 border-destructive/30 text-destructive hover:bg-destructive/25",
                    seat.status === "maintenance" && "bg-amber-500/10 border-amber-500/30 text-amber-400",
                    selected?.id === seat.id && "ring-2 ring-primary ring-offset-1 ring-offset-background scale-105"
                  )}
                  data-testid={`seat-${seat.seatNumber}`}
                >
                  {seat.seatNumber.split("-").pop()}
                </motion.button>
              ))}
            </div>
          )}
          {!loading && (seats ?? []).length > 0 && (
            <div className="mt-4 pt-3 border-t border-border flex items-center gap-3 text-xs text-muted-foreground">
              {Array.from(new Set((seats ?? []).map(s => (s.section ?? s.seatNumber.split("-")[0]).trim()))).map((row, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="font-mono font-semibold text-foreground">Row {row}</span>
                  <span>({(seats ?? []).filter(s => (s.section ?? s.seatNumber.split("-")[0]).trim() === row).length} seats)</span>
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Detail panel */}
        {selected && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-64 bg-card border border-card-border rounded-xl p-5 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Seat {selected.seatNumber}</h3>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <span className={cn("text-xs font-semibold mt-0.5 px-2 py-0.5 rounded-md border inline-block",
                  selected.status === "available" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/20" :
                  selected.status === "occupied" ? "bg-destructive/15 text-destructive border-destructive/20" :
                  "bg-amber-500/15 text-amber-400 border-amber-500/20"
                )}>{selected.status}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Section</p>
                <p className="text-sm font-medium mt-0.5">{selected.section ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm font-medium capitalize mt-0.5">{selected.type}</p>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              {selected.status === "available" && (
                <button className="w-full text-xs py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors">Assign Student</button>
              )}
              {selected.status === "occupied" && (
                <>
                  <button className="w-full text-xs py-2 rounded-lg border border-border hover:bg-muted/50 text-foreground font-medium transition-colors">View Student</button>
                  <button className="w-full text-xs py-2 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 font-medium transition-colors">Remove Assignment</button>
                </>
              )}
              {selected.status === "maintenance" && (
                <button className="w-full text-xs py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium transition-colors">Mark Available</button>
              )}
              {selected.status !== "maintenance" && (
                <button className="w-full text-xs py-2 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 font-medium transition-colors">Mark Maintenance</button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
