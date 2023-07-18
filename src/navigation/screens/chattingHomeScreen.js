import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatPDFViewer from '../../components/inChatPDFViewer';
import { chattingName, pdfFileViewerScreenName } from '../../constants';
import ChattingScreen from "./chattingScreen";
const Stack = createNativeStackNavigator();

export default function ChattingHomeScreen({navigation})
{
    return (
        <Stack.Navigator initialRouteName={chattingName} screenOptions={{headerShown: false}}>
        	<Stack.Screen name={chattingName} component={ChattingScreen}  />
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