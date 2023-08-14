import * as React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../../firebase/accounts/login';
import Register from '../../firebase/accounts/register';
import ForgotPassword from '../../firebase/accounts/forgotPassword';
import MyPage from '../../firebase/accounts/myPage';
import { appHome, appLoginScreenName, appRegisterScreenName, appForgotPasswordScreenName, myPageScreenName } from '../../constants';

import {Configuration, OpenAIApi} from 'openai';
import { GPTAI_API_KEY, OPENAI_ORGANIZATION_ID, OPENAI_API_URL } from '@env';
//import axios from 'axios';

const Stack = createNativeStackNavigator();

const configuration = new Configuration
(
	{
	    apiKey: `${GPTAI_API_KEY}`
	}
);
const openai = new OpenAIApi(configuration);
			
const FinalHome = ({navigation}) =>
{
	const [msg, setMsg] = React.useState();
	const [data, setData] = React.useState([]);
	const [textInput, setTextInput] = React.useState('');
	const [querying, setQuerying] = React.useState(false);

	
	const handleSend = () =>
	{
		if (textInput.length === 0) return;

		setQuerying(true);
		let text = 'default';
		openai.createChatCompletion
			(
				{
					model: "gpt-3.5-turbo",
	  				messages: 
	  				[
						  { role: "system", "content": "You are an eye doctor."}, 
						  { role: "user", content: `${textInput}`}
					],
				}
			)
			.then
			(
				(response) => 
				{
					console.log(">>>", response.data.choices[0].message.content);
					text = response.data.choices[0].message.content;
					//throw 'testing error';
					
				}
			)
			.catch
			(
				(e)=>
				{
					console.error(e);
					text = e;					
				}
					
			)
			.finally
			(
				() =>
				{
					setData([...data, {'type': 'user', 'text': `${textInput}`}, {'type': 'bot', 'text': text}]);
					setTextInput('');
					setQuerying(false);
				}
			)
	}
	
	return (
		<View style={styles.container}>
			<Text style={styles.title}>I am an AI Eye Doctor</Text>
			<FlatList
				data={data}
				keyExtractor={(item, index) => index.toString()}
				style={styles.body}
				renderItem=
				{
					({item}) =>
					{   //console.log("item: ", item);
						return <View style={{flexDirection: 'column'}}>
							<Text style=
								  {
									  {
										  fontWeight: 'bold',
										  color: (item['type'] === 'user') ? 'green' : 'red'
									  }
								  }
							>
							{
								(item.type === 'user') ? 'User: ' : 'Bot: '
							}
							</Text>
							<Text style={styles.bot}>{item.text}</Text>
						</View>
					}
				}
			/>
			<TextInput
				style={styles.input}
				value={textInput}
				onChangeText={(text) => setTextInput(text)}
				placeholder='Ask me only a question a day'
				returnKeyType='next'
			/>
			<TouchableOpacity
				style={styles.buttonSend}
				onPress={handleSend}
			>
				<Text style={styles.buttonText}>Press me</Text>
			</TouchableOpacity>
			{
				querying && <View style={styles.querying}>
                            <ActivityIndicator size='large' />
                        </View>
			}
		</View>	
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

const styles = StyleSheet.create
(
	{
		container:
		{
			flex: 1,
			backgroundColor: '#fffcc9',
			alignItems: 'center',
			padding: 10		
		},
		title:
		{
			fontSize: 28,
			fontWeight: 'bold',
			marginBottom: 20,
			marginTop: 40
		},
		body:
		{
			backgroundColor: '#fffcc9',
			margin: 0
		},
		bot:
		{
			fontSize: 16,
			paddingBottom: 10
		},
		input:
		{
			borderWidth: 1,
			padding : 10,
			marginBottom: 5
		},
		buttonText:
		{
			padding: 10
		},
		buttonSend:
		{
			marginBottom: 15,
			backgroundColor: 'orange'
		},
		querying:
        {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center'
        },
	}
)