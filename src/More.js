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
  ToastAndroid ,
  TouchableOpacity,
  Animated,
  Easing,
  Text,
} from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import logo from '../assets/logo.png'
import { FAB } from 'react-native-paper';
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function More(props) {

  return (
    <View style={styles.container}>
    <StatusBar translucent backgroundColor="transparent" barStyle={'dark-content'}/>
        
    <View style={{backgroundColor:'#fff', width:'100%', height:50, marginBottom:0,marginTop:30, flexDirection:'column',borderWidth:0}}>
     {/* <Image style={{ alignSelf:'center', marginLeft:20,marginTop:5, width:'10%', height:40}} source={logo}   /> */}
     <Text style={{marginLeft:20, textAlignVertical:'center', marginTop:5, fontSize:25,letterSpacing:4, fontWeight:'bold', color:'#ad0794'}}>
        Pro<Text style={{fontWeight:'normal'}}>flex.</Text><Text style={{fontWeight:'normal', fontSize:12, color:'black'}}>Admin</Text></Text>
      <View style={{alignSelf:'flex-end', position:'absolute', marginTop:5, paddingVertical:5, flexDirection:'row'}}>
      <MaterialCommunityIcons name="magnify" style={{fontSize:30, paddingRight:10, color:'#000'}} />
      <MaterialCommunityIcons name="account-circle" style={{fontSize:30, paddingRight:10, color:'#000'}} />
      </View>
    </View>
    <View style={{backgroundColor:'#fff', width:'100%', height:85, marginBottom:0}}>
  
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
