import * as React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../../firebase/accounts/login';
import Register from '../../firebase/accounts/register';
import ForgotPassword from '../../firebase/accounts/forgotPassword';
import MyPage from '../../firebase/accounts/myPage';
import { appHome, appLoginScreenName, appRegisterScreenName, appForgotPasswordScreenName, myPageScreenName } from '../../constants';

import {Configuration, OpenAIApi} from 'openai';
import { GPTAI_API_KEY, OPENAI_ORGANIZATION_ID, OPENAI_API_URL } from '@env';
import axios from 'axios';

const Stack = createNativeStackNavigator();

const FinalHome = ({navigation}) =>
{
	const [msg, setMsg] = React.useState();
	const [data, setData] = React.useState([]);
	const [textInput, setTextInput] = React.useState('');

	
	const handleSend = async () =>
	{
		const prompt = textInput;
		const response = await axios.post
		(
			`${OPENAI_API_URL}`,
			{
				prompt: prompt,
			    max_tokens: 1024,
				temperature: 0.5
			},
			{
				headers: 
				{
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${GPTAI_API_KEY}`
				}
			}
		);
		
		const text = response.data.choices[0].text;
		setData([...data, {type: 'user', 'text': textInput}, {type: 'bot', 'text': text}]);
		setTextInput('');
	}
	
	
	React.useEffect
	(
		()=>
		{
			console.log("key: ", GPTAI_API_KEY);
			console.log("oid: ", OPENAI_ORGANIZATION_ID);
			const configuration = new Configuration
			(
				{
				    apiKey: `${GPTAI_API_KEY}`
				}
			);
			const openai = new OpenAIApi(configuration);
			/*openai.retrieveModel("text-davinci-003").then
			(
				(response)=>console.log("from openai: ", response)
			)
			.catch
			(
				
				(e)=>
				{
					console.error(e);
					setMsg("error: ", e);
				}
			)*/
			
			openai.createChatCompletion
			(
				{
					model: "gpt-3.5-turbo",
	  				messages: 
	  				[
						  { role: "system", "content": "You are an eye doctor."}, 
						  { role: "user", content: "I am 61 years old male and have diabeties and va 20/30"}
					],
				}
			)
			.then
			(
				(response) => console.log(">>>", response.data.choices[0].message)
			)
			.catch
			(
				(e)=>console.error(e)
			)
		},[]
	);
	
	return (
		<View style={styles.container}>
			<Text style={styles.title}>AI ChatBot</Text>
			<FlatList
				data={data}
				keyExtractor={(item, index) => index.toString()}
				style={styles.body}
				renderItem=
				{
					(item) =>
					(
						<View style={{flexDirection: 'row', padding: 10}}>
							<Text style=
								  {
									  {
										  fontWeight: 'bold',
										  color: item.type === 'user' ? 'green' : 'red'
									  }
								  }
							>
							{
								item.type === 'user' ? 'Niza' : 'Bot'
							}
							</Text>
							<Text style={styles.bot}>{item.text}</Text>
						</View>
					)
				}
			/>
			<TextInput
				style={styles.input}
				value={textInput}
				onChangeText={(text) => setTextInput(text)}
				placeholder='Ask me anything'
			/>
			<TouchableOpacity
				style={styles.buttonSend}
				onPress={handleSend}
			>
				<Text style={styles.buttonText}>Let's go</Text>
			</TouchableOpacity>
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
			alignItems: 'center'
		},
		title:
		{
			fontSize: 28,
			fontWeight: 'bold',
			marginBottom: 20,
			marginTop: 70
		},
		body:
		{
			backgroundColor: '#fffcc9',
			width: '100%',
			margin: 10
		},
		bot:
		{
			fontSize: 16
		},
		input:
		{
			
		},
		buttonText:
		{
			
		},
		buttonSend:
		{
			
		}
	}
)