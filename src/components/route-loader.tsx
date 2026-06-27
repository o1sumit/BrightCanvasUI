import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export function RouteLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative h-16 w-16">
          {/* Pulsing rings */}
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-primary/40"
            animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-primary/40"
            animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
          />
          {/* Core */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/30"
            animate={{ rotate: [0, -8, 8, -8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Phone className="h-6 w-6 text-primary-foreground" />
          </motion.div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-foreground/80">Connecting</span>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
