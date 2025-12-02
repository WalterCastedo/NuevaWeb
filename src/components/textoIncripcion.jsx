// Componente independiente fuera de Inscripcion
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const AnimatedText = ({ text, className }) => {
  const letters = Array.from(text);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Solo marcar que se montó, la animación solo ocurre una vez
    setMounted(true);
  }, []);

  return (
    <span className={className}>
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 500, damping: 15, delay: i * 0.05 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};
