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
  Easing,
  Text,
  ActivityIndicator,
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
import firebaseConfig from './firebase'
import { initializeApp } from 'firebase/app';
//import { getStorage, ref, uploadBytesResumable, getDownloadURL, getMetadata, uploadBytes } from "firebase/storage";
import { getDatabase, set, ref as ref_database, child,  onValue, remove, orderByChild, query, orderByValue, limitToLast } from "firebase/database";


export default function IndexFeed({ route,navigation }) {

const app = initializeApp(firebaseConfig);
//const storage = getStorage(app);
const database = getDatabase(app);
const [feedback, setFeedback] = useState('');
const [isLoading, setisLoading] = useState(true);

let feedbackCount = feedback.length

function nFormatter(num) {
  if (num >= 1000000000) {
     return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
     return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
     return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
}

const GetFeedBack = async () => {
  const Feedback = query(ref_database(database, 'FeedBacks/'));
  onValue(Feedback, (snapshot) => {
    let values = [];
    snapshot.forEach((child) => {
      values.push(child.val());
    });
    setisLoading(false);
   setFeedback(values.reverse());
  //console.log(values);
  });
  }

function ShowDetails(id) {
  console.log(id);
  navigation.navigate('FeedDetails',{id:id})
}

useEffect(()=>{
  GetFeedBack();
},[])

  const ratio = Dimensions.get('window').width/541;//replace 541 with image width

  return (
    <View style={styles.container}>
    <StatusBar translucent backgroundColor="transparent" barStyle={'dark-content'}/>
    
    <View style={{backgroundColor:'#fff', width:'100%', height:50, marginBottom:0,marginTop:30, flexDirection:'column',borderWidth:0}}>
     {/* <Image style={{ alignSelf:'center', marginLeft:20,marginTop:5, width:'10%', height:40}} source={logo}   /> */}
     <Text style={{marginLeft:20, textAlignVertical:'center', marginTop:5, fontSize:25,letterSpacing:4, fontWeight:'bold', color:'#ad0794'}}>
        Pro<Text style={{fontWeight:'normal'}}>flex.</Text><Text style={{fontWeight:'normal', fontSize:12, color:'black'}}>Admin</Text></Text>
      <View style={{alignSelf:'flex-end', position:'absolute', marginTop:5, paddingVertical:5, flexDirection:'row'}}>
      <Text style={{color:'#000', marginTop:5, marginRight:10}}>Feedback: {nFormatter(feedbackCount)}</Text>
      <MaterialCommunityIcons name="magnify" style={{fontSize:30, paddingRight:10, color:'#000'}} />
      </View>
    </View>
    <ActivityIndicator size='large' color="#000"  animating={isLoading}
           style={{paddingRight:10,position:'absolute', alignSelf:'center', paddingTop:10, marginVertical:200}}/>
    <FlatList
      data={feedback}
      keyExtractor={(item, index) => index.toString()}
      initialNumToRender={10}
      inverted={false}
      renderItem={({ item }) => (
     <TouchableOpacity onPress={(id)=>ShowDetails(item.id)} style={{height:40,margin:10, borderBottomWidth:1}}>
       {item.seen == true ? (
      <Text numberOfLines={1} style={{fontSize:18, fontWeight:'bold', color:'#700151'}}>{item.feedback}</Text>
       ):(
      <Text numberOfLines={1} style={{fontSize:18, fontWeight:'bold'}}>{item.feedback}</Text>
       )}
     </TouchableOpacity>
      )}
    />


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
