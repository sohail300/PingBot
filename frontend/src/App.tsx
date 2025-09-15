import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";
import { AuthenticateWithRedirectCallback, useUser } from "@clerk/clerk-react";
import Loading from "./components/Loading";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AddEndpoint = lazy(() => import("./pages/AddEndpoint"));
const ErrorPage404 = lazy(() => import("./pages/404ErrorPage"));
const Logs = lazy(() => import("./pages/Logs"));
const Login = lazy(() => import("./pages/Login"));
const DashboardComponent = lazy(() =>
  import("./components/Dashboard").then((m) => ({
    default: m.DashboardComponent,
  }))
);

function App() {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div className="bg-[#0e0e10] min-h-screen text-white">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<LandingPage />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route
            path="/login/sso-callback"
            element={<AuthenticateWithRedirectCallback />}
          />

          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="" element={<DashboardComponent />} />
            <Route path="add-endpoint" element={<AddEndpoint />} />
            <Route path="logs" element={<Logs />} />
          </Route>

          <Route element={<ErrorPage404 />} path="*" />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
