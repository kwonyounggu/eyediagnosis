import * as React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatPDFViewer from '../../components/inChatPDFViewer';
import { chattingName, pdfFileViewerScreenName } from '../../constants';
import ChattingScreen from "./chattingScreen";
import { Menu, IconButton, Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer, createNavigationContainerRef} from '@react-navigation/native';

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

export default function ChattingHomeScreen({route, navigation})
{
	const [popupVisible, setPopupVisible] = React.useState(false);
	
	React.useEffect
	(
		() =>
		
			navigation.setOptions
	        (
				{
					headerRight: () =>
					(
			                <Menu visible={popupVisible} 
		                	  	  contentStyle={styles.popupMenu}
		                	      onDismiss={()=>setPopupVisible(false)}
	                    		  anchor=
	                    		  {
									  <IconButton style={{margin: 0, padding: 0}} 
									  			  icon='dots-vertical' color='#000' size={30} 
									  			  onPress={()=>setPopupVisible(true)}
									  />
								  }
	                    	>
	                    		  <Menu.Item leadingIcon='camera' title='Camera'  />
	                    		  <Menu.Item leadingIcon='image' 
	                    		  			 title='Photos' 
	                    		  			 onPress=
	                    		  			 {
												   ()=>
												   {
													   navigationRef.current?.getCurrentRoute().params.handleMedia(ImagePicker.MediaTypeOptions.Images);
													   console.log("route.params: ", navigationRef.current?.getCurrentRoute());
												   }
											 }
	                    		  />
	                    		  <Menu.Item leadingIcon='video' 
	                    		  			 title='Video' 
	                    		  			 
	                    		  />
	                    		  <Divider />
	                    		  <Menu.Item leadingIcon='file' title='Pdf' />
	                    		  <Menu.Item leadingIcon='database-sync-outline' 
	                    		  			 title='List Data' 
	                    		  			    
								/>
	                    	</Menu>
		                )
		        }
		    ), []
		 
	)
    return (
	 <NavigationContainer ref={navigationRef} independent={true}>
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
      </NavigationContainer>
    );
}

const styles = StyleSheet.create
(
    {
        popupMenu: 
		{
		    borderTopLeftRadius: 10,
		    borderRadius: 20,
		    
		    borderWidth: 5,
		    backgroundColor: 'red'
		}
    }
);