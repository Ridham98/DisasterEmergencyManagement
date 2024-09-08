import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

export default function WeatherInfo() {
  const route = useRoute();
  const { userCountryCode } = route.params; // Receive userCountry from navigation params

  const [city, setCity] = useState('');
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchWeather = async () => {
    console.log(`${userCountryCode}`);
    if (!city) {
      Alert.alert('Please enter a city name');
      return;
    }

    if (!userCountryCode) {
      Alert.alert('User country is not available. Please try again later.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast`, {
        params: {
          q: `${city},${userCountryCode}`,
          appid: 'c02799055e917280560e0bdb0d0598bf',
          units: 'metric', 
        }
      });

      setForecastData(response.data);
    } catch (err) {
      setError('Failed to fetch weather data. Please check the city name and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCardBackgroundColor = (index) => {
    return index % 2 === 0 ? '#0a7e8c' : '#126180';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>5-Day Weather Forecast</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
        keyboardType="default" // Handle alphanumeric input
      />
      <Button title="Fetch Weather" onPress={handleFetchWeather} color="#126180" />
      {loading && <Text style={styles.infoText}>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {forecastData && (
        <View style={styles.forecastContainer}>
          <Text style={styles.forecastTitle}>5-day weather forecast for {city}:</Text>
          <ScrollView>
            {forecastData.list.filter((_, index) => index % 8 === 0).map((entry, index) => (
              <View key={entry.dt} style={[styles.card, { backgroundColor: getCardBackgroundColor(index) }]}>
                <Text style={styles.cardTitle}>{new Date(entry.dt * 1000).toLocaleDateString()}</Text>
                <Text style={styles.cardDescription}>Temperature: {entry.main.temp}°C</Text>
                <Text style={styles.cardDescription}>Weather: {entry.weather[0].description}</Text>
                <Text style={styles.cardDescription}>Humidity: {entry.main.humidity}%</Text>
                <Text style={styles.cardDescription}>Wind Speed: {entry.wind.speed} m/s</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#add8e6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#126180',
  },
  input: {
    height: 50,
    borderColor: '#126180',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    width: '100%',
  },
  infoText: {
    fontSize: 18,
    marginTop: 10,
    color: '#126180',
  },
  errorText: {
    color: '#c23b22',
    fontSize: 18,
  },
  forecastContainer: {
    flex: 1,
    marginTop: 20,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#126180',
  },
  card: {
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  cardDescription: {
    fontSize: 16,
    color: '#fff',
  },
});
