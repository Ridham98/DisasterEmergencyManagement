import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';

export default function Profile() {
  const route = useRoute();
  const { userData, userType } = route.params || {};

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No user data available</Text>
      </View>
    );
  }

  // Conditionally include 'UserType' field
  const profileData = [
    { key: 'Name', value: `${userData.firstName} ${userData.lastName}`, icon: 'person' },
    ...(userType === 'admin' ? [{ key: 'UserType', value: 'Admin User', icon: 'admin-panel-settings' }] : []),
    { key: 'Email', value: userData.email, icon: 'email' },
    { key: 'City', value: userData.city, icon: 'location-city' },
    { key: 'Country', value: userData.country, icon: 'location-on' },
    { key: 'Phone', value: `${userData.countryCode} ${userData.mobileNumber}`, icon: 'phone' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={profileData}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Icon name={item.icon} size={28} color="#126180" />
              <Text style={styles.infoText}>{item.value}</Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.key}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#add8e6',
  },
  card: {
    width: '99%',
    marginHorizontal: 1,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10, // Apply same radius to all corners
    shadowColor: '#126180',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 20,
    marginLeft: 10,
    color: '#126180',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
