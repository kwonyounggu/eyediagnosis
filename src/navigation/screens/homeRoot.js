import * as React from 'react';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { homeName, chattingName, settingsName, forumName } from '../../constants';
import HomeScreen from './homeScreen';
import ForumScreen from './forumScreen';
import ChattingScreen from './chattingScreen';
import SettingsScreen from './settingsScreen';

//const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

/**
 * https://stackoverflow.com/questions/60375329/add-icon-to-drawer-react-navigation-v5
 * https://reactnavigation.org/docs/drawer-navigator/
 */
export default function HomeRoot({navigation})
{
    return (
      <Drawer.Navigator initialRouteName={homeName}
      			screenOptions=
            	{
					({route})=>
					(
						{
							headerStyle: 
							{
					            backgroundColor: '#f4511e'
					        },
							headerTintColor: '#fff',
					        headerTitleStyle: 
					        {
					            fontWeight: 'bold'
					        }
						}
					)
				}
      >
        <Drawer.Screen name={homeName} 
        			   component={HomeScreen} 
        			   options=
        			   {
						   {
							   title: 'Home',
							   drawerIcon: ({focused, size}) => 
							   (
							              <Ionicons
							                 name="md-home"
							                 size={size}
							                 color={focused ? '#7cc' : '#ccc'}
							              />
							   )
						   }
					   }
        />
        <Drawer.Screen name={forumName} 
        			   component={ForumScreen} 
        			   options=
        			   {
						   {
							   title: 'Forum for Professionals',
							   drawerIcon: ({focused, size}) => 
							   (
							              <Ionicons
							                 name="md-home"
							                 size={size}
							                 color={focused ? '#7cc' : '#ccc'}
							              />
							   )
						   }
					   }
        />
	    <Drawer.Screen name={chattingName} 
	    			   component={ChattingScreen}
	    			   options=
        			   {
						   {
							   title: 'Group Chatting',
							   drawerIcon: ({focused, size}) => 
							   (
							              <Ionicons
							                 name="md-home"
							                 size={size}
							                 color={focused ? '#7cc' : '#ccc'}
							              />
							   )
						   }
					   } 
	    />
	    <Drawer.Screen name={settingsName} 
	    			   component={SettingsScreen}
	    			   options=
        			   {
						   {
							   title: 'Settings',
							   drawerIcon: ({focused, size}) => 
							   (
							              <Ionicons
							                 name="settings"
							                 size={size}
							                 color={focused ? '#7cc' : '#ccc'}
							              />
							   )
						   }
					   } 
	    />
      </Drawer.Navigator>
	);
}