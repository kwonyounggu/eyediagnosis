import * as React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../../contexts/appProvider';
import {isEmpty} from 'lodash';
import { signOut, onAuthStateChanged} from 'firebase/auth';
import { auth } from '../../firebase/firebase';

import { homeName, chattingName, settingsName, forumName, appLoginScreenName, appHome, appForgotPasswordScreenName, appRegisterScreenName } from '../../constants';
import HomeScreen from './homeScreen';
import ForumScreen from './forumScreen';
import ChattingScreen from './chattingScreen';
import SettingsScreen from './settingsScreen';

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

//const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

/**
 * https://stackoverflow.com/questions/60375329/add-icon-to-drawer-react-navigation-v5
 * https://reactnavigation.org/docs/drawer-navigator/
 * https://www.youtube.com/watch?v=mRoDNjhRO3E&ab_channel=FullStackNiraj
 * https://github.com/react-navigation/react-navigation/issues/10059
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
	            <Text ellipsizeMode='tail'>{appUser.displayName}</Text>
	            <Text ellipsizeMode='tail'>{appUser.email}</Text>
	          </View>
	          <Image
	            source=
	            {
					{
	              		uri: appUser.photoURL,
	            	}
	            }
	            style={{ width: 60, height: 60, borderRadius: 30 }}
	          /></>)
	          }
	        </View>
	        <DrawerItemList {...props} />
	      </DrawerContentScrollView>
	      {
			  !isEmpty(appUser) &&
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
			    onPress={()=>signOut(auth).then(()=>console.log('Signed out'))}
		      >
		        <Text>Log Out</Text>
		      </TouchableOpacity>
		  }
	    </View>
	  );
};
export default function HomeRoot({navigation})
{
	const getHeaderTitle  = (route) =>
	{
		const routeName = getFocusedRouteNameFromRoute(route)?? appHome;
		
		console.log("routeName: ", routeName);
		
		switch(routeName)
		{
			case appHome: return 'Home';
			case appLoginScreenName: return 'Login';
			case appRegisterScreenName: return 'SignUp';
			case appForgotPasswordScreenName: return 'Restore Password';
			default: return 'Unknown';
		}
	}
	
	const getHeaderTitleNavigator  = (route, navigation) =>
	{
		console.log("--route: ", route);
		console.log("--navigation: ", navigation);
		const routeName = getFocusedRouteNameFromRoute(route);
		
		//if (routeName === undefined) navigation.navigate(appHome);
		console.log("routeName in getHeaderTitleNavigator: ", routeName);
		
		
	}
    return (
      <Drawer.Navigator 
      			initialRouteName={homeName}
      			screenListeners=
      			{
					{
					     drawerItemPress: (e) => 
					     {
					        if (e.target?.includes(homeName)) 
					        {
					         navigation.navigate(appHome);
					        }
					        //console.log(e.target);
					     } 
				     } 
				}
      			screenOptions=
            	{
					({route, navigation})=>
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
						   ({route}) =>
						   (
							   {
								   headerTitle: getHeaderTitle(route),
								   headerShown: true,
								   drawerIcon: ({focused, size}) => 
								   (
								              <Ionicons
								                 name="md-home"
								                 size={size}
								                 color={focused ? '#7cc' : '#ccc'}
								              />
								   )
							   }
						   )
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