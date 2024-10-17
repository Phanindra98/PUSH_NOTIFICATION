//import liraries
import { View, Text, StyleSheet, Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";
import React, { useEffect } from "react";

import firebase from '@react-native-firebase/app';

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase config from the Firebase console
  apiKey: "AIzaSyCm5M1FkkME7CdbQZgPldBS8A1cWNT5HLU",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "fir-notification-50b41",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:680827002166:android:9b7fd8f8d6e5acd2cb2797",
};

if (!firebase.apps.length) {
  console.log("checking firebase config");
  
  firebase.initializeApp(firebaseConfig);
}

// create a component
const HomeScreen = () => {
  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
 
    if (enabled) {
      console.log("AuthorizationStatus ==> ", authStatus);
    }
  };
 
  useEffect(() => {
    if (requestPermission()) {
      messaging()
        .getToken()
        .then((token) => {
          console.log("token", token);
        });
    } else {
      console.log("permission not granted");
    }
 
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });
 
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state",
        remoteMessage.notification
      );
    });
 
    messaging().setBackgroundMessageHandler(async (remoteMesaage) => {
      console.log("Message Handled in background", remoteMesaage);
    });
 
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert("A new FCM message arrived ", JSON.stringify(remoteMessage));
    });
 
    return unsubscribe;
  }, []);
  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
    </View>
  );
};
 
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
});
 
//make this component available to the app
export default HomeScreen;