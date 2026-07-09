import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ClipboardCheck, BadgeCheck, Wallet, CreditCard,
  Bell, User, BookOpen, ChevronLeft, ChevronRight, Sun, Moon, LogOut
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/context/ThemeContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { currentStudent } from "@/data/studentData";

const navItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/student/attendance", icon: ClipboardCheck },
  { label: "Membership", href: "/student/membership", icon: BadgeCheck },
  { label: "Payments", href: "/student/payments", icon: Wallet },
  { label: "ID Card", href: "/student/id-card", icon: CreditCard },
  { label: "Notifications", href: "/student/notifications", icon: Bell },
  { label: "Profile", href: "/student/profile", icon: User },
];

const mobileNavItems = navItems.slice(0, 5);

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const isActive = (href: string) => location === href || location.startsWith(href);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar — hidden on mobile */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex relative flex-col h-screen bg-sidebar border-r border-sidebar-border flex-shrink-0 overflow-hidden z-20"
      >
        {/* Header */}
        <div className="flex items-center h-14 px-3 border-b border-sidebar-border flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }} className="font-bold text-sm text-sidebar-foreground whitespace-nowrap">
                  LibraryOS
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button onClick={() => setCollapsed(!collapsed)} className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Student badge */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-3 mt-3 mb-1 px-2.5 py-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
              <p className="text-xs font-semibold text-sky-400">Student Portal</p>
              <p className="text-xs text-muted-foreground truncate">{currentStudent.library}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <motion.div layout className={cn("flex items-center gap-3 px-2.5 py-2 rounded-lg cursor-pointer transition-colors relative", active ? "bg-sky-500/15 text-sky-400" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")}>
                      {active && <motion.div layoutId="student-active-nav" className="absolute inset-0 bg-sky-500/15 rounded-lg" transition={{ type: "spring", stiffness: 400, damping: 35 }} />}
                      <Icon className={cn("w-4 h-4 flex-shrink-0 z-10", active && "text-sky-400")} />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }} className={cn("text-sm font-medium whitespace-nowrap z-10", active && "text-sky-400")}>
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right" className="text-xs">{item.label}</TooltipContent>}
              </Tooltip>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-2 flex-shrink-0 space-y-1">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className={cn("flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer", collapsed && "justify-center")}>
                <Avatar className="w-7 h-7 flex-shrink-0">
                  <AvatarFallback className="bg-sky-500/20 text-sky-400 text-xs font-medium">AK</AvatarFallback>
                </Avatar>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-sidebar-foreground truncate">{currentStudent.name}</p>
                      <p className="text-xs text-sky-400 truncate">Student · {currentStudent.id}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right"><p className="font-medium">{currentStudent.name}</p><p className="text-xs text-sky-400">Student</p></TooltipContent>}
          </Tooltip>
        </div>
      </motion.aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center px-4 gap-3 flex-shrink-0 bg-background/95 backdrop-blur z-10">
          {/* Mobile: logo */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center"><BookOpen className="w-4 h-4 text-primary-foreground" /></div>
            <span className="font-bold text-sm">LibraryOS</span>
            <span className="text-xs text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full font-medium">Student</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Link href="/student/notifications" className="relative">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-sky-500 rounded-full" />
              </Button>
            </Link>
            <Link href="/student/profile" className="hidden md:block">
              <Avatar className="w-7 h-7 cursor-pointer">
                <AvatarFallback className="bg-sky-500/20 text-sky-400 text-xs font-semibold">AK</AvatarFallback>
              </Avatar>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="hidden md:flex h-8 text-xs gap-1">
                <LogOut className="w-3.5 h-3.5" /> Exit Portal
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden border-t border-border bg-background/95 backdrop-blur sticky bottom-0 z-10">
          <div className="flex items-stretch">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} className="flex-1">
                  <div className={cn("flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors", active ? "text-sky-400" : "text-muted-foreground")}>
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
