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
  ActivityIndicator,
  Button,
  Text,
} from "react-native";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import thumb from '../assets/no-thumbnail.jpg'
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TextInput,  
     Appbar,
    DarkTheme,
    DefaultTheme,
    Provider,
    Surface,
    ThemeProvider,  } from 'react-native-paper';
import DropDown from "react-native-paper-dropdown";
import { ScrollView } from "react-native-gesture-handler";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { Video, AVPlaybackStatus } from 'expo-av';

import firebaseConfig from './firebase'
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, getMetadata, uploadBytes } from "firebase/storage";
import { getDatabase, set, ref as ref_database, push, update } from "firebase/database";

export default function IndexFeed({ route,navigation }) {

 // const thumbnail = 'https://globaladvocacyafrica.org/wp-content/plugins/penci-pennews-portfolio/images/no-thumbnail.jpg'
  const [category, setCategory] =  useState ("");
  const [genre, setGenre] =  useState ("");
  const [release_date, setReleaseDate] =  useState (new Date(Date.now()));
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [description, setDescription] =  useState ("");
  const [showDropDown, setShowDropDown] = useState(false);
  const [showRateDropDown, setRateShowDropDown] = useState(false);
  const [showMultiSelectDropDown, setShowMultiSelectDropDown] = useState(false);
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('https://globaladvocacyafrica.org/wp-content/plugins/penci-pennews-portfolio/images/no-thumbnail.jpg');
  const [thumbnailWidth, setThumbnailwidth] = useState(200);
  const [thumbnailHeight, setThumbnailHeight] = useState(200);
  const [thumbnailName, setThumbnailName] = useState('');
  const [thumbnailMIME, setThumbnailMIME] = useState('');
  const [thumbnailLink, setThumbnailLink] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [isLoading, setisLoading] = useState(false)
  const [next, setNext] = useState('flex')
  const [rate, setRate] = useState('');

  const showPicker = () => {
    setIsPickerShow(true);
  };

  const onChange = (event, value) => {
    setReleaseDate(value);
    if (Platform.OS === 'android') {
      setIsPickerShow(false);
    }
  };
 

  const categoryList = [
    {
      label: "NollyWood",
      value: "NollyWood",
    },
    {
      label: "HollyWood",
      value: "HollyWood",
    },
    {
      label: "Korean",
      value: "Korean",
    },
    {
        label: "Chinese",
        value: "Chinese",
    },
    {
        label: "BollyWood",
        value: "BollyWood",
    },
    {
        label: "Others",
        value: "Others",
      },
  ];

  const rateList = [
    {
      label: "1.1",
      value: 1.1,
    },
    {
      label: "1.5",
      value: 1.5,
    },
    {
      label: "2.1",
      value: 2.1,
    },
    {
        label: "2.5",
        value: 2.5,
    },
    {
        label: "3.1",
        value: 3.1,
    },
    {
        label: "3.5",
        value: 3.5,
      },
      {
        label: "4.1",
        value: 4.1,
      },
      {
        label: "4.5",
        value: 4.5,
      },
      {
        label: "5.1",
        value: 5.1,
      },
      {
        label: "5.5",
        value: 5.5,
      },
      {
        label: "6.5",
        value: 6.5,
      },
      {
        label: "7.0",
        value: 7.0,
      },
      {
        label: "7.5",
        value:  7.5,
      },
      {
        label: "8.0",
        value:  8.0,
      },
      {
        label: "9.0",
        value:  9.0,
      },

  ];

  const genreList = [
    {
      label: "Action",
      value: "Action",
    },
    {
      label: "Adventure",
      value: "Adventure",
    },
    {
      label: "Animated",
      value: "Animated",
    },
    {
        label: "Comedy",
        value: "Comedy",
    },
    {
        label: "Drama",
        value: "Drama",
    },
    {
        label: "Fantasy",
        value: "Fantasy",
    },
    {
        label: "Historical",
        value: "Historical",
    },
    {
        label: "Horror",
        value: "Horror",
    },
    {
        label: "Noir",
        value: "Noir",
    },
    {
        label: "Sci-fic",
        value: "Sci-fic",
    },
    {
        label: "Thriller",
        value: "Thriller",
    },
  ];
  
 
  const pickthumbnail = async () => {
 
    let result = await DocumentPicker.getDocumentAsync({
        type: "image/*" // all images files
    });
    console.log(result.uri);
    setThumbnail(result.uri);
    setThumbnailName(result.name);
    setThumbnailMIME(result.mimeType);
 
    //alert(thumbnail);
    Image.getSize(result.uri, (width, height) => {
        setThumbnailwidth(width);
        setThumbnailHeight(height);
    });
    
    }

    //Set Thumbnail demision
 const ratio = Dimensions.get('window').width/thumbnailWidth;//replace 541 with image width

 const app = initializeApp(firebaseConfig);
 const storage = getStorage(app);
 const database = getDatabase(app);

 
const uploadMovie = async () => {   
    setNext('none');
    setisLoading(true);
    ToastAndroid.show('Uploading Movie...', ToastAndroid.LONG);

const ThumbBlob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
   };
   xhr.onerror = function() {
     reject(new TypeError('Network request failed')); // error occurred, rejecting
   };
   xhr.responseType = 'blob'; // use BlobModule's UriHandler
   xhr.open('GET', thumbnail, true); // fetch the blob from uri in async mode
   xhr.send(null); // no initial data
 });

 
