
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import NavBar from "@/components/NavBar";
import WeightForm from "@/components/weight/WeightForm";
import WeightHistory from "@/components/weight/WeightHistory";
import WeightChart from "@/components/weight/WeightChart";
import BMICalculator from "@/components/weight/BMICalculator";
import UpgradePrompt from "@/components/subscription/UpgradePrompt";
import { WeightRecord } from "@/types/weight";

const WeightTracker = () => {
  const { user } = useAuth();
  const { isProUser } = useSubscription();
  const [weights, setWeights] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [height, setHeight] = useState(175); // Default height in cm
  const latestWeight = weights.length > 0 ? weights[weights.length - 1].weight : 70; // Default weight

  useEffect(() => {
    const fetchWeights = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Simulate fetching weights from a database
        const mockWeights: WeightRecord[] = [
          { id: "1", date: "2024-01-01", weight: 70 },
          { id: "2", date: "2024-01-08", weight: 71 },
          { id: "3", date: "2024-01-15", weight: 72 },
        ];
        setWeights(mockWeights);
      } catch (error) {
        console.error("Failed to fetch weights", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeights();
  }, [user]);

  const handleAddWeight = (weight: number) => {
    const newWeight: WeightRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      weight
    };
    setWeights([...weights, newWeight]);
  };

  const handleDeleteWeight = (id: string) => {
    setWeights(weights.filter((weight) => weight.id !== id));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Weight Tracker</h1>
        
        {isProUser ? (
          <>
            <WeightForm onAddWeight={handleAddWeight} />
            <WeightChart weightRecords={weights} />
            <BMICalculator weight={latestWeight} height={height} />
            <WeightHistory weightRecords={weights} isLoading={loading} onDelete={handleDeleteWeight} />
          </>
        ) : (
          <UpgradePrompt 
            title="Weight Tracking is a Pro Feature" 
            description="Upgrade to Lifted Pro to track your weight and body metrics."
          />
        )}
      </div>
    </div>
  );
};

export default WeightTracker;
