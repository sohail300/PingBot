import { MobileSidebarNav } from "@/components/MobileSidebarNav";
import { Sidebar } from "@/components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Loading from "@/components/Loading";

// Main Dashboard Page component
const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isSignedIn) {
    navigate("/login");
  }

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
