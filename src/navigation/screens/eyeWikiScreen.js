import * as React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import { AppContext } from '../../contexts/appProvider';
import {WebView} from 'react-native-webview';

//import { getDBConnection, createChatGptUserTable } from "../../database/db-service";

export default function EyeWikiScreen({route, navigation})
{
	//console.log("INFO in EyeWikiScreen: ", React.useContext(AppContext));
	console.log("INFO in eyeWikiScreen.js, url: ", route.params);

	const [url, setUrl] = React.useState(route.params.url);
	const [searchWords, setSearchWords] = React.useState(route.params.url);
	const [loading, setLoading] = React.useState(true);
	//const [injectNow, setInjectNow] = React.useState(false);
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
  	const webViewRef = React.useRef(null);
  	
  	
  	React.useEffect
  	(
		() =>
		{
			console.log("[INFO]: url = ", url);
			console.log("[INFO]: searchWords = ", searchWords);	
			if (searchWords) handleLoadEnd();	
		}, [url, searchWords]
	);

	const javascript = 
    `console.log('injectJavaScript');
    document.getElementById('searchInput').value = ${searchWords};
    true;`;
    
    
    const handleLoadEnd = React.useCallback
    (
		() => 
		{
	        console.log("handleLoadEnd..");
	        if (searchWords && url.toLowerCase().endsWith('eyewiki.aao.org')) 
			{
				console.log("[INFO]: it's time for put a word in search input with [", searchWords, "]");
				webViewRef?.current.injectJavaScript(javascript);
			}
    	},[]
    )
  	//See https://stackoverflow.com/questions/45256826/react-native-webview-loading-indicator
    return (
        	<View style={{flex: 1}}>
            	<WebView 
            		ref={webViewRef}
            		javaScriptEnabled={true}
            		source={{uri: url}} 
            		onLoad={()=>setLoading(false)} 
					onLoadEnd={handleLoadEnd}
            		onMessage={(e)=>{console.log(e)}}
            		setSupportMultipleWindows={false}
            	/>
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

