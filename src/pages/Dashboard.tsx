
import NavBar from "@/components/NavBar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-semibold">Your Dashboard</h1>
        <p className="mt-4">Welcome to StrengthScribe, your workout tracking platform!</p>
        
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium">Recent Workouts</h3>
              <p className="mt-1 text-sm text-gray-500">Your recent workout activity</p>
              <div className="mt-4">
                <p className="text-gray-400 text-sm">No workouts yet</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium">Statistics</h3>
              <p className="mt-1 text-sm text-gray-500">Your workout statistics</p>
              <div className="mt-4">
                <p className="text-gray-400 text-sm">No statistics available</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium">Quick Actions</h3>
              <p className="mt-1 text-sm text-gray-500">Start a new workout</p>
              <div className="mt-4">
                <Button>New Workout</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
