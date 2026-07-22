import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Printer, X, RotateCcw, BookOpen, Phone, MapPin, Maximize2 } from "lucide-react";
import StudentLayout from "@/layouts/StudentLayout";
import { useApi } from "@/hooks/useApi";
import { getStudentMeIdCard, type StudentIdCardDTO } from "@/lib/api";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import QrCodeSvg from "@/components/QrCodeSvg";
import { cn } from "@/lib/utils";

const fmtDate = (d: string | null) => (d ? format(new Date(d), "dd MMM yyyy") : "—");
const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2);

function CardFront({ flip, card }: { flip: () => void; card: StudentIdCardDTO }) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl overflow-hidden select-none cursor-pointer" onClick={flip}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="absolute rounded-full border border-white/20" style={{ width: 60 + i * 50, height: 60 + i * 50, left: -30 + i * 10, top: -30 + i * 10 }} />
        ))}
      </div>

      {/* Gradient accents */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/15 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl" />

      <div className="relative p-5 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">{card.libraryName}</p>
              <p className="text-xs text-white/50 leading-tight">Student ID Card</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-sky-300 font-mono font-bold">{card.id}</p>
            <p className="text-xs text-white/40">Valid till {fmtDate(card.membershipEndDate)}</p>
          </div>
        </div>

        {/* Photo + info */}
        <div className="flex items-center gap-4 mb-5">
          {/* Photo placeholder */}
          <div className="w-16 h-16 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-black text-white/80">{initials(card.name)}</span>
          </div>
          <div>
            <p className="text-lg font-black text-white leading-tight">{card.name}</p>
            <p className="text-xs text-sky-300 font-medium mt-0.5">{card.membershipType} Member</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1 text-xs text-white/60"><MapPin className="w-3 h-3" /> Seat {card.seatNumber}</span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              <span className="text-xs text-white/60">ID {card.id}</span>
            </div>
          </div>
        </div>

        {/* QR + details */}
        <div className="flex items-end gap-4 mt-auto">
          <div className="bg-white p-1.5 rounded-lg">
            <QrCodeSvg data={card.qrToken} size={72} />
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { l: "Membership", v: card.membershipType },
                { l: "Status", v: "Active" },
                { l: "Seat No.", v: card.seatNumber ?? "—" },
                { l: "Library", v: card.libraryName },
              ].map((d, i) => (
                <div key={i} className="bg-white/5 rounded px-2 py-1">
                  <p className="text-white/40 text-[10px]">{d.l}</p>
                  <p className="text-white font-semibold leading-tight">{d.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tap hint */}
        <p className="text-center text-[10px] text-white/25 mt-3">Tap to flip card</p>
      </div>
    </div>
  );
}

