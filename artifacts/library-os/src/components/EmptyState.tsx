import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
};

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-4">{description}</p>
      {action && (
        <Button size="sm" onClick={action.onClick}>{action.label}</Button>
      )}
    </motion.div>
  );
}
