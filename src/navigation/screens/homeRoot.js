import * as React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, useDrawerStatus } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../../contexts/appProvider';
import {isEmpty} from 'lodash';
import { signOut, onAuthStateChanged} from 'firebase/auth';
import { auth } from '../../firebase/firebase';

import { homeName, settingsName, forumName, appLoginScreenName, appHome, appForgotPasswordScreenName, appRegisterScreenName, chattingHomeName } from '../../constants';
import HomeScreen from './homeScreen';
import ForumScreen from './forumScreen';
import SettingsScreen from './settingsScreen';

import { getFocusedRouteNameFromRoute, useRoute } from '@react-navigation/native';
import ChattingHomeScreen from './chattingHomeScreen';

//const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

/**
 * https://stackoverflow.com/questions/60375329/add-icon-to-drawer-react-navigation-v5
 * https://reactnavigation.org/docs/drawer-navigator/
 * https://www.youtube.com/watch?v=mRoDNjhRO3E&ab_channel=FullStackNiraj
 * https://www.youtube.com/watch?v=l8nY4Alk70Q&ab_channel=PradipDebnath
 * https://github.com/react-navigation/react-navigation/issues/10059
 * https://snack.expo.dev/?platform=web
 * https://reactnavigation.org/docs/drawer-navigator/
 */

const CustomDrawer = (props) =>
{
	//console.log("customedrawer props: ", props);
	const {navigation} = props;
	//75: const {onUpdateChatGptUser} = React.useContext(AppContext).actions; 
	const {appUser} = React.useContext(AppContext).state;
	//console.log("INFO: isEmpty(appUser) = ", isEmpty(appUser));
	
	const {onUpdateAppUser} = React.useContext(AppContext).actions;
	
	const currentRouteName = getFocusedRouteNameFromRoute(useRoute());
	const isDrawerOpen = useDrawerStatus() === 'open';
	
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
				(<TouchableOpacity onPress={()=>props.navigation.navigate(appLoginScreenName, {email: '', password: '', toRoute: ''})}>
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
	            		<Ionicons name="enter-outline" size={22} />
			        	<Text> LogIn</Text>
			        </View>
				 </TouchableOpacity>
				):
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
			    onPress=
			    {
					()=>
					{
						console.log("current route name: ", currentRouteName);
						switch(currentRouteName)
						{
							case chattingHomeName: navigation.navigate(appHome);
											   break;
							default: break;
						}
						signOut(auth).then
						(
							()=>
							{		
								if (isDrawerOpen) navigation.closeDrawer();//navigation.openDrawer()
							}
						)
						.catch
						(
							(e)=>console.log("[ERROR]: ", e)
						);
					}
				}
		      >
		      	<View style={{flexDirection: 'row', alignItems: 'center'}}>
            		<Ionicons name="exit-outline" size={22} />
		        	<Text>Log Out</Text>
		        </View>
		      </TouchableOpacity>
		  }
	    </View>
	  );
};
export default function HomeRoot({navigation})
{
	const {appUser} = React.useContext(AppContext).state;
	
	const getHeaderTitle  = (route) =>
	{
		const routeName = getFocusedRouteNameFromRoute(route)?? appHome;
		
		//console.log("routeName: ", routeName);
		
		switch(routeName)
		{
			case appHome: return 'Home';
			case appLoginScreenName: return 'Login';
			case appRegisterScreenName: return 'SignUp';
			case appForgotPasswordScreenName: return 'Restore Password';
			default: return 'Unknown';
		}
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
								e.preventDefault();
					         	navigation.navigate(appHome);
					        }
					        else if(e.target?.includes(chattingHomeName) && isEmpty(appUser))
					        {
								e.preventDefault();
								navigation.navigate(appLoginScreenName, {email: '', password: '', toRoute: chattingHomeName});
							}
					        //console.log(e.target);
					     } 
				     } 
				}
      			screenOptions=
            	{
					({route, navigation})=>
					(
						{	swipeEnabled: false,					
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
								   drawerLabel: 'Home',
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
	    <Drawer.Screen name={chattingHomeName} 
	    			   component={ChattingHomeScreen}
	    			   options=
        			   {
						   ({navigation}) =>
						   ({
							   title: 'Group Chatting',
							   drawerLabel: 'Chatting',
							   drawerIcon: ({focused, size}) => 
							   (
						              <Ionicons
						                 name="md-home"
						                 size={size}
						                 color={focused ? '#7cc' : '#ccc'}
						              />
							   )
						   })
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