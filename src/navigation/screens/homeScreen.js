import * as React from 'react';
import { View, Text } from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../../firebase/accounts/login';
import Register from '../../firebase/accounts/register';
import ForgotPassword from '../../firebase/accounts/forgotPassword';
import { appLoginScreenName, appRegisterScreenName, appForgotPasswordScreenName } from '../../constants';

const Stack = createNativeStackNavigator();

const FinalHome = ({navigation}) =>
{
	return (
		<View><Text>Final Home</Text></View>	
	);
}
export default function HomeScreen({navigation})
{
    return (
        <Stack.Navigator initialRouteName='finalHome' screenOptions={{headerShown: false}}>
        	<Stack.Screen name='finalHome' component={FinalHome} />
        	<Stack.Screen name={appLoginScreenName} component={Login} />
        	<Stack.Screen name={appRegisterScreenName} component={Register} />
        	<Stack.Screen name={appForgotPasswordScreenName} component={ForgotPassword} />
        </Stack.Navigator>
    );
}