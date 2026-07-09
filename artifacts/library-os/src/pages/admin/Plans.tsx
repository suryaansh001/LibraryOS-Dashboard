import { motion } from "framer-motion";
import { Check, Pencil } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter", price: "$19", billing: "per month",
    color: "border-border", badge: "bg-secondary text-secondary-foreground",
    desc: "Perfect for small study rooms just getting started.",
    features: ["Up to 50 students", "Basic attendance tracking", "QR check-in", "Payment records", "Email support", "1 staff account"],
    active: 42,
  },
  {
    name: "Professional", price: "$49", billing: "per month",
    color: "border-primary/50 shadow-lg shadow-primary/10", badge: "bg-primary/15 text-primary",
    desc: "For growing libraries that need full control.",
    features: ["Up to 200 students", "Advanced attendance reports", "QR check-in + ID cards", "Full payment management", "Expense tracking", "Priority support", "5 staff accounts", "Custom fields"],
    active: 110,
    popular: true,
  },
  {
    name: "Enterprise", price: "$99", billing: "per month",
    color: "border-purple-500/30", badge: "bg-purple-500/15 text-purple-400",
    desc: "For large libraries with advanced needs.",
    features: ["Unlimited students", "White-label branding", "API access", "Dedicated support", "Unlimited staff", "Custom integrations", "Analytics dashboard", "Priority SLA"],
    active: 37,
  },
];

export default function AdminPlans() {
  return (
    <DashboardLayout>
      <PageHeader title="Plans" description="Manage subscription plans offered to libraries" actions={<Button size="sm" className="text-xs h-8">+ Create Plan</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan, i) => (
          <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`bg-card border ${plan.color} rounded-2xl p-6 relative`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
              </div>
            )}
            <div className="mb-4">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${plan.badge}`}>{plan.name}</span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.billing}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{plan.desc}</p>
            </div>
            <div className="space-y-2 mb-6">
              {plan.features.map((f, j) => (
                <div key={j} className="flex items-center gap-2 text-sm">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="text-foreground/80">{f}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">{plan.active}</span> active</p>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Pencil className="w-3 h-3" /> Edit</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