/** @type {any} */
const thumbmetadata = {
    contentType: thumbnailMIME
    
  };
const ImageStorageRef = ref(storage, 'thumbnails/' + title +'/' + thumbnailName);

const uploadTask = uploadBytesResumable(ImageStorageRef, ThumbBlob,  thumbmetadata);
// Listen for state changes, errors, and completion of the upload.
uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    alert('Uploading Thumbnail ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
      case 'success':
        setNext('flex');
        setisLoading(false);
        console.log('Upload Success');
        ToastAndroid.show('Upload Success', ToastAndroid.SHORT);
       break;
    }
  }, 
  (error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        ToastAndroid.show('User does not have permission to access the object', ToastAndroid.SHORT);
        break;
      case 'storage/canceled':
        // User canceled the upload
        ToastAndroid.show('User canceled the upload', ToastAndroid.SHORT);
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        ToastAndroid.show('Unknown error occurred, inspect error.serverResponse', ToastAndroid.SHORT);
        break;
      }
    }, 
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        setThumbnailLink(downloadURL);
    // upload data to database
   const PostKey = push(ref_database(database, 'Movies/'), {
    title: title,
    category: category,
    genre : genre.substring(1),
    release_date : release_date.toDateString(),
    description : description,
    thumbnailHeight : thumbnailHeight,
    thumbnailWidth : thumbnailWidth,
    views : 0,
    downloads : 0,
    rating : rate,
    thumbnailUri : downloadURL,
    fileUri : fileUrl,
  })
  update(PostKey,{"id": PostKey.key})
      });
    setNext('flex');
    setisLoading(false);
    console.log('Upload Success');
    ToastAndroid.show('Upload Success', ToastAndroid.SHORT);
    setTitle('');
    setFileUrl('');
    setDescription('');
    });


}

  return (
    <View style={styles.container}>
    <StatusBar translucent backgroundColor="transparent" barStyle={'dark-content'}/>
    <View style={{backgroundColor:'#fff', width:'100%', height:70, marginBottom:0,marginTop:30, flexDirection:'column',borderBottomWidth:0.5, borderBottomColor:'#cccacb'}}>
      <View style={{alignSelf:'flex-start', position:'absolute', marginTop:5, paddingVertical:5, flexDirection:'row'}}>
      <Text style={{marginLeft:20, textAlignVertical:'center', marginTop:5, fontSize:25,letterSpacing:4, fontWeight:'bold', color:'#ad0794'}}>
        Pro<Text style={{fontWeight:'normal'}}>flex.</Text><Text style={{fontWeight:'normal', fontSize:12, color:'black'}}>Admin</Text></Text>
      </View>
      <View>
        
      </View>
      <ActivityIndicator size="large" color="#ad0794"  animating={isLoading}
           style={{paddingRight:10,position:'absolute', alignSelf:'flex-end', paddingTop:10}}/>
      <Pressable
      onPress={uploadMovie}
      style={{width:'20%', height:40, backgroundColor:'#ad0794', borderRadius:5, marginTop:10, alignSelf:'flex-end',marginRight:10, display:next}}>
      <Text style={{alignSelf:'center', marginTop:5, fontSize:18, fontWeight:'normal', color:'#fff',}}>Upload</Text>
    </Pressable>
    </View>
    <Provider >
    <ScrollView>    
        <View  style={{marginTop:10, margin:20}}>
            <View style={{flexDirection:'row',  alignSelf:'center'}}>
            <MaterialCommunityIcons name="filmstrip" style={{fontSize:30, paddingRight:0, color:'#000'}} />
            <Text style={{fontSize:25, fontWeight:'bold'}}>Add New Movie</Text>
            </View>

        <Surface style={styles.containerStyle}>
          <SafeAreaView style={styles.safeContainerStyle}>
          <Text style={{fontSize:20, marginTop:0}}>
           Movie Title
        </Text>
            <TextInput
             mode="outlined"
             label="Title"
             placeholder='Movie Title'
             name='Title'
             value={title}
             keyboardType='default'
             style={{backgroundColor:'#f7f0f4', fontSize:20, height:100}}
             textContentType='none'
             autoCapitalize='none'
             activeOutlineColor="#ad0794"
             multiline={true}
             onChangeText={(val)=>setTitle(val)}      
             />

       <Text style={{fontSize:20, marginTop:20}}>
           Movie Category
        </Text>
            <DropDown
              label={"Category"}
              mode={"outlined"}
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
              value={category}
              setValue={setCategory}
              list={categoryList}
            />
          

        <Text style={{fontSize:20, marginTop:20}}>
           Movie Genre
        </Text>
            <DropDown
              label={"Genre"}
              mode={"outlined"}
              visible={showMultiSelectDropDown}
              showDropDown={() => setShowMultiSelectDropDown(true)}
              onDismiss={() => setShowMultiSelectDropDown(false)}
              value={genre}
              setValue={setGenre}
              list={genreList}
              multiSelect
            />

<Text style={{fontSize:20, marginTop:20}}>
           Rate Movie
        </Text>
            <DropDown
              label={"Rate"}
              mode={"outlined"}
              visible={showRateDropDown}
              showDropDown={() => setRateShowDropDown(true)}
              onDismiss={() => setRateShowDropDown(false)}
              value={rate}
              setValue={setRate}
              list={rateList}
            />


        <Text style={{fontSize:20, marginTop:20}}>
           Release Date
        </Text> 
    
        <Text style={{fontSize:20, marginTop:10, marginBottom:10, fontWeight:'bold'}}>
           {release_date.toDateString()}
        </Text>

      {/* The button that used to trigger the date picker */}
      {!isPickerShow && (
        <View style={styles.btnContainer}>
          <Button title="Select Date" color="purple" onPress={showPicker} />
        </View>
      )}

      {/* The date picker */}
      {isPickerShow && (
        <DateTimePicker
          value={release_date}
          mode={'date'}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour={true}
          onChange={onChange}
          style={styles.datePicker}
        />
      )}


      <Text style={{fontSize:20, marginTop:20, fontWeight:'bold'}}>
          File URL*
        </Text>
        <TextInput
             mode="outlined"
             label="File url"
             placeholder=''
             name='file_url'
             value={fileUrl}
             keyboardType='default'
             style={{backgroundColor:'#f7f0f4', fontSize:20, height:120,textAlignVertical:'top'}}
             textContentType='none'
             autoCapitalize='none'
             textAlignVertical='top'
             multiline={true}
             activeOutlineColor="#ad0794"
             onChangeText={(val)=>setFileUrl(val)}/> 

       <Text style={{fontSize:20, marginTop:20}}>
           Movie Description
        </Text>
            <TextInput
             mode="outlined"
             label=""
             placeholder='Write about movie here.....'
             name='Description'
             value={description}
             keyboardType='default'
             style={{backgroundColor:'#f7f0f4', fontSize:20, height:400,textAlignVertical:'top'}}
             textContentType='none'
             autoCapitalize='none'
             textAlignVertical='top'
             multiline={true}
             activeOutlineColor="#ad0794"
             onChangeText={(val)=>setDescription(val)}/> 

         <Text style={{fontSize:20, marginTop:20}}>
           Movie Thumbnail
        </Text>
        <Text style={{fontSize:15, marginTop:0}}>
           Size: {thumbnailHeight}x{thumbnailWidth}
        </Text>

        <Pressable onPress={pickthumbnail} style={{width:'100%'}}>
        <Image style={{ alignSelf:'center', marginTop:30, width:"100%", height:thumbnailHeight * ratio}} 
         source={{
            uri: thumbnail,
          }}
          />
        </Pressable> 


     </SafeAreaView>
        </Surface>
   


             
    </View>

    </ScrollView>
    </Provider>
    </View>

    
  );

  
}

const styles = StyleSheet.create({
    container: {
          flex: 1,
          backgroundColor: '#fff',
        },
        containerStyle: {
            flex: 1,
          },
          spacerStyle: {
            marginBottom: 15,
          },
          safeContainerStyle: {
            flex: 1,
            margin: 20,
            justifyContent: "center",
          },
  });
