import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './AuthContext'; // Ensure this path is correct
import { api_url } from '@env';

export default function Login() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please fill in both email and password.');
      return;
    }
    const userData = {
      email: email,
      password: password,
    };

    console.log(`${api_url}`); // Use backticks for template literals

    axios.post(`${api_url}/login`, userData) // Use backticks for template literals
      .then(res => {
        if (res.data.status === 'ok') {
          Alert.alert('Logged In Successfully');
          AsyncStorage.setItem("token", res.data.data)
            .then(() => {
              login(); // Update auth context
              navigation.replace('Home');
            })
            .catch(error => {
              console.error("There was an error saving the token:", error);
              Alert.alert('Storage Error', 'An error occurred while saving your login information.');
            });
        } else {
          Alert.alert('Login Failed', res.data.message || 'Invalid credentials');
        }
      })
      .catch(error => {
        console.error("There was an error logging in:", error);
        Alert.alert('Login Error', 'An error occurred during login. Please try again later.');
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Login</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Icon name="email" size={24} color="#126180" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ddd"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#126180" style={styles.icon} />
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            placeholderTextColor="#ddd"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          >
            <Icon name={secureTextEntry ? "visibility-off" : "visibility"} size={24} color="#126180" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
          Don’t have an account? Sign Up
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#126180',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: '#f5f5f5',
    fontSize: 16,
  },
  passwordInput: {
    paddingRight: 60,
  },
  icon: {
    position: 'absolute',
    left: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  button: {
    backgroundColor: '#126180',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    color: '#126180',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
});