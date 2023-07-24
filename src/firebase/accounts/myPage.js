import * as React from 'react';
import { View, Text } from 'react-native';
import { AppContext } from '../../contexts/appProvider';

export default function MyPage ({route, navigation})
{
	const {appUser} = React.useContext(AppContext).state;
	console.log("[INFO] in MyPage: user", appUser);
	return (
		<View>
			<Text>Name: {appUser.displayName}</Text>
			<Text>Email: {appUser.email}</Text>
			<Text>Photo URL : {appUser.photoURL}</Text>
			<Text>Profession: </Text>
		</View>	
	);
}