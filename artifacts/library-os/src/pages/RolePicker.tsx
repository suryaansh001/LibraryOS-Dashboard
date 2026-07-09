import { motion } from "framer-motion";
import { Link } from "wouter";
import { BookOpen, Shield, Building2, UserCheck, ArrowRight, GraduationCap } from "lucide-react";
import { useRole } from "@/context/RoleContext";
import type { Role } from "@/context/RoleContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

const roles = [
  {
    role: "super-admin" as Role,
    label: "Super Admin",
    description: "Manage all libraries, subscriptions, revenue, and platform-wide settings.",
    icon: Shield,
    href: "/admin/dashboard",
    gradient: "from-purple-600/20 to-indigo-600/20",
    border: "border-purple-500/20 hover:border-purple-500/50",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-400",
    tag: "Platform Management",
    tagColor: "bg-purple-500/15 text-purple-400",
  },
  {
    role: "owner" as Role,
    label: "Library Owner",
    description: "Manage students, attendance, seats, memberships, payments, and reports.",
    icon: Building2,
    href: "/dashboard",
    gradient: "from-indigo-600/20 to-blue-600/20",
    border: "border-indigo-500/20 hover:border-indigo-500/50",
    iconBg: "bg-indigo-500/15",
    iconColor: "text-indigo-400",
    tag: "Full Access",
    tagColor: "bg-indigo-500/15 text-indigo-400",
  },
  {
    role: "receptionist" as Role,
    label: "Receptionist",
    description: "Quick check-in, check-out, QR scanning, student search, and payment recording.",
    icon: UserCheck,
    href: "/receptionist/dashboard",
    gradient: "from-emerald-600/20 to-teal-600/20",
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    tag: "Quick Actions",
    tagColor: "bg-emerald-500/15 text-emerald-400",
  },
  {
    role: "student" as Role,
    label: "Student",
    description: "View your attendance, membership, payments, ID card, and study progress.",
    icon: GraduationCap,
    href: "/student/login",
    gradient: "from-sky-600/20 to-cyan-600/20",
    border: "border-sky-500/20 hover:border-sky-500/50",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-400",
    tag: "Student Portal",
    tagColor: "bg-sky-500/15 text-sky-400",
  },
];

export default function RolePicker() {
  const { setRole } = useRole();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm text-foreground">LibraryOS</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Link href="/login">
            <Button variant="outline" size="sm" className="h-8 text-xs">Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span className="text-xs font-medium text-primary">Interactive Demo</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
            Welcome to LibraryOS
          </h1>
          <p className="text-muted-foreground text-base max-w-md leading-relaxed">
            The premium operating system for modern study libraries. Choose a role to explore the dashboard.
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
          {roles.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + i * 0.08 }}
              >
                <Link href={item.href}>
                  <div
                    onClick={() => setRole(item.role)}
                    className={`relative group cursor-pointer bg-card border ${item.border} rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}
                    data-testid={`role-card-${item.role}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl opacity-40 group-hover:opacity-70 transition-opacity`} />
                    <div className="relative">
                      <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center mb-4`}>
                        <Icon className={`w-5 h-5 ${item.iconColor}`} />
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.tagColor} mb-3 inline-block`}>{item.tag}</span>
                      <h3 className="text-base font-bold text-foreground mb-2">{item.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                        Enter Dashboard <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-xs text-muted-foreground"
        >
          Demo mode — all data is mock. No real library is being managed.
        </motion.p>
      </main>
    </div>
  );
}
