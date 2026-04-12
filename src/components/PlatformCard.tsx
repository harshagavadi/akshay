import { motion } from "framer-motion";
import { ArrowDownToLine } from "lucide-react";
import { ComponentType, CSSProperties } from "react";

interface PlatformCardProps {
  platform: {
    name: string;
    description: string;
    icon: ComponentType<{ className?: string; style?: CSSProperties }>;
    color: string;
  };
  index: number;
}

const PlatformCard = ({ platform, index }: PlatformCardProps) => {
  const Icon = platform.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card card-hover"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(ellipse at 0% 0%, ${platform.color}18 0%, transparent 70%)` }}
      />
      <div className="flex items-center gap-4">
        <div
          className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${platform.color}18` }}
        >
          <Icon className="h-7 w-7" style={{ color: platform.color } as React.CSSProperties} />
          <div
            className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ boxShadow: `0 0 18px ${platform.color}50` }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-semibold text-foreground">{platform.name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{platform.description}</p>
        </div>
        <ArrowDownToLine
          className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:text-primary group-hover:translate-y-0.5"
        />
      </div>
    </motion.div>
  );
};

export default PlatformCard;
