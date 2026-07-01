"use client";

import { motion } from "framer-motion";
import { ECellLogo } from "./ECellLogo";

/**
 * Full-screen splash shown on first load. The E-Cell logo pulses smoothly
 * (scale + opacity) until the feed is ready, then fades out via the parent's
 * <AnimatePresence>.
 */
export function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center bg-[#faf8f4]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      <motion.div
        className="flex flex-col items-center gap-5"
        animate={{ scale: [1, 1.08, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <ECellLogo className="h-20 w-20 drop-shadow-[0_8px_30px_rgba(184,145,106,0.2)]" />
        <p
          className="text-sm font-medium tracking-wide"
          style={{ fontFamily: "'IM Fell English', serif", color: "rgba(61, 36, 18, 0.6)" }}
        >
          Curating startup stories…
        </p>
      </motion.div>
    </motion.div>
  );
}
