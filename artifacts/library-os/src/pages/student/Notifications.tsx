import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import StudentLayout from "@/layouts/StudentLayout";

export default function StudentNotifications() {
  return (
    <StudentLayout>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">All caught up!</p>
        </div>
      </div>

      <div className="text-center py-16">
        <Bell className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
        <p className="text-sm font-medium text-muted-foreground">No notifications yet</p>
      </div>
    </StudentLayout>
  );
}
