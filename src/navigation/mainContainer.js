import * as React from 'react';
import { AppState } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Button} from 'react-native-paper';

//Screens
import DiseaseQueryScreen from './screens/diseaseQueryScreen';
import EyeWikiScreen from './screens/eyeWikiScreen';
import PharmacyScreen from './screens/pharmacyScreen';
import HomeRoot from './screens/homeRoot';
import { AppContext } from '../contexts/appProvider';
import {isEmpty} from 'lodash';
import { useChatGpt } from '../chatGpt';
import {homeRootName, homeName, diseasesName, pharmacyName, settingsName, chattingName, eyeWikiName, forumName, EYE_WIKI_HOME, appHome} from '../constants'


const Tab = createBottomTabNavigator();

function ToEyeWikiHome()
{
	const navigation = useNavigation();
	return (
				<Button icon='home' 
						onPress={()=>navigation.navigate(eyeWikiName, {url: EYE_WIKI_HOME})}
						style={{margin: 4}}
						contentStyle={{flexDirection: 'row-reverse'}}
				>
						{eyeWikiName}
				</Button>
	);
}

//See https://stackoverflow.com/questions/68900300/react-navigation-opening-a-modal-from-the-tab-bar
export default function MainContainer()
{
	const appState = React.useRef(AppState.currentState);
	//const {chatGptUser} = React.useContext(AppContext).state;
	//const {onUpdateChatGptUser} = React.useContext(AppContext).actions;
	const {flush} = useChatGpt();
	React.useEffect
	(
		() => 
		{
    		const subscription = AppState.addEventListener
    		(
				'change', 
				nextAppState => 
				{
				      //if (appState.current.match(/inactive|background/) && nextAppState === 'active') 
				      // console.log('App has come to the foreground!');
				      
					  //if (nextAppState !== 'active' && !isEmpty(chatGptUser)) 
					  if (nextAppState !== 'active')
					  {
						  flush();
						  //onUpdateChatGptUser({});
						  //console.log("It will be in background mode ...");
					  }
				      appState.current = nextAppState;
				      console.log('AppState', appState.current);
				      //console.log(">>> ChatGptUser: ", isEmpty(chatGptUser), chatGptUser);
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
                		    initialParams={{url: EYE_WIKI_HOME}} 
                		    component={EyeWikiScreen} 
                		    options=
                		    {
								(navigation, route) =>
								(
									{
										headerTitle: (props) =>(<ToEyeWikiHome />)
										
									}
								)
							}
                />
                <Tab.Screen name={pharmacyName} component={PharmacyScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}