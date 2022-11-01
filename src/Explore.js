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


export default function Explore(props) {

  return (
    <View style={styles.container}>
    <StatusBar translucent backgroundColor="transparent" barStyle={'dark-content'}/>
    
    <View style={{backgroundColor:'#fff', width:'100%', height:85, marginBottom:0}}>
    <Image style={{ alignSelf:'center', marginTop:30, width:"50%", height:"60%"}} source={logo}   />
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
