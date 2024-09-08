import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HelpScreen() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Help & Guidance</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Home</Text>
          <Text style={styles.sectionContent}>
            The Home screen provides quick access to various features of the app.
            You can navigate to Weather Info, EMS, and more.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather Info</Text>
          <Text style={styles.sectionContent}>
            The Weather Info screen allows you to check the weather forecast for a specific city.
            Enter the city name to see the 5-day weather forecast including temperature, humidity, and more.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EMS</Text>
          <Text style={styles.sectionContent}>
            The EMS screen provides information about emergency services in your area.
            You can find contact details and services available in case of emergencies.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <Text style={styles.sectionContent}>
            The Profile screen displays your personal information such as name, email, country, and phone number.
            You can view and update your profile details here.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#126180',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#126180',
  },
  sectionContent: {
    fontSize: 16,
    color: '#666',
  },
});
