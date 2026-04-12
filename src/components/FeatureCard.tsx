import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  feature: {
    icon: LucideIcon;
    title: string;
    description: string;
    gradient?: string;
    shadow?: string;
    accent?: string;
  };
  index: number;
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const Icon = feature.icon;
  const gradient = feature.gradient || "gradient-primary";
  const shadow   = feature.shadow   || "shadow-glow-sm";
  const accent   = feature.accent   || "bg-primary/5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.45 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card card-hover"
    >
      <div className={`pointer-events-none absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-40 group-hover:scale-125 ${accent}`} />
      <div className="relative">
        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${gradient} ${shadow} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">{feature.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
