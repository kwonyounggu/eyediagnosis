import * as React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { homeName, chattingName, settingsName, forumName } from '../../constants';
import HomeScreen from './homeScreen';
import ForumScreen from './forumScreen';
import ChattingScreen from './chattingScreen';
import SettingsScreen from './settingsScreen';

const Stack = createNativeStackNavigator();

export default function HomeRoot({navigation})
{
    return (
        <Stack.Navigator>
	      <Stack.Screen name={homeName} component={HomeScreen}/>
	      <Stack.Screen name={forumName} component={ForumScreen} />
	      <Stack.Screen name={chattingName} component={ChattingScreen} />
	      <Stack.Screen name={settingsName} component={SettingsScreen} />
    	</Stack.Navigator>
    );
}