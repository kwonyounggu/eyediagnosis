import * as React from 'react';
import { AppState, View, Text } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

//import {Button} from 'react-native-paper';

//Screens
import DiseaseQueryScreen from './screens/diseaseQueryScreen';
import EyeWikiScreen from './screens/eyeWikiScreen';
import PharmacyScreen from './screens/pharmacyScreen';
import HomeRoot from './screens/homeRoot';
import { AppContext } from '../contexts/appProvider';
import _ from 'lodash';
import { useChatGpt } from '../chatGpt';
import * as SecureStore from 'expo-secure-store';
import {homeRootName, homeName, diseasesName, pharmacyName, eyeWikiName, EYE_WIKI_HOME, appHome} from '../constants';
//import { enableLayoutAnimations } from 'react-native-reanimated';


const Tab = createBottomTabNavigator();

const SESSION_TIME_KEY = 'app_session_time_access_key';
const ONE_HOUR_MS = 3600000; 
//const ONE_HOUR_MS = 60000; 
async function persistToken(value) 
{
  return SecureStore.setItemAsync(SESSION_TIME_KEY, value);
}

async function getTokenFromDisk() 
{
  return SecureStore.getItemAsync(SESSION_TIME_KEY);
}

function EyeWikiHome()
{
	return (
				<View>
					<Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>	{eyeWikiName} </Text>
				</View>
	);
}

//-- http://eyerounds.org/atlas/index.htm
function EyeRoundsHome()
{
	const navigation = useNavigation();
	return (
				<View>
					<Text style={{color: 'white', fontSize: 18, fontWeight: 'normal'}}>	EyeRounds &gt; </Text>
				</View>
	);
}
//See https://stackoverflow.com/questions/68900300/react-navigation-opening-a-modal-from-the-tab-bar
export default function MainContainer()
{
	const appState = React.useRef(AppState.currentState);
	//const {chatGptUser} = React.useContext(AppContext).state;
	//const {onUpdateChatGptUser} = React.useContext(AppContext).actions;
	const {flush} = useChatGpt();
	
	//Check if session, 1 hour in inactive/background mode, is expired.
	//This way chatGpt data query will be more stabliized
	const sessionTimeout = async () =>
	{
		const sessionTime = await getTokenFromDisk();
		console.log("what is sesstionTime: ", sessionTime);
		
		  if (sessionTime && (_.now() - Number(sessionTime)) > ONE_HOUR_MS) 
		  {
			  flush();
			  console.log("[INFO] session timed out");
		  }
	}
	
	React.useEffect
	(
		() => 
		{
			console.log("system start ............");
			sessionTimeout();
    		const subscription = AppState.addEventListener
    		(
				'change', 
				async (nextAppState) => 
				{
					  /*
				      if (appState.current.match(/inactive|background/) && nextAppState === 'active') 
				      {
						  console.log('App has come to the foreground!');
					  }
				      */
					  if (nextAppState === 'active') sessionTimeout(); 
					  else //whenever this app is in background mode, store the current time
					   	   await persistToken(_.now().toString());
					  
				      appState.current = nextAppState;
				      console.log('AppState', appState.current);
				}
			);

    		return () => {subscription.remove()};
  		}, []
  	);
  	
    return (
        <NavigationContainer>
            <Tab.Navigator 
                initialRouteName={homeName}
                screenOptions=
                {
                    ({route}) =>
                    (
                        {
                            tabBarIcon: ({focused, color, size}) =>
                            {
                                let iconName;
                                let rn = route.name;

                                if (rn === homeRootName) iconName = focused ? 'home' : 'home-outline';
                                else if (rn === diseasesName) iconName = focused ? 'list' : 'list-outline';
                                else if (rn === eyeWikiName) iconName = focused ? 'nuclear' : 'nuclear-outline';
                                else if (rn === pharmacyName) iconName = focused ? 'nuclear' : 'nuclear-outline';

                                return <Ionicons name={iconName} size={size} color={color} />
                            },
                            headerShown: route.name !== diseasesName,
                            headerStyle: 
										{
								            backgroundColor: '#4e5180'
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
                <Tab.Screen name={homeRootName} 
                			component={HomeRoot} 
                			options=
                		    {
								(navigation, route) =>
								(
									{
										headerLeft: ()=>{},
										headerShown: false
									}
								)
							}
							listeners=
							{
								({navigation, route}) =>
								(
									{
										tabPress: (e) =>
										{
											//Used to route directly to Home where authentification page is open
											e.preventDefault();
											navigation.navigate(appHome);
										}
									}
								)
							}
                />
                <Tab.Screen name={diseasesName} component={DiseaseQueryScreen} />
                <Tab.Screen name={eyeWikiName} 
                		    initialParams={{url: EYE_WIKI_HOME, searchWords:''}} 
                		    component={EyeWikiScreen} 
                		    options=
                		    {
								(navigation, route) =>
								(
									{
										headerTitle: (_) => (<EyeWikiHome />),
										
										headerRight: (_) => (<EyeRoundsHome />)
									}
								)
							}
                />
                <Tab.Screen name={pharmacyName} component={PharmacyScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}