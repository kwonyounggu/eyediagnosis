import * as React from 'react';
import { View, Text } from 'react-native';
import { AppContext } from '../../contexts/appProvider';

//import { getDBConnection, createChatGptUserTable } from "../../database/db-service";

export default function ForumScreen({navigation})
{
	console.log("INFO in ForumScreen: ", React.useContext(AppContext));
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
        <View styles={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text onPress={()=>navigation.navigate('Home')}
                  style={{fontSize: 26, fontWeight: 'bold'}}>
                    Forum Screen
            </Text>
        </View>
    );
}
