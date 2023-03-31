import * as React from "react";
import { TouchableOpacity } from "react-native";
import { List, Divider, Checkbox, Avatar, Switch, Button } from 'react-native-paper';

import ChatGptUser from '../../database/models/chatGptUser';
import ChatGptQuery from '../../database/models/chatGptQuery';

export default function SettingsScreen({navigation})
{
	const dropTables = React.useCallback
	(
		async () =>
		{
			await ChatGptUser.dropTable();		
			await ChatGptQuery.dropTable();
			
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