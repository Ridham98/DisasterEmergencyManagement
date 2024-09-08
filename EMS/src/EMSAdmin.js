import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api_url } from '@env';

export default function EMSAdmin({ navigation }) {
  const [groupedMessages, setGroupedMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch messages from the server
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${api_url}/getMessages`);
      const messages = response.data;

      // Group messages by user
      const grouped = messages.reduce((acc, message) => {
        if (message.fullName) {
          (acc[message.fullName] = acc[message.fullName] || []).push(message);
        } else {
          console.warn('Message missing fullName:', message);
        }
        return acc;
      }, {});

      // Convert grouped messages to array of sections
      const groupedArray = Object.keys(grouped).map(fullName => ({
        title: fullName,
        data: grouped[fullName]
      }));

      setGroupedMessages(groupedArray);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  // Handle back to user list
  const handleBack = () => {
    setSelectedUser(null);
  };

  // Handle hardware back button press
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (selectedUser) {
          handleBack();
          return true; // Prevent default back action
        }
        // Navigate back to previous screen
        navigation.goBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [selectedUser, navigation])
  );

  // Format time as hh:mm
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Render the list of users
  const renderUserItem = ({ item }) => {
    const latestMessage = item.data[item.data.length - 1];
    return (
      <TouchableOpacity onPress={() => handleUserSelect(item)} style={styles.userItem}>
        <Text style={styles.userName}>{item.title}</Text>
        <Text style={styles.latestMessage}>{latestMessage ? latestMessage.message : 'No messages'}</Text>
      </TouchableOpacity>
    );
  };

  // Render the list of messages for the selected user
  const renderMessageItem = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isReceived ? styles.receivedMessage : styles.sentMessage
    ]}>
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.timestampText}>{formatTime(item.timestamp)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {selectedUser ? (
        <>
          {/* <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to User List</Text>
          </TouchableOpacity> */}
          <FlatList
            data={selectedUser.data}
            keyExtractor={(item) => item._id}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.messageList}
          />
        </>
      ) : (
        <>
          <Text style={styles.header}>Admin Messages</Text>
          <FlatList
            data={groupedMessages}
            keyExtractor={(item) => item.title}
            renderItem={renderUserItem}
            contentContainerStyle={styles.userList}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#add8e6',
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#126180',
    borderRadius: 5,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  latestMessage: {
    fontSize: 14,
    color: '#888',
  },
  messageContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#e1f5fe',
    alignSelf: 'flex-start',
  },
  sentMessage: {
    backgroundColor: '#cfe9ff',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 14,
    marginVertical: 5,
    flex: 1,
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
  },
  userList: {
    paddingBottom: 20,
    backgroundColor: '#cfe9ff',
  },
  messageList: {
    paddingBottom: 20,
  },
});
