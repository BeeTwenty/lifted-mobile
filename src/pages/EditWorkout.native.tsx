
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const EditWorkout = ({ route }: any) => {
  const { id } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Workout</Text>
      </View>
      
      <View style={styles.content}>
        <Text>Edit Workout functionality will be implemented here.</Text>
        <Text>Workout ID: {id}</Text>
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
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EditWorkout;
