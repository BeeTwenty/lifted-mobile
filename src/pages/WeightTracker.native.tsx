
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { supabase } from '@/integrations/supabase/client.native';
import { useAuth } from '@/contexts/AuthContext.native';

interface WeightRecord {
  id: string;
  weight: number;
  date: string;
  user_id: string;
  created_at: string;
}

const WeightTracker = () => {
  const { user } = useAuth();
  const [weight, setWeight] = useState<string>('');
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [height, setHeight] = useState(170); // Default height in cm

  React.useEffect(() => {
    if (user) {
      fetchWeightRecords();
    }
  }, [user]);

  const fetchWeightRecords = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      setWeightRecords(data || []);
    } catch (error: any) {
      console.error('Error fetching weight records:', error);
      Alert.alert('Error', 'Failed to load weight records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWeight = async (weightValue: number) => {
    try {
      if (!user) return;
      
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('weight_records')
        .insert({
          weight: weightValue,
          date: today,
          user_id: user.id
        });
      
      if (error) throw error;
      
      Alert.alert('Success', 'Weight record added successfully');
      fetchWeightRecords();
      setWeight('');
    } catch (error: any) {
      console.error('Error adding weight record:', error);
      Alert.alert('Error', 'Failed to add weight record');
    }
  };

  const handleDeleteWeight = async (id: string) => {
    try {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setWeightRecords(weightRecords.filter(record => record.id !== id));
      Alert.alert('Success', 'Weight record deleted');
    } catch (error: any) {
      console.error('Error deleting weight record:', error);
      Alert.alert('Error', 'Failed to delete weight record');
    }
  };

  const handleSubmit = () => {
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      Alert.alert('Error', 'Please enter a valid weight value');
      return;
    }
    
    handleAddWeight(weightValue);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weight Tracker</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Current Weight (kg)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter weight"
            value={weight}
            onChangeText={setWeight}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Weight History</Text>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        ) : weightRecords.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No weight records yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first weight record above</Text>
          </View>
        ) : (
          weightRecords.map(record => (
            <View key={record.id} style={styles.recordItem}>
              <View>
                <Text style={styles.recordDate}>
                  {new Date(record.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.recordActions}>
                <Text style={styles.recordWeight}>{record.weight} kg</Text>
                <TouchableOpacity
                  onPress={() => handleDeleteWeight(record.id)}
                >
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fc',
  },
  header: {
    padding: 20,
    backgroundColor: '#6366F1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    padding: 15,
  },
  saveButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  historyContainer: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recordDate: {
    fontSize: 16,
    fontWeight: '500',
  },
  recordActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordWeight: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 15,
  },
  deleteButton: {
    color: '#EF4444',
  },
});

export default WeightTracker;
