import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import { DashboardComponent } from "./components/Dashboard";
import AddEndpoint from "./components/AddEndpoint";
import ErrorPage404 from "./pages/404ErrorPage";

function App() {
  return (
    <div className="bg-[#0e0e10] min-h-screen text-white">
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={<ErrorPage404 />} path="*" />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="" element={<DashboardComponent />} />
          <Route path="add-endpoint" element={<AddEndpoint />} />
          {/* <Route path="add-endpoint" element={<DashboardSettings />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
