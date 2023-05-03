import * as React from 'react';
import { View, Text } from 'react-native';
import {FAB, Portal} from 'react-native-paper';
import { AppContext } from '../../contexts/appProvider';

//import { getDBConnection, createChatGptUserTable } from "../../database/db-service";

export default function ForumScreen({navigation})
{
	console.log("INFO in ForumScreen: ", React.useContext(AppContext));
	const [open, setOpen] = React.useState(false);
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
            <Portal>
          <FAB.Group
            open={open}
            icon={open ? 'calendar-today' : 'plus'}
            actions={[
              { icon: 'plus', onPress: () => {} },
              { icon: 'star', label: 'Star', onPress: () => {} },
              { icon: 'email', label: 'Email', onPress: () => {} },
              { icon: 'bell', label: 'Remind', onPress: () => {} },
            ]}
            onStateChange={({open}) => setOpen(true)}
            onPress={() => {
              if (open) {
                // do something if the speed dial is open
              }
            }}
            visible={true}
          />
        </Portal>
        </View>
    );
}
