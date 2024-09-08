import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { api_url } from '@env';
import FlashMessage, { showMessage } from 'react-native-flash-message';

const countries = [
  { name: 'Canada', code: 'CA', countryCode: '+1' },
  { name: 'India', code: 'IN', countryCode: '+91' },
  { name: 'United Kingdom', code: 'GB', countryCode: '+44' },
  { name: 'United States', code: 'US', countryCode: '+1' },
];

const citiesByCountry = {
  'Canada': [
    'Barrie', 'Brantford', 'Calgary', 'Chatham', 'Chicoutimi',
    'Drummondville', 'Edmonton', 'Granby', 'Guelph', 'Halifax',
    'Hamilton', 'Kamloops', 'Kelowna', 'Kingston', 'Kitchener',
    'Lethbridge', 'London', 'Medicine Hat', 'Moncton', 'Montreal',
    'Nanaimo', 'Ottawa', 'Peterborough', 'Quebec City', 'Red Deer',
    'Regina', 'Saint John', 'Saint-Hyacinthe', 'Sarnia', 'Saskatoon',
    'Sherbrooke', 'St. John\'s', 'Sudbury', 'Thunder Bay', 'Toronto',
    'Trois-Rivières', 'Vancouver', 'Victoria', 'Windsor', 'Winnipeg'
  ],
  'India': [
    'Agra', 'Ahmedabad', 'Aligarh', 'Alwar', 'Amritsar',
    'Aurangabad', 'Bareilly', 'Bangalore', 'Bhopal', 'Bhubaneswar',
    'Chandigarh', 'Chennai', 'Coimbatore', 'Delhi', 'Faridabad',
    'Gurgaon', 'Guwahati', 'Gwalior', 'Hyderabad', 'Indore',
    'Jaipur', 'Jabalpur', 'Jodhpur', 'Kanpur', 'Kolkata',
    'Kota', 'Lucknow', 'Ludhiana', 'Madurai', 'Meerut',
    'Moradabad', 'Mumbai', 'Mysore', 'Nagpur', 'Nashik',
    'Patna', 'Pune', 'Raipur', 'Rajkot', 'Ranchi',
    'Salem', 'Solapur', 'Thiruvananthapuram', 'Tiruchirappalli', 'Tiruppur',
    'Vadodara', 'Varanasi', 'Warangal'
  ],
  'United Kingdom': [
    'Aberdeen', 'Bath', 'Belfast', 'Birmingham', 'Blackpool',
    'Bradford', 'Brighton', 'Bristol', 'Cambridge', 'Cardiff',
    'Cheltenham', 'Coventry', 'Derby', 'Eastbourne', 'Edinburgh',
    'Glasgow', 'Gloucester', 'Hull', 'Ipswich', 'Leeds',
    'Leicester', 'Liverpool', 'London', 'Luton', 'Manchester',
    'Middlesbrough', 'Milton Keynes', 'Newcastle', 'Newport', 'Nottingham',
    'Oxford', 'Plymouth', 'Portsmouth', 'Preston', 'Reading',
    'Sunderland', 'Swansea', 'Swindon', 'Stoke-on-Trent', 'Southampton',
    'Slough', 'Sheffield', 'Warrington', 'Wolverhampton', 'York'
  ],
  'United States': [
    'Albuquerque', 'Arlington', 'Atlanta', 'Austin', 'Baltimore',
    'Boston', 'Charlotte', 'Chicago', 'Cleveland', 'Columbus',
    'Colorado Springs', 'Dallas', 'Denver', 'Detroit', 'El Paso',
    'Fort Worth', 'Fresno', 'Houston', 'Indianapolis', 'Jacksonville',
    'Kansas City', 'Las Vegas', 'Los Angeles', 'Louisville', 'Memphis',
    'Mesa', 'Miami', 'Milwaukee', 'Minneapolis', 'Nashville',
    'New Orleans', 'New York', 'Oakland', 'Oklahoma City', 'Omaha',
    'Philadelphia', 'Phoenix', 'Portland', 'Raleigh', 'Sacramento',
    'San Antonio', 'San Diego', 'San Francisco', 'San Jose', 'Seattle',
    'Tucson', 'Tulsa', 'Virginia Beach', 'Washington, D.C.', 'Wichita'
  ]
};

