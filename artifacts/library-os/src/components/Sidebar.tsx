import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Building2, CreditCard, TrendingUp, Users, Package, Settings,
  ClipboardCheck, Grid3X3, BadgeCheck, Wallet, Receipt, BarChart3, UserCog,
  ChevronLeft, ChevronRight, BookOpen, LogOut
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  group?: string;
};

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Libraries", href: "/admin/libraries", icon: Building2 },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { label: "Revenue", href: "/admin/revenue", icon: TrendingUp },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Plans", href: "/admin/plans", icon: Package },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const ownerNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/students", icon: Users },
  { label: "Attendance", href: "/attendance", icon: ClipboardCheck },
  { label: "Seats", href: "/seats", icon: Grid3X3 },
  { label: "Memberships", href: "/memberships", icon: BadgeCheck },
  { label: "Payments", href: "/payments", icon: Wallet },
  { label: "Expenses", href: "/expenses", icon: Receipt },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Staff", href: "/staff", icon: UserCog },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();
  const { role } = useRole();

  const navItems = role === "super-admin" ? adminNav : ownerNav;
  const roleName = role === "super-admin" ? "Super Admin" : role === "owner" ? "Library Owner" : "Receptionist";
  const roleColor = role === "super-admin" ? "text-purple-400" : role === "owner" ? "text-indigo-400" : "text-emerald-400";

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/admin/dashboard") return location === href;
    return location.startsWith(href);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border flex-shrink-0 overflow-hidden z-20"
      data-testid="sidebar"
    >
      {/* Header */}
      <div className="flex items-center h-14 px-3 border-b border-sidebar-border flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="font-bold text-sm text-sidebar-foreground whitespace-nowrap"
              >
                LibraryOS
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          data-testid="sidebar-collapse-toggle"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link href={item.href}>
                  <motion.div
                    layout
                    className={cn(
                      "flex items-center gap-3 px-2.5 py-2 rounded-lg cursor-pointer transition-colors relative",
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    data-testid={`nav-${item.label.toLowerCase()}`}
                  >
                    {active && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute inset-0 bg-primary/15 rounded-lg"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                    <Icon className={cn("w-4 h-4 flex-shrink-0 z-10", active && "text-primary")} />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.1 }}
                          className={cn("text-sm font-medium whitespace-nowrap z-10", active && "text-primary")}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="text-xs">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2 flex-shrink-0">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className={cn("flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer", collapsed && "justify-center")}>
              <Avatar className="w-7 h-7 flex-shrink-0">
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">RS</AvatarFallback>
              </Avatar>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-xs font-medium text-sidebar-foreground truncate">Rahul Sharma</p>
                    <p className={cn("text-xs truncate", roleColor)}>{roleName}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">
              <p className="font-medium">Rahul Sharma</p>
              <p className={cn("text-xs", roleColor)}>{roleName}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </motion.aside>
  );
}
