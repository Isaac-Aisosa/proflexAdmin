import React, { useEffect, useState, useRef } from "react";
import {
  Platform,
  BackHandler,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  Image,
  Pressable,
  ToastAndroid ,
  TouchableOpacity,
  Animated,
  Linking,
  Button,
  Text,
  Alert,
  FlatList
} from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import logo from '../assets/logo.png'
import { FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ScrollView } from "react-native-gesture-handler";
import { Video, AVPlaybackStatus, Audio } from 'expo-av';

import firebaseConfig from './firebase'
import { initializeApp } from 'firebase/app';
//import { getStorage, ref, uploadBytesResumable, getDownloadURL, getMetadata, uploadBytes } from "firebase/storage";
import { getDatabase, set, ref as ref_database, child, onValue, update } from "firebase/database";
import * as IntentLauncher from 'expo-intent-launcher';



export default function FeedDetails({ route,navigation }) {

    const {  
        id,
      } = route.params; 

      const app = initializeApp(firebaseConfig);
      //const storage = getStorage(app);
      const database = getDatabase(app);
      const [feedback, setFeedback] = useState('');
 
      
      const GetFeedBack = async () => {
      const FeedBack = ref_database(database, 'FeedBacks/' + id);
      onValue(FeedBack, (snapshot) => {
       setFeedback(snapshot.val());
        console.log(snapshot.val());
      });
      }

      const UpdateSeen = async () => {
        update(ref_database(database, 'FeedBacks/' + id),{"seen": true})
       // console.log(view)
        }

      useEffect(()=>{
        GetFeedBack();
        UpdateSeen();
      },[])

  return (
    <View style={styles.container}>
    <StatusBar translucent backgroundColor="transparent" barStyle={'dark-content'}/>
    <View style={{backgroundColor:'#fff', width:'100%', height:70, marginBottom:0,marginTop:30, flexDirection:'column',borderBottomWidth:0.5, borderBottomColor:'#cccacb'}}>
      <View style={{alignSelf:'flex-start', position:'absolute', marginTop:5, paddingVertical:5, flexDirection:'row'}}>
      <Text style={{marginLeft:20, textAlignVertical:'center', marginTop:5, fontSize:25,letterSpacing:4, fontWeight:'bold', color:'#ad0794'}}>
        Pro<Text style={{fontWeight:'normal'}}>flex.</Text><Text style={{fontWeight:'normal', fontSize:12, color:'black'}}>Admin</Text></Text>
      </View>
    </View>
   <View>
    <Text style={{fontWeight:'normal', fontSize:18, marginLeft:5,margin:10, color:'#000'}}>{feedback.feedback}</Text>
   </View>
      
    </View>

    
  );

  
}

const styles = StyleSheet.create({
    container: {
          flex: 1,
          backgroundColor: '#fff',
        },

        fab: {
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 150,
          backgroundColor:'red'
        },
  });
