import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Import the authentication context
import { api_url } from '@env';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userCountryCode, setUserCountryCode] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [email, setEmail] = useState(null);
  const [userType, setUserType] = useState(null);
  const { logout } = useAuth(); 
  const navigation = useNavigation();

  const toggleMenu = () => {
    setMenuVisible(prev => !prev);
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${api_url}/userData`, { token });
      const data = response.data.data;
      const fullName = data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : 'Unknown User';
      setUserData(data);
      setUserCountryCode(data.code || 'Unknown Country');
      
      setFullName(fullName);
      setEmail(data.email || 'No Email');
      setUserType(data.userType || 'User');
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      await AsyncStorage.setItem('userCountryCode', data.code);
      await AsyncStorage.setItem('fullName', fullName);
      await AsyncStorage.setItem('userType', data.userType || 'User');
      console.log(JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      logout(); // Call the logout function from context
      navigation.replace('Login'); // Replace Home with Login
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Close the menu when the screen is focused
      setMenuVisible(false);
    }, [])
  );

  // Handle navigation based on userType
  const handleEMSPress = () => {
    const targetScreen = userType === 'admin' ? 'EMSAdmin' : 'EMSUser';
    navigation.navigate(targetScreen, { userType, fullName });
    toggleMenu();
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Image source={require('./logo.png')} style={styles.logo} />
        <Text style={styles.headerTitle}>Emergency Management Services</Text>
      </View>

      {/* Menu Button */}
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Icon name={menuVisible ? "close" : "menu"} size={30} color="#ffffff" />
      </TouchableOpacity>

      {/* Menu Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={toggleMenu} // Handles Android hardware back button
      >
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
                  <Icon name="close" size={30} color="#ffffff" />
                </TouchableOpacity>
                <View style={styles.menuContent}>
                  <View style={styles.userInfoContainer}>
                    <Image
                      source={userData?.profilePicture ? { uri: userData.profilePicture } : require('./user_icon.png')}
                      style={styles.userIcon}
                    />
                    <View style={styles.userInfoTextContainer}>
                      <Text style={styles.menuTitle}>{fullName}</Text>
                      <Text style={styles.userEmail}>{email}</Text>
                      <Text style={styles.userType}>{userType === 'admin' ? 'Admin User' : 'Regular User'}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Home'); toggleMenu(); }}>
                    <Icon name="home" size={28} color="#126180" />
                    <Text style={styles.menuItemText}>Home</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('WeatherInfo', { userCountryCode }); toggleMenu(); }}>
                    <Icon name="cloud" size={28} color="#126180" />
                    <Text style={styles.menuItemText}>Weather Info</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem} onPress={handleEMSPress}>
                    <Icon name="message" size={28} color="#126180" />
                    <Text style={styles.menuItemText}>EMS</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Profile', { userData, userType }); toggleMenu(); }}>
                    <Icon name="person" size={28} color="#126180" />
                    <Text style={styles.menuItemText}>Profile Info</Text>
                  </TouchableOpacity>
                  <View style={styles.logoutContainer}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                      <Icon name="logout" size={24} color="#fff" />
                      <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome, {fullName}</Text>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('WeatherInfo', { userCountryCode })}>
          <Text style={styles.cardTitle}>Weather Info</Text>
          <Text style={styles.cardDescription}>Click to see the weather information</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={handleEMSPress}>
          <Text style={styles.cardTitle}>EMS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#add8e6',
  },
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#126180',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginTop: 30,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginLeft: -20,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 1,
  },
  menuButton: {
    position: 'absolute',
    top: 120,
    left: 10,
    zIndex: 1,
    backgroundColor: '#126180',
    padding: 10,
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    width: width * 0.75,
    height: height * 0.85,
    backgroundColor: '#fff',
    borderRadius: 30,
    marginTop: 30,
    marginLeft: 10,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 2,
    backgroundColor: '#126180',
    padding: 10,
    borderRadius: 20,
  },
  menuContent: {
    flex: 1,
    padding: 20,
    marginTop: 60,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userIcon: {
    width: 60,
    height: 60,
    borderRadius: 25,
    backgroundColor: '#add8e6',
    marginRight: 15,
  },
  userInfoTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#126180',
  },
  userEmail: {
    fontSize: 20,
    color: '#126180',
  },
  userType: {
    fontSize: 18,
    color: '#126180',
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuItemText: {
    fontSize: 24,
    color: '#126180',
    fontWeight: 'bold',
    marginLeft: 15,
  },
  logoutContainer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#126180',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 24,
    color: '#fff',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: '#126180',
    borderRadius: 8,
    shadowColor: '#126180',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: '#add8e6',
  },
});
