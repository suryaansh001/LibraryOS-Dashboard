import { motion } from "framer-motion";
import { User, Phone, Mail, MapPin, CalendarDays, Building2, AlertCircle, BadgeCheck } from "lucide-react";
import StudentLayout from "@/layouts/StudentLayout";
import { currentStudent } from "@/data/studentData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const fields = [
  { label: "Phone Number", value: currentStudent.phone, icon: Phone },
  { label: "Email Address", value: currentStudent.email, icon: Mail },
  { label: "Address", value: currentStudent.address, icon: MapPin },
  { label: "Emergency Contact", value: currentStudent.emergencyContact, icon: AlertCircle },
  { label: "Joining Date", value: currentStudent.joinDate, icon: CalendarDays },
  { label: "Library", value: currentStudent.library, icon: Building2 },
];

export default function StudentProfile() {
  return (
    <StudentLayout>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-card-border rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-3xl font-bold bg-sky-500/15 text-sky-400">AK</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-card flex items-center justify-center">
              <BadgeCheck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-foreground">{currentStudent.name}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{currentStudent.id}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/20">Student</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">Active</span>
          </div>

          <div className="w-full border-t border-border mt-5 pt-5 space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Seat</span>
              <span className="text-xs font-bold font-mono text-foreground">{currentStudent.seat}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Membership</span>
              <span className="text-xs font-semibold text-sky-400">{currentStudent.membership}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Expires</span>
              <span className="text-xs font-semibold text-amber-400">{currentStudent.expiryDate}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center leading-relaxed">To update your information, please contact the library reception.</p>
        </motion.div>

        {/* Info fields */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-3">
          <div className="bg-card border border-card-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><User className="w-4 h-4 text-sky-400" /> Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.04 }} className="p-3 bg-muted/30 rounded-xl border border-border/50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <p className="text-xs text-muted-foreground font-medium">{f.label}</p>
                    </div>
                    <p className="text-sm font-medium text-foreground pl-5">{f.value}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Building2 className="w-4 h-4 text-sky-400" /> Library Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Library Name", value: currentStudent.library },
                { label: "Library Phone", value: currentStudent.libraryPhone },
                { label: "Library Address", value: currentStudent.libraryAddress },
                { label: "Member Since", value: currentStudent.joinDate },
              ].map((f, i) => (
                <div key={i} className="p-3 bg-muted/30 rounded-xl border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">{f.label}</p>
                  <p className="text-sm font-medium text-foreground">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </StudentLayout>
  );
}
