import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Text, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-paper';

//Screens
import HomeScreen from './screens/homeScreen';
import DiseaseQueryScreen from './screens/diseaseQueryScreen';
import SettingsScreen from './screens/settingsScreen';
import ChattingScreen from './screens/chattingScreen';
import ForumScreen from './screens/forumScreen';
import EyeWikiScreen from './screens/eyeWikiScreen';

//Screen names
/*
const homeName = 'Home';
const diseasesName = 'Diagnosis';
const settingsName = 'Settings';
const chattingName = 'ChatGPT';
*/

import {homeName, diseasesName, settingsName, chattingName, eyeWikiName, forumName, EYE_WIKI_HOME} from '../constants'

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

                                if (rn === homeName) iconName = focused ? 'home' : 'home-outline';
                                else if (rn === diseasesName) iconName = focused ? 'list' : 'list-outline';
                                else if (rn === eyeWikiName) iconName = focused ? 'nuclear' : 'nuclear-outline';
                                else if (rn === forumName) iconName = focused ? 'nuclear' : 'nuclear-outline';
                                else if (rn === chattingName) iconName = focused ? 'nuclear' : 'nuclear-outline';
                                else if (rn === settingsName) iconName = focused ? 'settings' : 'settings-outline';

                                return <Ionicons name={iconName} size={size} color={color} />
                            },
                            headerShown: route.name !== diseasesName
                        }
                    )
                }
                
            >
                <Tab.Screen name={homeName} component={HomeScreen} />
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
                <Tab.Screen name={forumName} component={ForumScreen} />
                <Tab.Screen name={chattingName} component={ChattingScreen} />
                <Tab.Screen name={settingsName} component={SettingsScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}