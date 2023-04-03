import * as React from 'react';
import {View, Text} from 'react-native';

export default function DisplayDetailedQueryDataScreen({route, navigation})
{
	console.log("detailed data: ", route.params);
	return(
		<View>
			<Text>detailed data</Text>
		</View>	
	);
}