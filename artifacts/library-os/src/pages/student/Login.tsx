import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Eye, EyeOff, GraduationCap, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useRole } from "@/context/RoleContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sun, Moon } from "lucide-react";
import { login } from "@/lib/api";

export default function StudentLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { setSession } = useRole();
  const { theme, setTheme } = useTheme();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const session = await login({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        librarySlug: String(formData.get("librarySlug") ?? import.meta.env.VITE_DEFAULT_LIBRARY_SLUG ?? ""),
      });

      setSession(session);
      setLocation("/student/dashboard");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm text-foreground">LibraryOS</span>
          </div>
        </Link>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">

          {/* Icon */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-sky-500/15 border border-sky-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-7 h-7 text-sky-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Student Portal</h1>
            <p className="text-sm text-muted-foreground mt-1.5">Sign in to access your library dashboard</p>
          </div>

          {/* Form */}
          <div className="bg-card border border-card-border rounded-2xl p-6 space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Email address</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="arjun.kumar@email.com"
                  defaultValue="arjun.kumar@email.com"
                  className="h-10 text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Library slug</Label>
                <Input
                  name="librarySlug"
                  type="text"
                  placeholder="readspace-pro"
                  defaultValue="readspace-pro"
                  className="h-10 text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-sky-400 hover:text-sky-300 transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    defaultValue="password123"
                    className="h-10 text-sm pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-xs text-destructive text-center">{error}</p>}

              <Button type="submit" className="w-full h-10 text-sm font-semibold bg-sky-600 hover:bg-sky-700 gap-2" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <><ArrowRight className="w-4 h-4" /> Sign In to Portal</>
                )}
              </Button>
            </form>

            {/* OTP hint */}
            <div className="pt-1">
              <div className="relative flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex-1 h-px bg-border" />
                <span>or</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <button className="w-full mt-3 h-10 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-2" disabled>
                <span className="text-xs">📱</span> Sign in with OTP
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground ml-1">Coming Soon</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Not a student?{" "}
            <Link href="/" className="text-primary hover:text-primary/80 transition-colors font-medium">Choose a different role</Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
