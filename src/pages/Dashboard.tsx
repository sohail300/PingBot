import { MobileSidebarNav } from "@/components/MobileSidebarNav";
import { Sidebar } from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

// Main Dashboard Page component
const Dashboard = () => {
  return (
    <>
      {/* Mobile navigation */}
      <MobileSidebarNav />

      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="md:ml-60 p-6">
        <Outlet />
      </main>
    </>
  );
};

export default Dashboard;
