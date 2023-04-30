import * as React from 'react';
import { View, Text } from 'react-native';
import { AppContext } from '../../contexts/appProvider';
import {WebView} from 'react-native-webview';

//import { getDBConnection, createChatGptUserTable } from "../../database/db-service";

export default function EyeWikiScreen({route, navigation})
{
	//console.log("INFO in EyeWikiScreen: ", React.useContext(AppContext));
	console.log("INFO in eyeWikiScreen.js, url: ", route.params);
	const {url} = route.params;
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
    return (
        
            <WebView source={{uri: url}} />
        
    );
}
