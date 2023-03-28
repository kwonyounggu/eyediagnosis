import * as React from "react";
import { View, Text } from "react-native";

import { getDBConnection, createChatGptUserTable } from "../../database/db-service";

export default function QueryHistoryScreen({navigation})
{
	const loadDataCallback = React.useCallback
	(
		async () => 
		{
		    try 
		    {
		      const db = await getDBConnection();
		      await createChatGptUserTable(db); 
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
    		loadDataCallback(); console.log("here in useEffect")
  		}, [loadDataCallback]
  	);
    return (
        <View styles={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text onPress={()=>navigation.navigate('Home')}
                  style={{fontSize: 26, fontWeight: 'bold'}}>
                    Settings Screen
            </Text>
        </View>
    );
}
