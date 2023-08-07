import * as React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import { AppContext } from '../../contexts/appProvider';
import {WebView} from 'react-native-webview';
import { EYE_WIKI_HOME } from '../../constants';
import { useFocusEffect } from '@react-navigation/native';

//import { getDBConnection, createChatGptUserTable } from "../../database/db-service";

export default function EyeWikiScreen({route, navigation})
{
	//console.log("INFO in eyeWikiScreen.js, route.params: ", route.params);

	const { searchWords } = route.params;
	const [loading, setLoading] = React.useState(true);
	const [isLoaded, setIsLoaded] = React.useState(false);
		
  	const webViewRef = React.useRef(null);
	
	const javascript = 
    `console.log('injectJavaScript');
    document.getElementById('searchInput').value = \"${searchWords}\";
    true;`;
    
    //console.log("[INFO]: isLoaded: ", isLoaded, " searchWords: ", searchWords);
    //console.log("[INFO]: javascript=", javascript);
    
  	React.useEffect
  	(
		() =>
		{
			//console.log("[INFO]: isLoaded = ", isLoaded);
			//console.log("[INFO]: searchWords: ", searchWords);
			if (searchWords && isLoaded)
			{
				webViewRef?.current.injectJavaScript(javascript);
			}	
		}, [isLoaded, searchWords]
	);

  	//See https://stackoverflow.com/questions/45256826/react-native-webview-loading-indicator
    return (
        	<View style={{flex: 1}}>
            	<WebView 
            		ref={webViewRef}
            		javaScriptEnabled={true}
            		source={{uri: EYE_WIKI_HOME}} 
            		onLoad={() => setLoading(false)} 
					onLoadEnd={() => setIsLoaded(true)}
            		onMessage={(e)=>{console.log(e)}}
            		
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

