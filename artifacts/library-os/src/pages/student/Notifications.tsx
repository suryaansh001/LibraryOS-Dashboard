import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, AlertCircle, Info, Check } from "lucide-react";
import StudentLayout from "@/layouts/StudentLayout";
import { studentNotifications } from "@/data/studentData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Notif = typeof studentNotifications[0];

function NotifIcon({ type }: { type: string }) {
  if (type === "success") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (type === "warning") return <AlertCircle className="w-4 h-4 text-amber-400" />;
  return <Info className="w-4 h-4 text-sky-400" />;
}

const typeBg: Record<string, string> = {
  success: "bg-emerald-500/8 border-emerald-500/20",
  warning: "bg-amber-500/8 border-amber-500/20",
  info: "bg-sky-500/8 border-sky-500/20",
};

export default function StudentNotifications() {
  const [notifs, setNotifs] = useState<Notif[]>(studentNotifications);
  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <StudentLayout>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            Notifications
            {unread > 0 && <span className="text-xs font-semibold bg-sky-500 text-white px-1.5 py-0.5 rounded-full">{unread}</span>}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{unread > 0 ? `${unread} unread notifications` : "All caught up!"}</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={markAllRead}>
            <Check className="w-3.5 h-3.5" /> Mark all read
          </Button>
        )}
      </div>

      {/* Unread */}
      {unread > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">New</p>
          <div className="space-y-2">
            {notifs.filter(n => !n.read).map((n, i) => (
              <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className={`flex items-start gap-3 p-4 rounded-xl border ${typeBg[n.type]} cursor-pointer`} onClick={() => markRead(n.id)}>
                <div className="flex-shrink-0 mt-0.5"><NotifIcon type={n.type} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{n.title}</p>
                    <span className="w-2 h-2 bg-sky-500 rounded-full flex-shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1.5">{n.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Read */}
      {notifs.filter(n => n.read).length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Earlier</p>
          <div className="space-y-2">
            {notifs.filter(n => n.read).map((n, i) => (
              <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-card opacity-60 hover:opacity-80 transition-opacity">
                <div className="flex-shrink-0 mt-0.5 opacity-50"><NotifIcon type={n.type} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-muted-foreground/50 mt-1.5">{n.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {notifs.length === 0 && (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No notifications yet</p>
        </div>
      )}
    </StudentLayout>
  );
}