export default function Signup({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true); 
  const [country, setCountry] = useState(countries[0].name);
  const [countryCode, setCountryCode] = useState(countries[0].countryCode);
  const [mobileNumber, setMobileNumber] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState(citiesByCountry[countries[0].name]);
  const [code, setCode] = useState(countries[0].code);
  const [userType, setUserType] = useState('user'); 
  const [adminSecret, setAdminSecret] = useState(''); 

  const handleSignup = () => {
    // Ensure mobile number is exactly 10 digits
    if (mobileNumber.length !== 10) {
      Alert.alert('Invalid Mobile Number', 'Mobile number must be exactly 10 digits.');
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      country,
      countryCode,
      mobileNumber,
      city,
      code,
      userType
    };

    if(userType === 'admin' && adminSecret !== '123456'){
      return Alert.alert('Invalid admin', 'Incorrect admin secret.');
    }
    
    axios.post(`${api_url}/register`, userData)
      .then(res => {
        showMessage({
          message: 'Sign Up Successful!',
          description: 'You have successfully signed up.',
          type: 'success',
          duration: 5000 // Duration for 5 seconds
        });
        // Navigate to another screen or reset the form if needed
        navigation.navigate('Login'); // Example: navigate to login screen
      })
      .catch(e => {
        if (e.response) {
          console.log('Error Response:', e.response.data);
          showMessage({
            message: 'Sign Up Failed',
            description: e.response.data.message || 'An error occurred during sign up.',
            type: 'danger',
            duration: 5000
          });
        } else if (e.request) {
          console.log('No Response:', e.request);
          showMessage({
            message: 'Sign Up Failed',
            description: 'No response from server. Please try again.',
            type: 'danger',
            duration: 5000
          });
        } else {
          console.log('Error Message:', e.message);
          showMessage({
            message: 'Sign Up Failed',
            description: 'An error occurred during sign up.',
            type: 'danger',
            duration: 5000
          });
        }
      });
  };

  const handleCountryChange = (selectedCountry) => {
    const selectedCountryData = countries.find(country => country.name === selectedCountry);
    if (selectedCountryData) {
      setCountry(selectedCountry);
      setCountryCode(selectedCountryData.countryCode);
      setCities(citiesByCountry[selectedCountry]);
      setCity(''); // Reset city selection
      setCode(selectedCountryData.code); // Set the country code
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Sign Up</Text>
      </View>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setUserType('user')}
        >
          <Icon
            name={userType === 'user' ? 'radio-button-checked' : 'radio-button-unchecked'}
            size={24}
            color="#126180"
          />
          <Text style={styles.radioText}>User</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setUserType('admin')}
        >
          <Icon
            name={userType === 'admin' ? 'radio-button-checked' : 'radio-button-unchecked'}
            size={24}
            color="#126180"
          />
          <Text style={styles.radioText}>Admin</Text>
        </TouchableOpacity>
      </View>
      {userType === 'admin' && (
        <View style={styles.inputContainer}>
          <Icon name="vpn-key" size={24} color="#126180" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Admin Secret"
            value={adminSecret}
            onChangeText={setAdminSecret}
            secureTextEntry={true}
          />
        </View>
      )}
      <View style={styles.inputContainer}>
        <Icon name="person" size={24} color="#126180" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="person" size={24} color="#126180" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="email" size={24} color="#126180" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
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

      <RNPickerSelect
        style={pickerSelectStyles}
        onValueChange={(value) => handleCountryChange(value)}
        items={countries.map((country) => ({
          label: country.name,
          value: country.name
        }))}
        value={country}
        placeholder={{ label: "Select a country", value: null }}
      />

      <RNPickerSelect
        style={pickerSelectStyles}
        onValueChange={(value) => setCity(value)}
        items={cities.map((city) => ({
          label: city,
          value: city
        }))}
        value={city}
        placeholder={{ label: "Select a city", value: null }}
      />

      <View style={styles.inputContainer}>
        <Icon name="phone" size={24} color="#126180" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleSignup} color="#126180" />
      </View>
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Log In
      </Text>

      {/* Add FlashMessage component */}
      <FlashMessage position="top" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f7f9fc',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    color: '#126180',
    fontWeight: 'bold',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  radioText: {
    fontSize: 18,
    marginLeft: 5,
    color: '#126180',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: '#fff',
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
  buttonContainer: {
    marginTop: 20,
    marginBottom: 12,
  },
  link: {
    color: '#126180',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputAndroid: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
});

