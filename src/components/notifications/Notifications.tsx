import { NotificationContext } from "./NotificationProvider";
import { AnimatePresence, motion, Variants } from "framer-motion";
import styles from "./Notifications.module.css";
import { useContext } from "react";

export default function Notifications() {
  const [notifications] = useContext(NotificationContext);

  return (
    <div className={styles.notificationsWrapper}>
      <AnimatePresence>
        {notifications.map((notification, i) => (
          <motion.div
            className={styles.notification}
            variants={notificationVariants}
            initial="before"
            animate="shown"
            exit="after"
            key={i}
          >
            <p>{notification.content}</p>
            <span
              className={styles.notificationProgress + " " + styles["info"]}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const notificationVariants: Variants = {
  before: {
    opacity: 0,
    y: "100vh",
  },
  shown: {
    opacity: 1,
    y: 0,
  },
  after: {
    opacity: 0,
    y: "-20vh",
  },
};
