import DashboardHeader from "@/components/Dashboard/Header/DashboardHeader";
import MenuToggle from "@/components/Menu/MenuToggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <MenuToggle />

      <div style={{ width: "94.92vw" }}>
        <DashboardHeader title="Faucet" />
        {children}
      </div>
    </div>
  );
}
