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
import { getDatabase, set, ref as ref_database, child, onValue } from "firebase/database";
import * as IntentLauncher from 'expo-intent-launcher';



export default function MovieDetails({ route,navigation }) {

    const {  
        id,
      } = route.params; 

      const app = initializeApp(firebaseConfig);
      //const storage = getStorage(app);
      const database = getDatabase(app);
      const [movie, setMovie] = useState('');
      const video = useRef(null);
      const [status, setStatus] = useState({});
      
      const GetMovie = async () => {
      const GetMovie = ref_database(database, 'Movies/' + id);
      onValue(GetMovie, (snapshot) => {
       setMovie(snapshot.val());
        console.log(snapshot.val());
      });
      }

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


     async function play(uri){
      try {
                     
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
            data: movie.fileUri,
            flags: 1,
            type: "video/*",
        });
      }catch(e){
          console.log(e.message);
      }
      }

      useEffect(()=>{
        GetMovie();
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
      {/* <Video
        ref={video}
        style={{height:300, width:'100%'}}
        source={{
          uri: movie.fileUri,
        }}
        // source={require("../assets/man.mp4")}
        useNativeControls
        resizeMode="cover"
        isLooping
        posterSource={movie.thumbnailUri}
        rate={1.0}
        volume={1.0} 
        isMuted={false}
        usePoster={true}
        shouldPlay={true}
        progressUpdateIntervalMillis={50}
        posterStyle={{height:300, width:'100%'}}
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      /> */}
      <Image  style={{justifyContent: 'center',  alignItems: 'center',height:300, width:'100%'}}       
      source={{uri: movie.thumbnailUri}}/>
      <View style={styles.buttons}>
        <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
           play(movie.fileUri)
          }
        />
      </View>
     
    <Text style={{fontWeight:'bold', fontSize:20, marginLeft:5,marginTop:5, color:'#000'}}>{movie.title}</Text>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:0, color:'#9e9e9e'}}>{movie.description}</Text>
    <View  style={{paddingRight:10,flexDirection:'row', marginBottom:0}}>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:5,}}> 
    <MaterialCommunityIcons name="video-vintage" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#ad0794',}} />{movie.category}</Text>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:5,}}>
    <MaterialCommunityIcons name="movie-roll" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#000',}} />{movie.genre}</Text>
    </View>
    <View  style={{paddingRight:10,flexDirection:'row', marginBottom:0}}>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:5,}}>
    <MaterialCommunityIcons name="star" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#f5710c',}} />{movie.rating}</Text>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:5,}}>
    <MaterialCommunityIcons name="clock" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#000',}} />{movie.release_date}</Text>
    </View>
    <View  style={{paddingRight:10, alignSelf:'flex-end',flexDirection:'row', marginBottom:20}}>
    <MaterialCommunityIcons name="download" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'gray',}} />
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:10,}}>{nFormatter(movie.downloads)}</Text>
    <MaterialCommunityIcons name="eye-outline" style={{fontSize:18, paddingRight:0, marginTop:5, color:'gray',}} />
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:10,}}>{nFormatter(movie.views)}</Text>
    <Pressable style={{width:100,height:30, flexDirection:'row', backgroundColor:'#ad0794',padding:5, margin:5,borderRadius:5}}>
   <MaterialCommunityIcons name="pencil" style={{fontSize:18, paddingRight:0,  color:'#fff'}} />
    <Text style={{fontWeight:'bold', fontSize:15, marginLeft:5,marginTop:0, color:'#fff', paddingRight:10,}}>Edit</Text>
   </Pressable>
   <Pressable style={{width:100,height:30, flexDirection:'row', backgroundColor:'#ad0794',padding:5,margin:5, borderRadius:5}}>
   <MaterialCommunityIcons name="delete" style={{fontSize:18, paddingRight:0,  color:'#fff'}} />
    <Text style={{fontWeight:'bold', fontSize:15, marginLeft:5,marginTop:0, color:'#fff', paddingRight:10,}}>Delete</Text>
   </Pressable>
   </View>
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