function CardBack({ flip, card }: { flip: () => void; card: StudentIdCardDTO }) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 rounded-2xl overflow-hidden select-none cursor-pointer" onClick={flip}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute text-white/80 text-xs font-mono" style={{ left: `${(i * 17) % 100}%`, top: `${(i * 23) % 100}%` }}>
            LOS
          </div>
        ))}
      </div>

      <div className="relative p-5 h-full flex flex-col">
        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Back of Card</p>

        {/* QR token */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-3">
          <p className="text-xs font-bold text-sky-400 mb-1">QR Token</p>
          <p className="text-xs font-mono text-white/80 break-all select-all">{card.qrToken}</p>
        </div>

        {/* Library contact */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-3">
          <p className="text-xs font-bold text-sky-400 mb-2">Library Contact</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-white/70">
              <BookOpen className="w-3 h-3 flex-shrink-0" />
              <span>{card.libraryName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <span>{card.phone}</span>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex-1">
          <p className="text-xs font-bold text-white/40 mb-2">Terms & Instructions</p>
          <ul className="space-y-1 text-[10px] text-white/40">
            <li>• This card is non-transferable and for personal use only.</li>
            <li>• Must be presented at reception on request.</li>
            <li>• Report loss immediately to library management.</li>
            <li>• Maintain silence and discipline in library premises.</li>
            <li>• Card valid till membership expiry date shown on front.</li>
          </ul>
        </div>

        <p className="text-center text-[10px] text-white/20 mt-3">Tap to flip card</p>
      </div>
    </div>
  );
}

export default function StudentIdCard() {
  const [flipped, setFlipped] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const { data: card, loading } = useApi(getStudentMeIdCard);

  if (loading || !card) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">Loading…</div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-foreground">Virtual ID Card</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your digital student identity card</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* 3D flip container */}
          <div className="relative" style={{ perspective: "1000px" }}>
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-full"
            >
              {/* Front */}
              <div style={{ backfaceVisibility: "hidden" }} className="w-full aspect-[1.6/1]">
                <CardFront flip={() => setFlipped(true)} card={card} />
              </div>
              {/* Back */}
              <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} className="w-full aspect-[1.6/1] absolute inset-0">
                <CardBack flip={() => setFlipped(false)} card={card} />
              </div>
            </motion.div>
          </div>

          {/* Flip indicator dots */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <button onClick={() => setFlipped(false)} className={cn("w-2 h-2 rounded-full transition-all", !flipped ? "bg-sky-400 w-4" : "bg-muted")} />
            <button onClick={() => setFlipped(true)} className={cn("w-2 h-2 rounded-full transition-all", flipped ? "bg-sky-400 w-4" : "bg-muted")} />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-4">
            <Button variant="outline" size="sm" className="flex-1 h-9 gap-1.5 text-xs" onClick={() => setFlipped(!flipped)}>
              <RotateCcw className="w-3.5 h-3.5" /> Flip Card
            </Button>
            <Button variant="outline" size="sm" className="flex-1 h-9 gap-1.5 text-xs">
              <Download className="w-3.5 h-3.5" /> Download
            </Button>
            <Button variant="outline" size="sm" className="flex-1 h-9 gap-1.5 text-xs">
              <Printer className="w-3.5 h-3.5" /> Print
            </Button>
          </div>
        </motion.div>

        {/* QR Code section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          {/* QR card */}
          <div className="bg-card border border-card-border rounded-2xl p-6 flex flex-col items-center">
            <p className="text-sm font-semibold mb-4">Quick Scan QR Code</p>
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              <QrCodeSvg data={card.qrToken} size={180} />
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center break-all">Token: {card.qrToken}</p>
            <p className="text-xs text-muted-foreground mt-1 text-center">Show this QR code at the reception for quick check-in / check-out</p>
            <Button
              className="mt-4 w-full h-10 gap-2 text-sm bg-sky-600 hover:bg-sky-700"
              onClick={() => setFullscreen(true)}
            >
              <Maximize2 className="w-4 h-4" /> Full Screen QR
            </Button>
          </div>

          {/* Student info summary */}
          <div className="bg-card border border-card-border rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Card Details</p>
            {[
              { label: "Name", value: card.name },
              { label: "Student ID", value: card.id },
              { label: "Membership", value: `${card.membershipType} — Active` },
              { label: "Seat", value: card.seatNumber ?? "—" },
              { label: "Issued By", value: card.libraryName },
              { label: "Valid Till", value: fmtDate(card.membershipEndDate) },
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 border-b border-border/40 last:border-0">
                <p className="text-xs text-muted-foreground w-24 flex-shrink-0">{d.label}</p>
                <p className="text-xs font-semibold text-foreground">{d.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Full Screen QR Modal */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
            {/* Simulated brightness overlay */}
            <div className="absolute inset-0 bg-white/5" />

            <button onClick={() => setFullscreen(false)} className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10">
              <X className="w-5 h-5 text-white" />
            </button>

            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 200 }} className="flex flex-col items-center gap-6 z-10">
              {/* Big QR */}
              <div className="bg-white p-5 rounded-3xl shadow-2xl">
                <QrCodeSvg data={card.qrToken} size={260} />
              </div>

              <div className="text-center">
                <p className="text-white text-2xl font-black tracking-tight">{card.name}</p>
                <p className="text-white/50 text-sm font-mono mt-1">{card.id}</p>
                <p className="text-sky-400 text-sm font-medium mt-1">Seat {card.seatNumber} · {card.membershipType} Plan</p>
                <p className="text-white/40 text-xs font-mono mt-2 break-all px-8">Token: {card.qrToken}</p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-white/30">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Screen brightness increased for easy scanning
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs border-white/20 text-white hover:bg-white/10">
                  <Download className="w-3.5 h-3.5" /> Download
                </Button>
                <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs border-white/20 text-white hover:bg-white/10">
                  <Printer className="w-3.5 h-3.5" /> Print
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </StudentLayout>
  );
}
