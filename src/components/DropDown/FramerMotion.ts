export const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const overlayVariants = {
  hidden: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    WebkitBackdropFilter: "blur(0px)",
  },
  visible: {
    opacity: 1,
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const loadingBoxVariants = {
  hidden: {
    opacity: 0,
    y: "140%"
  },
  visible: {
    opacity: 1,
    y: 0
  }
};
