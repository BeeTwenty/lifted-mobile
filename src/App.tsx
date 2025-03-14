
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "@/pages/Auth";
import Home from "@/pages/Index";
import Settings from "@/pages/Settings";
import CreateWorkout from "@/pages/CreateWorkout";
import WeightTracker from "@/pages/WeightTracker";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "sonner";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <Toaster />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute />} >
                <Route index element={<Home />} />
                <Route path="settings" element={<Settings />} />
                <Route path="create-workout" element={<CreateWorkout />} />
                <Route path="weight-tracker" element={<WeightTracker />} />
              </Route>
            </Routes>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
