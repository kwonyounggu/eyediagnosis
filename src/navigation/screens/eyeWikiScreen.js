import * as React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import { AppContext } from '../../contexts/appProvider';
import {WebView} from 'react-native-webview';

//import { getDBConnection, createChatGptUserTable } from "../../database/db-service";

export default function EyeWikiScreen({route, navigation})
{
	//console.log("INFO in EyeWikiScreen: ", React.useContext(AppContext));
	console.log("INFO in eyeWikiScreen.js, url: ", route.params);
	const {url} = route.params;
	const [loading, setLoading] = React.useState(true);
	/*const loadDataCallback = React.useCallback
	(
		async () => 
		{
		    try 
		    {
				console.log("INFO: inside loadDataCallback");
		      const db = await getDBConnection();
		      //await createChatGptUserTable(db); 
		    } 
		    catch (error) 
		    {
		      console.error(error);
		    }
		}, []
	);
	
	React.useEffect
	(
		() => 
		{
    		loadDataCallback(); console.log("here in useEffect");
  		}, [loadDataCallback]
  	);*/
  	

  	//See https://stackoverflow.com/questions/45256826/react-native-webview-loading-indicator
    return (
        	<View style={{flex: 1}}>
            	<WebView source={{uri: url}} onLoad={()=>setLoading(false)} />
            	{
					loading && 
					<ActivityIndicator style={styles.loading} size="large" />
				}
            </View>
        
    );
}

const styles = StyleSheet.create
(
    {
        loading: 
        {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center'
        }
    }
);

