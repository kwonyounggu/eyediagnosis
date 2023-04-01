import * as React from "react";
import { TouchableOpacity } from "react-native";
import { List, Divider, Checkbox, Avatar, Switch, Button } from 'react-native-paper';

import chatGptUserTable from '../../database/sqlite/chatGptUser';
//import ChatGptQuery from '../../database/models/chatGptQuery';

export default function SettingsScreen({navigation})
{
	const dropTables = React.useCallback
	(
		async () =>
		{
			//don't drop table but remove all the records because it can be problematic
			//otherwise after dropping the tables, app needs to be reloaded.
			//chatGptUserTable.dropTable().then(info=>console.log("INFO: chatGptUserTable is dropped", info))
			//							.catch(e=>console.log(e));
			
			
			//await ChatGptUser.dropTable();		
			//await ChatGptQuery.dropTable();
			
		}, []	
	);
    return (
        <List.Section>
        	<TouchableOpacity onPress={dropTables}>
	        	<List.Item title='Clear ChatGPT Data'
	        			   description='Erase whole database and restart' 
	        			   left={(props) => <List.Icon {...props} icon="database-outline" />}
	        	/>
        	</TouchableOpacity>
        	<Divider />
        	<List.Item title='Other actions'
        			   description='Erase whole database and restart' 
        			   left={(props) => <List.Icon {...props} icon="account-outline" />}
        	/>
        </List.Section>
        );
}