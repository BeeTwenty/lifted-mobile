
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Plus, Dumbbell } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  // Sample workout routines data - in a real app, we would fetch this from Supabase
  const [workoutRoutines, setWorkoutRoutines] = useState([
    { id: 1, title: "Full Body Workout", exercises: 8 },
    { id: 2, title: "Upper Body Focus", exercises: 6 },
    { id: 3, title: "Leg Day", exercises: 7 },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-md mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">My Workout Routines</h1>
          <Button size="sm" className="flex items-center gap-1">
            <Plus size={18} />
            New
          </Button>
        </div>
        
        {workoutRoutines.length === 0 ? (
          <div className="text-center py-10">
            <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No workout routines yet</p>
            <p className="text-gray-400 text-sm mb-4">Create your first routine to get started</p>
            <Button>
              <Plus className="mr-2" size={16} />
              Create Routine
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {workoutRoutines.map((routine) => (
              <Card key={routine.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{routine.title}</h3>
                      <p className="text-sm text-gray-500">{routine.exercises} exercises</p>
                    </div>
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
