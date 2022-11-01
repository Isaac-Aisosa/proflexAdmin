import * as React from 'react';
import { View, Text, Button, StatusBar } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Feed from './FeedIndex'
import More from './More'
import Add from './AddVidoes'
import Special from './Special';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    
    <Tab.Navigator
    initialRouteName="Add"
    tabBarOptions={{
        activeTintColor: '#ad0794',
        inactiveTintColor:'#8a8787',
        //labelStyle: { fontSize: 14, fontWeight:'normal'},
        
        style:{
           backgroundColor:'#fff',
           paddingBottom:5,
           paddingTop:5,
           borderTopColor:'#fff',
           height:50,
           fontSize:30
        }
        
      }}

   >
    
      
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          headerShown: false,
          tabBarLabel: 'Proflex',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-variant" color={color} size={25} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Add"
        component={Add}
        options={{
          headerShown: false,
          tabBarLabel: 'Add Movies',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-circle-outline" color={color} size={36} />
          ),
        }}
      />



      <Tab.Screen
        name="Special"
        component={Special}
        options={{
          headerShown:false,
          tabBarLabel: 'More',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dots-horizontal-circle-outline" color={color} size={25} />
          ),
        }}
      />


    </Tab.Navigator>

    

     





  );
}