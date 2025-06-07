import { createContext, PropsWithChildren, useState } from "react";
import Notifications from "./Notifications";

export interface Notification {
  id: number;
  type: "error" | "success" | "info";
  content: string;
}

export const NotificationContext = createContext<
  [Notification[], (notification: Notification) => void]
>([[], () => {}]);

export default function NotificationProvider({
  children
}: PropsWithChildren<{}>) {
  const [state, setState] = useState<Notification[]>([]);

  const notify = (notification: Omit<Notification, "id">) => {
    const id = Date.now();
    setState((nots) => [...nots, { id, ...notification }]);
    setTimeout(() => setState((nots) => nots.filter(n => n.id !== id)), 5000);
  };

  return (
    <NotificationContext.Provider value={[state, notify]}>
      <Notifications />
      {children}
    </NotificationContext.Provider>
  );
}