// const citiesByCountry = {
//   'Canada': [
//     'Barrie', 'Brantford', 'Calgary', 'Chatham', 'Chicoutimi',
//     'Drummondville', 'Edmonton', 'Granby', 'Guelph', 'Halifax',
//     'Hamilton', 'Kamloops', 'Kelowna', 'Kingston', 'Kitchener',
//     'Lethbridge', 'London', 'Medicine Hat', 'Moncton', 'Montreal',
//     'Nanaimo', 'Ottawa', 'Peterborough', 'Quebec City', 'Red Deer',
//     'Regina', 'Saint John', 'Saint-Hyacinthe', 'Sarnia', 'Saskatoon',
//     'Sherbrooke', 'St. John\'s', 'Sudbury', 'Thunder Bay', 'Toronto',
//     'Trois-Rivières', 'Vancouver', 'Victoria', 'Windsor', 'Winnipeg'
//   ],
//   'India': [
//     'Agra', 'Ahmedabad', 'Aligarh', 'Alwar', 'Amritsar',
//     'Aurangabad', 'Bareilly', 'Bangalore', 'Bhopal', 'Bhubaneswar',
//     'Chandigarh', 'Chennai', 'Coimbatore', 'Delhi', 'Faridabad',
//     'Gurgaon', 'Guwahati', 'Gwalior', 'Hyderabad', 'Indore',
//     'Jaipur', 'Jabalpur', 'Jodhpur', 'Kanpur', 'Kolkata',
//     'Kota', 'Lucknow', 'Ludhiana', 'Madurai', 'Meerut',
//     'Moradabad', 'Mumbai', 'Mysore', 'Nagpur', 'Nashik',
//     'Patna', 'Pune', 'Raipur', 'Rajkot', 'Ranchi',
//     'Salem', 'Solapur', 'Thiruvananthapuram', 'Tiruchirappalli', 'Tiruppur',
//     'Vadodara', 'Varanasi', 'Warangal'
//   ],
//   'United Kingdom': [
//     'Aberdeen', 'Bath', 'Belfast', 'Birmingham', 'Blackpool',
//     'Bradford', 'Brighton', 'Bristol', 'Cambridge', 'Cardiff',
//     'Cheltenham', 'Coventry', 'Derby', 'Eastbourne', 'Edinburgh',
//     'Glasgow', 'Gloucester', 'Hull', 'Ipswich', 'Leeds',
//     'Leicester', 'Liverpool', 'London', 'Luton', 'Manchester',
//     'Middlesbrough', 'Milton Keynes', 'Newcastle', 'Newport', 'Nottingham',
//     'Oxford', 'Plymouth', 'Portsmouth', 'Preston', 'Reading',
//     'Sunderland', 'Swansea', 'Swindon', 'Stoke-on-Trent', 'Southampton',
//     'Slough', 'Sheffield', 'Warrington', 'Wolverhampton', 'York'
//   ],
//   'United States': [
//     'Albuquerque', 'Arlington', 'Atlanta', 'Austin', 'Baltimore',
//     'Boston', 'Charlotte', 'Chicago', 'Cleveland', 'Columbus',
//     'Colorado Springs', 'Dallas', 'Denver', 'Detroit', 'El Paso',
//     'Fort Worth', 'Fresno', 'Houston', 'Indianapolis', 'Jacksonville',
//     'Kansas City', 'Las Vegas', 'Los Angeles', 'Louisville', 'Memphis',
//     'Mesa', 'Miami', 'Milwaukee', 'Minneapolis', 'Nashville',
//     'New Orleans', 'New York', 'Oakland', 'Oklahoma City', 'Omaha',
//     'Philadelphia', 'Phoenix', 'Portland', 'Raleigh', 'Sacramento',
//     'San Antonio', 'San Diego', 'San Francisco', 'San Jose', 'Seattle',
//     'Tucson', 'Tulsa', 'Virginia Beach', 'Washington, D.C.', 'Wichita'
//   ]
// };

