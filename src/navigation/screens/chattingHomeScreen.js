import * as React from 'react';
import { Text } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatPDFViewer from '../../components/inChatPDFViewer';
import { chattingName, pdfFileViewerScreenName } from '../../constants';
import ChattingScreen from "./chattingScreen";
const Stack = createNativeStackNavigator();

export default function ChattingHomeScreen({navigation})
{
	React.useEffect
	(
		() =>
		{
			navigation.setOptions
	        (
				{
					headerRight: () => <Text>H</Text>
		        }
		    )
		 },[]
	)
    return (
        <Stack.Navigator 
        	initialRouteName={chattingName} 
        	screenOptions=
        	{
				{
					headerShown: false,
					headerTitleStyle: 
			        {
			            fontWeight: 'normal'
			        },
			        headerBackVisible: false
					
				}
			}
        >
        	<Stack.Screen 
        		name={chattingName} 
        		component={ChattingScreen} 
        		options=
        		{
					{
						headerRight: ()=> <Text>H</Text>
					}
				} 
        	/>
        	<Stack.Screen 
        		name={pdfFileViewerScreenName} 
        		component={ChatPDFViewer} 
        		options=
        		{
					{
						title: 'PDF Viewer',
						headerShown: true
						
					}
				}
        	/>
        </Stack.Navigator>
    );
}