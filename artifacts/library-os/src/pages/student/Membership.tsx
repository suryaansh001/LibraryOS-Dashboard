import { motion } from "framer-motion";
import { BadgeCheck, CalendarDays, Clock, AlertCircle, RefreshCw, Zap } from "lucide-react";
import StudentLayout from "@/layouts/StudentLayout";
import { currentStudent } from "@/data/studentData";
import { Button } from "@/components/ui/button";

const daysRemaining = 19;
const daysTotal = 31;
const pct = Math.round((daysRemaining / daysTotal) * 100);

const membershipFeatures = [
  "Unlimited library access (06:00 AM – 11:00 PM)",
  "Dedicated seat A-14",
  "QR code check-in",
  "Attendance tracking",
  "Study progress dashboard",
  "Access to reading material shelf",
];

export default function StudentMembership() {
  return (
    <StudentLayout>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-foreground">Membership</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your current plan and benefits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main card */}
        <div className="lg:col-span-2 space-y-4">
          {/* Plan card */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-sky-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-600/8 to-indigo-600/5 pointer-events-none" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <BadgeCheck className="w-5 h-5 text-sky-400" />
                    <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">Current Plan</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{currentStudent.membership} Membership</h2>
                  <p className="text-3xl font-black text-sky-400 mt-1">₹500<span className="text-base font-normal text-muted-foreground">/month</span></p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">Active</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "Start Date", value: currentStudent.startDate, icon: CalendarDays },
                  { label: "Expiry Date", value: currentStudent.expiryDate, icon: CalendarDays },
                  { label: "Assigned Seat", value: `Seat ${currentStudent.seat}`, icon: Zap },
                  { label: "Library", value: currentStudent.library, icon: BadgeCheck },
                ].map((d, i) => {
                  const Icon = d.icon;
                  return (
                    <div key={i} className="flex items-center gap-2.5 p-3 bg-background/50 rounded-lg border border-border/50">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{d.label}</p>
                        <p className="text-sm font-semibold text-foreground truncate">{d.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Days remaining */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium">Days Remaining</p>
                  <span className={`text-sm font-bold ${daysRemaining <= 7 ? "text-amber-400" : "text-sky-400"}`}>{daysRemaining} / {daysTotal} days</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.4, ease: "easeOut" }} className={`h-full rounded-full ${daysRemaining <= 7 ? "bg-amber-400" : "bg-sky-500"}`} />
                </div>
                {daysRemaining <= 7 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <p className="text-xs text-amber-400 font-medium">Membership expiring in {daysRemaining} days. Please renew to continue access.</p>
                  </div>
                )}
              </div>

              {/* Renew button */}
              <Button disabled className="w-full h-10 gap-2 text-sm opacity-60 cursor-not-allowed bg-sky-600">
                <RefreshCw className="w-4 h-4" /> Renew Online (Coming Soon)
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">Online renewal will be available soon via Razorpay. Contact reception to renew now.</p>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-card-border rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">What's Included</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {membershipFeatures.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <BadgeCheck className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Hourly plans sidebar */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-card-border rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-3">Hourly Plan Info</h3>
            <p className="text-xs text-muted-foreground mb-3">Your current plan is a Monthly flat plan. Hourly plans are also available.</p>
            {[
              { label: "Purchased Hours", value: "—" },
              { label: "Used Hours", value: "—" },
              { label: "Remaining Hours", value: "—" },
            ].map((h, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <p className="text-xs text-muted-foreground">{h.label}</p>
                <p className="text-xs font-semibold text-foreground">{h.value}</p>
              </div>
            ))}
            <p className="text-xs text-muted-foreground mt-3 p-2.5 bg-muted/50 rounded-lg">Switch to an Hourly plan at the reception counter to track hours precisely.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-card-border rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-3">Library Timings</h3>
            {[
              { shift: "Morning", time: "06:00 AM – 12:00 PM" },
              { shift: "Afternoon", time: "12:00 PM – 06:00 PM" },
              { shift: "Evening", time: "06:00 PM – 11:00 PM" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 py-2 border-b border-border/50 last:border-0">
                <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground">{t.shift}</p>
                  <p className="text-xs text-muted-foreground">{t.time}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </StudentLayout>
  );
}
