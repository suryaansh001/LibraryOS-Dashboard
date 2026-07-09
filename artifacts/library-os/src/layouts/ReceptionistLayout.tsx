import { useLocation, Link } from "wouter";
import { QrCode, Search, Wallet, BookOpen, ChevronLeft } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReceptionistLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { label: "Dashboard", href: "/receptionist/dashboard", icon: BookOpen },
    { label: "Scan QR", href: "/receptionist/scan", icon: QrCode },
    { label: "Search", href: "/receptionist/search", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="h-14 border-b border-border flex items-center px-4 gap-3 sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-sm">LibraryOS</span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Receptionist</span>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Link href="/">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
            <ChevronLeft className="w-3 h-3" /> Switch Role
          </Button>
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 p-4 sm:p-6">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="border-t border-border bg-background sticky bottom-0">
        <div className="flex items-stretch">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location === item.href;
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <div className={cn(
                  "flex flex-col items-center justify-center gap-1 py-3 transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}>
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
