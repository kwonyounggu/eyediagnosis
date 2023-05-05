import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Button} from 'react-native-paper';

//Screens
import DiseaseQueryScreen from './screens/diseaseQueryScreen';
import EyeWikiScreen from './screens/eyeWikiScreen';
import PharmacyScreen from './screens/pharmacyScreen';
import HomeRoot from './screens/homeRoot';

import {homeRootName, homeName, diseasesName, pharmacyName, settingsName, chattingName, eyeWikiName, forumName, EYE_WIKI_HOME} from '../constants'


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