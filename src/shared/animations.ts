export const pageTransition = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
      scale: {
        type: "spring",
        damping: 25,
        stiffness: 400
      }
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export const cardTransition = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
      scale: {
        type: "spring",
        damping: 25,
        stiffness: 400
      }
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export const overlayTransition = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: '100%', opacity: 0 },
  transition: { 
    type: 'spring',
    damping: 25,
    stiffness: 200,
    mass: 1
  }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const tabVariants = {
  active: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 1
    }
  },
  inactive: {
    scale: 0.95,
    opacity: 0.7,
    y: 2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 1
    }
  }
};

export const iconVariants = {
  active: {
    scale: 1,
    rotate: [0, 15, -15, 0],
    transition: {
      rotate: {
        duration: 0.5,
        ease: "easeInOut",
        delay: 0.1
      },
      scale: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  },
  inactive: {
    scale: 0.9,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
}; 