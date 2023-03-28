import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'

//Screens
import HomeScreen from './screens/homeScreen';
import DiseaseQueryScreen from './screens/diseaseQueryScreen';
import SettingsScreen from './screens/settingsScreen';
import QueryHistoryScreen from './screens/queryHistoryScreen';

//Screen names
const homeName = 'Home';
const diseasesName = 'Diagnosis';
const settingsName = 'Settings';
const queryHistoryName = 'Restore';

const Tab = createBottomTabNavigator();

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
                                else if (rn === queryHistoryName) iconName = focused ? 'list' : 'list-outline';
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
                <Tab.Screen name={queryHistoryName} component={QueryHistoryScreen} />
                <Tab.Screen name={settingsName} component={SettingsScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}


/*
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
                                else if (rn === settingsName) iconName = focused ? 'settings' : 'settings-outline';

                                return <Ionicons name={iconName} size={size} color={color} />
                            }
                        }
                    )
                }
            >
                <Tab.Screen name={homeName} component={HomeScreen} />
                <Tab.Screen name={diseasesName} component={DiseaseQueryScreen} />
                <Tab.Screen name={settingsName} component={SettingsScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}
*/