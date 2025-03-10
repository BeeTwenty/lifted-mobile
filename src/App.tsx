import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import CreateWorkout from "@/pages/CreateWorkout";
import ExecuteWorkout from "@/pages/ExecuteWorkout";
import NotFound from "./pages/NotFound";
import EditWorkout from "./pages/EditWorkout";
import WeightTracker from "./pages/WeightTracker";
import Settings from "./pages/Settings";
import { BackgroundMode } from "@awesome-cordova-plugins/background-mode";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Ensure BackgroundMode only runs when the device is ready
    document.addEventListener("deviceready", () => {
      BackgroundMode.enable();
      BackgroundMode.disableBatteryOptimizations();
      BackgroundMode.overrideBackButton();
      BackgroundMode.setDefaults({
        title: "Workout Active",
        text: "Your workout is running in the background",
        silent: false
      });

      BackgroundMode.on("activate");
      BackgroundMode.on("deactivate");
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Sonner />
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/auth" element={<Auth />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/create-workout" element={<CreateWorkout />} />
                  <Route path="/edit-workout/:id" element={<EditWorkout />} />
                  <Route path="/execute-workout/:id" element={<ExecuteWorkout />} />
                  <Route path="/weight-tracker" element={<WeightTracker />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
