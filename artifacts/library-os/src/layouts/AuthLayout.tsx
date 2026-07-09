import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-indigo-400"
              style={{
                width: `${(i + 1) * 80}px`,
                height: `${(i + 1) * 80}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">LibraryOS</span>
          </div>
        </div>

        <div className="relative space-y-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white leading-tight"
            >
              The operating system for modern study libraries
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-indigo-200 text-lg leading-relaxed"
            >
              Manage students, track attendance, handle memberships and payments — all in one beautiful interface.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {[
              { icon: "✓", text: "Real-time QR attendance tracking" },
              { icon: "✓", text: "Smart membership & payment management" },
              { icon: "✓", text: "Multi-role access for owner & staff" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-5 h-5 bg-indigo-500/30 rounded-full flex items-center justify-center text-indigo-300 text-xs font-bold">
                  {item.icon}
                </span>
                <span className="text-indigo-100 text-sm">{item.text}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="flex -space-x-2">
              {["RS", "AP", "KM", "DJ"].map((init, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-indigo-500/40 border-2 border-indigo-800 flex items-center justify-center text-white text-xs font-medium">
                  {init}
                </div>
              ))}
            </div>
            <p className="text-indigo-200 text-sm">Trusted by <strong className="text-white">247+</strong> libraries across India</p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
