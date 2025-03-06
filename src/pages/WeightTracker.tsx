
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import WeightForm from "@/components/weight/WeightForm";
import WeightChart from "@/components/weight/WeightChart";
import BMICalculator from "@/components/weight/BMICalculator";
import WeightHistory from "@/components/weight/WeightHistory";
import { toast } from "sonner";

export interface WeightRecord {
  id: string;
  weight: number;
  date: string;
  created_at: string;
}

const WeightTracker = () => {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userHeight, setUserHeight] = useState<number | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    const fetchWeightRecords = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user's height from profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('height')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        setUserHeight(profileData?.height || null);
        
        // Fetch weight records
        const { data, error } = await supabase
          .from('weight_records')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        setWeightRecords(data || []);
      } catch (error: any) {
        console.error('Error fetching weight records:', error);
        toast.error('Failed to load your weight records');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeightRecords();
  }, [user]);

  const handleAddWeight = async (weight: number) => {
    try {
      if (!user) return;

      const newRecord = {
        user_id: user.id,
        weight,
        date: new Date().toISOString().split('T')[0]
      };

      const { data, error } = await supabase
        .from('weight_records')
        .insert(newRecord)
        .select()
        .single();

      if (error) throw error;
      
      setWeightRecords([data, ...weightRecords]);
      toast.success('Weight record added successfully');
    } catch (error: any) {
      console.error('Error adding weight record:', error);
      toast.error('Failed to add weight record');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setWeightRecords(weightRecords.filter(record => record.id !== id));
      toast.success('Weight record deleted');
    } catch (error: any) {
      console.error('Error deleting weight record:', error);
      toast.error('Failed to delete weight record');
    }
  };

  const latestWeight = weightRecords.length > 0 ? weightRecords[0].weight : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold mb-6">Weight Tracker</h1>
        
        <div className="mb-6">
          <WeightForm onAddWeight={handleAddWeight} />
          {userHeight ? (
            <p className="text-sm text-gray-500 mt-1">
              Your height: {userHeight} cm
            </p>
          ) : (
            <p className="text-sm text-gray-500 mt-1">
              Your height can be updated in the settings page
            </p>
          )}
        </div>
        
        {latestWeight && userHeight && (
          <div className="mb-6">
            <BMICalculator weight={latestWeight} height={userHeight} />
          </div>
        )}
        
        {weightRecords.length > 0 && (
          <div className="mb-6">
            <WeightChart weightRecords={weightRecords} />
          </div>
        )}
        
        <div>
          <WeightHistory 
            weightRecords={weightRecords} 
            isLoading={isLoading}
            onDelete={handleDeleteRecord}
          />
        </div>
      </main>
    </div>
  );
};

export default WeightTracker;
