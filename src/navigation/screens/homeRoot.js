import * as React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../../contexts/appProvider';
import {isEmpty} from 'lodash';
import { signOut, onAuthStateChanged} from 'firebase/auth';
import { auth } from '../../firebase/firebase';

import { homeName, chattingName, settingsName, forumName, appLoginScreenName } from '../../constants';
import HomeScreen from './homeScreen';
import ForumScreen from './forumScreen';
import ChattingScreen from './chattingScreen';
import SettingsScreen from './settingsScreen';

//const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

/**
 * https://stackoverflow.com/questions/60375329/add-icon-to-drawer-react-navigation-v5
 * https://reactnavigation.org/docs/drawer-navigator/
 * https://www.youtube.com/watch?v=mRoDNjhRO3E&ab_channel=FullStackNiraj
 */

const CustomDrawer = (props) =>
{
	//75: const {onUpdateChatGptUser} = React.useContext(AppContext).actions; 
	const {appUser} = React.useContext(AppContext).state;
	//console.log("INFO: isEmpty(appUser) = ", isEmpty(appUser));
	
	const {onUpdateAppUser} = React.useContext(AppContext).actions;
	
	React.useEffect
	(
		() =>
		{
			const unsubscribe = onAuthStateChanged
			(
				auth,
				(user) =>
				{
					if (user) onUpdateAppUser(user);
					else onUpdateAppUser({});
				}
				
			)
			return unsubscribe;
		},
		[]
	);
	return (
	    <View style={{ flex: 1 }}>
	      <DrawerContentScrollView {...props}>
	        <View
	          style=
	          {
				  {
		            flexDirection: 'row',
		            justifyContent: 'space-between',
		            alignItems: 'center',
		            padding: 20,
		            backgroundColor: '#f6f6f6',
		            marginBottom: 20,
	          	  }
	          }
	        >
	        {
				isEmpty(appUser) ?
				(<TouchableOpacity onPress={()=>props.navigation.navigate(appLoginScreenName, {email: '', password: ''})}><Text>Login</Text></TouchableOpacity>):
	          (<><View>
	            <Text>John Doe</Text>
	            <Text>example@email.com</Text>
	          </View>
	          <Image
	            source=
	            {
					{
	              		uri: 'https://images.unsplash.com/photo-1624243225303-261cc3cd2fbc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
	            	}
	            }
	            style={{ width: 60, height: 60, borderRadius: 30 }}
	          /></>)
	          }
	        </View>
	        <DrawerItemList {...props} />
	      </DrawerContentScrollView>
	      <TouchableOpacity
	        style=
	        {
				{
		          position: 'absolute',
		          right: 0,
		          left: 0,
		          bottom: 50,
		          backgroundColor: '#f6f6f6',
		          padding: 20
		        }
		    }
		    onPress={()=>signOut().then(()=>console.log('Signed out'))}
	      >
	        <Text>Log Out</Text>
	      </TouchableOpacity>
	    </View>
	  );
};
export default function HomeRoot({navigation})
{
    return (
      <Drawer.Navigator 
      			initialRouteName={homeName}
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
				drawerContent={props => <CustomDrawer {...props} />}
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