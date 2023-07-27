import * as React from 'react';
import { View, Text } from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../../firebase/accounts/login';
import Register from '../../firebase/accounts/register';
import ForgotPassword from '../../firebase/accounts/forgotPassword';
import MyPage from '../../firebase/accounts/myPage';
import { appHome, appLoginScreenName, appRegisterScreenName, appForgotPasswordScreenName, myPageScreenName } from '../../constants';

import {Configuration, OpenAIApi} from 'openai';
import { OPENAI_API_KEY, OPENAI_ORGANIZATION_ID } from '@env';
const Stack = createNativeStackNavigator();

const FinalHome = ({navigation}) =>
{
	const [msg, setMsg] = React.useState();
	
	React.useEffect
	(
		()=>
		{
			const configuration = new Configuration
			(
				{
				    organization: `${OPENAI_ORGANIZATION_ID}`,
				    apiKey: `${OPENAI_API_KEY}`
				}
			);
			const openai = new OpenAIApi(configuration);
			openai.listEngines().then
			(
				(response)=>setMsg(response)
			)
			.catch
			(
				
				(e)=>
				{
					console.error(e);
					setMsg("error: ", e);
				}
			)
		},[]
	);

	return (
		<View><Text>Final Home{msg}</Text></View>	
	);
}
export default function HomeScreen({navigation})
{
    return (
        <Stack.Navigator initialRouteName={appHome} screenOptions={{headerShown: false}}>
        	<Stack.Screen name={appHome} component={FinalHome}  />
        	<Stack.Screen 
	        	name={appLoginScreenName} 
	        	component={Login}
	        />
        	<Stack.Screen name={appRegisterScreenName} component={Register} />
        	<Stack.Screen name={appForgotPasswordScreenName} component={ForgotPassword} />
        	<Stack.Screen name={myPageScreenName} component={MyPage} />
        </Stack.Navigator>
    );
}