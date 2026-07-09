import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Sun, Moon, Search, ChevronDown, Building2, LogOut,
  User, Settings, HelpCircle, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/ThemeContext";
import { useRole } from "@/context/RoleContext";
import type { Role } from "@/context/RoleContext";
import { cn } from "@/lib/utils";

const notifications = [
  { id: 1, title: "New student registered", desc: "Vikram Tiwari joined ReadSpace Pro", time: "2 min ago", read: false },
  { id: 2, title: "Payment received", desc: "Priya Sharma paid ₹1,400", time: "15 min ago", read: false },
  { id: 3, title: "Membership expiring", desc: "3 memberships expire in 2 days", time: "1 hr ago", read: false },
  { id: 4, title: "Seat assigned", desc: "Seat C-14 assigned to new student", time: "2 hr ago", read: true },
];

export default function TopNavbar() {
  const { theme, setTheme } = useTheme();
  const { role, setRole } = useRole();
  const [, setLocation] = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleName = role === "super-admin" ? "Super Admin" : role === "owner" ? "Library Owner" : "Receptionist";

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    if (newRole === "super-admin") setLocation("/admin/dashboard");
    else if (newRole === "owner") setLocation("/dashboard");
    else setLocation("/receptionist/dashboard");
  };

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-4 gap-3 sticky top-0 z-10 flex-shrink-0">
      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-8 h-8 text-sm bg-muted/50 border-0 focus-visible:ring-1"
          data-testid="topnav-search"
        />
      </div>

      <div className="flex-1" />

      {/* Library Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs font-medium hidden sm:flex" data-testid="library-switcher">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground max-w-[120px] truncate">ReadSpace Pro</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Switch Library</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 text-sm">
            <Check className="w-3.5 h-3.5 text-primary" />
            ReadSpace Pro
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-3.5" />
            StudyHub Delhi
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-sm text-primary">+ Add Library</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Role Switcher (demo) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs hidden sm:flex" data-testid="role-switcher">
            <span>{roleName}</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Switch Role (Demo)</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(["super-admin", "owner", "receptionist"] as Role[]).map((r) => (
            <DropdownMenuItem key={r} onClick={() => handleRoleChange(r)} className="flex items-center gap-2 text-sm capitalize">
              {role === r && <Check className="w-3.5 h-3.5 text-primary" />}
              {role !== r && <span className="w-3.5" />}
              {r === "super-admin" ? "Super Admin" : r === "owner" ? "Library Owner" : "Receptionist"}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        data-testid="theme-toggle"
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>

      {/* Notifications */}
      <div className="relative">
        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 relative" data-testid="notifications-bell">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2.5 cursor-pointer">
                <div className="flex items-center gap-2 w-full">
                  {!n.read && <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />}
                  {n.read && <div className="w-1.5" />}
                  <span className="text-sm font-medium">{n.title}</span>
                </div>
                <p className="text-xs text-muted-foreground pl-3.5">{n.desc}</p>
                <p className="text-xs text-muted-foreground/60 pl-3.5">{n.time}</p>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-primary text-center justify-center">View all notifications</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-2 px-2" data-testid="user-menu">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="bg-primary/20 text-primary text-xs">RS</AvatarFallback>
            </Avatar>
            <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>
            <p className="text-sm font-medium">Rahul Sharma</p>
            <p className="text-xs text-muted-foreground font-normal">rahul@readspace.pro</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-sm"><User className="w-3.5 h-3.5" /> Profile</DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-sm"><Settings className="w-3.5 h-3.5" /> Settings</DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-sm"><HelpCircle className="w-3.5 h-3.5" /> Help & Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-sm text-destructive"><LogOut className="w-3.5 h-3.5" /> Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
