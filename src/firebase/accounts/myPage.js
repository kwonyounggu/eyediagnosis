import * as React from 'react';
import { View, Text, FlatList } from 'react-native';
import { AppContext } from '../../contexts/appProvider';
import {List, ListItem} from 'react-native-elements'

export default function MyPage ({route, navigation})
{
	const {appUser} = React.useContext(AppContext).state;
	//console.log("[INFO] in MyPage: user", appUser);
	
	const data = 
	[
		{
			id: 1,
			title: 'Name',
			value: appUser.displayName
		},
		{
			id: 2,
			title: 'Email',
			value: appUser.email
		},
		{
			id: 3,
			title: 'Photo URL',
			value: appUser.photoURL
		},
		{
			id: 4,
			title: 'Profession',
			value: 'Optometrist'
		},
		{
			id: 5,
			title: 'Province/State',
			value: 'Ontario'
		},
		{
			id: 6,
			title: 'Country',
			value: 'Canada'
		}	
	];
	return (
			<FlatList
				data={data}
				renderItem=
				{
					({item}) =>
					(
						<ListItem>
							<ListItem.Content>
								<ListItem.Title>{item.title}</ListItem.Title>
								<ListItem.Subtitle>{item.value}</ListItem.Subtitle>
							</ListItem.Content>
						</ListItem>
					)
				}
				keyExtractor={item=>item.id}
				ItemSeparatorComponent={()=><View style={{height: 1, width: '100%'}} />}
			/>	
	);
}