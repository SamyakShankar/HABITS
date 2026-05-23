import type { Transition, Variants } from "framer-motion";

export const smoothTransition: Transition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1]
};

export const springTransition: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.8
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(6px)" }
};

export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1 }
};
