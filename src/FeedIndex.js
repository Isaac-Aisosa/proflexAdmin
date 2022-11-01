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
const [movies, setMovies] = useState('');
const [isLoading, setisLoading] = useState(true);

let VideosCount = movies.length

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

const MoviesFeeds = async () => {
  const GetMovies = query(ref_database(database, 'Movies/'));
  onValue(GetMovies, (snapshot) => {
    let values = [];
    snapshot.forEach((child) => {
      values.push(child.val());
    });
    setisLoading(false);
   setMovies(values.reverse());
  //  console.log(values);
  });
  }

function ShowDetails(id) {
  console.log(id);
  navigation.navigate('MovieDetails',{id:id})
}

function Delete(id) {
  console.log(id);
  remove(ref_database(database, 'Movies/' + id))
}

useEffect(()=>{
  MoviesFeeds();
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
      <Text style={{color:'#000', marginTop:5, marginRight:10, fontWeight:'bold'}}>Videos {nFormatter(VideosCount)}</Text>
      <MaterialCommunityIcons name="magnify" style={{fontSize:30, paddingRight:10, color:'#000'}} />
      </View>
    </View>
    <ActivityIndicator size='large' color="#000"  animating={isLoading}
           style={{paddingRight:10,position:'absolute', alignSelf:'center', paddingTop:10, marginVertical:200}}/>
    <FlatList
      data={movies}
      keyExtractor={(item, index) => index.toString()}
      initialNumToRender={10}
      inverted={false}
      renderItem={({ item }) => (
   <View style={{backgroundColor:'#fff', flex: 1, flexDirection: 'column',  margin:1}}>
    <TouchableOpacity  onPress={(id)=>ShowDetails(item.id)} >
      <Image  style={{justifyContent: 'center',  alignItems: 'center',width:"100%", height:item.thumbnailHeight * Dimensions.get('window').width/item.thumbnailWidth}}       
      source={{uri: item.thumbnailUri}}/>
   <View  style={{paddingRight:10,flexDirection:'row', marginBottom:20, position:'absolute'}}>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'#fff', paddingRight:5,}}>
    <MaterialCommunityIcons name="hexagram" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#f5710c',}} />{item.rating}</Text>
    </View>
        <Text style={{fontWeight:'bold', fontSize:20, marginLeft:5,marginTop:5, color:'#000'}}>{item.title}</Text>
    <Text numberOfLines={2} style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:0, color:'#9e9e9e', }}>{item.description}</Text>
    <View  style={{paddingRight:10,flexDirection:'row', marginBottom:20}}>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:5,}}> 
    <MaterialCommunityIcons name="video-vintage" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#ad0794',}} />{item.category}</Text>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:5,}}>
    <MaterialCommunityIcons name="movie-roll" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#f5710c',}} />{item.genre}</Text>
    </View>
    <View  style={{paddingRight:10, alignSelf:'flex-end',flexDirection:'row', marginBottom:20}}>
    <MaterialCommunityIcons name="download" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'gray',}} />
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:10,}}>{nFormatter(item.downloads)}</Text>
    <MaterialCommunityIcons name="eye-outline" style={{fontSize:18, paddingRight:0, marginTop:5, color:'gray',}} />
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:10,}}>{nFormatter(item.views)}</Text>

   <Pressable
   onPress={(id)=>Delete(item.id)} style={{width:100,height:30, flexDirection:'row', backgroundColor:'#ad0794',padding:5, borderRadius:5}}>
   <MaterialCommunityIcons name="delete" style={{fontSize:18, paddingRight:0,  color:'#fff'}} />
    <Text style={{fontWeight:'bold', fontSize:15, marginLeft:5,marginTop:0, color:'#fff', paddingRight:10,}}>Delete</Text>
   </Pressable>
   </View>
    </TouchableOpacity>
   </View>
     
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
