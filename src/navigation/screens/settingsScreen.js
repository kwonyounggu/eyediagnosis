import * as React from "react";
import { TouchableOpacity } from "react-native";
import { List, Divider, Checkbox, Avatar, Switch, Button } from 'react-native-paper';

import chatGptUserTable from '../../database/sqlite/chatGptUser';
import chatGptQueryTable from '../../database/sqlite/chatGptQuery';
import chatGptImageTable from '../../database/sqlite/chatGptImages';

//https://expo.canny.io/feature-requests/p/add-close-and-deletedatabase-methods-for-expo-sqlite
import db from '../../database/sqlite/SQLiteDatabase';

export default function SettingsScreen({navigation})
{
	const dropTables = React.useCallback
	(
		async () =>
		{
			//don't drop table but remove all the records because it can be problematic
			//otherwise after dropping the tables, app needs to be reloaded.
			
			
			
			chatGptUserTable.dropTable().then(info=>console.log("INFO: chatGptUserTable is dropped", info))
										.catch(e=>console.log(e));
			chatGptQueryTable.dropTable().then(info=>console.log("INFO: chatGptQueryTable is dropped", info))
										.catch(e=>console.log(e));
			chatGptImageTable.dropTable().then(info=>console.log("INFO: chatGptImageTable is dropped", info))
										.catch(e=>console.log(e));
			
			//db._db.close();//delete database
			
			/*
			
			//for testing to see records from both tables
			chatGptUserTable.getAll()
						    .then((r) => console.log(r))
						    .catch((e) => console.error(e));
			chatGptQueryTable.getAll()
						    .then((r) => console.log(r))
						    .catch((e) => console.error(e));
			chatGptQueryTable.getNumberOfRows()
						    .then((r) => console.log(r))
						    .catch((e) => console.error(e));
						    */
			
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