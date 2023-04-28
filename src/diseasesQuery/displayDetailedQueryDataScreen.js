import * as React from 'react';
import {Text, ScrollView} from 'react-native';
import {ActivityIndicator, Card, Paragraph, IconButton} from 'react-native-paper';
import { ABC } from '../common/utils';
import chatGptQueryTable from '../database/sqlite/chatGptQuery';
import {listSavedDataName} from '../constants';
import Autolink from 'react-native-autolink'

export default function DisplayDetailedQueryDataScreen({route, navigation})
{
	//console.log("detailed data: ", route.params);
	const {id, age, gender, medicalHistory, symptoms, signs} = route.params;
	const [chatGptResponse, setChatGptResponse] = React.useState('');
	const [queryDate, setQueryDate] = React.useState('');
	const [loading, setLoading] = React.useState(true);
	
	//https://flaviocopes.com/javascript-iife/
	React.useEffect
	(
	    () =>
	    {
			(
				async () =>
				{
					if (loading) chatGptQueryTable.getChatGptResponseById(id)
										 .then
										 (	(o)=>
										 	{
												 setChatGptResponse(o.chatGptResponse);
												 setQueryDate(o.queryDate);
											}
										 )
										 .catch(e=>console.error(e))
										 .finally(()=>setLoading(false));
				}
			)();
	    },
	    []
	 );
	 
	const deleteItem = () =>
	{
		setLoading(true);//while deleting database table row
		chatGptQueryTable.deleteById(id)
						 .then
						 (
							(rowsAffected) =>
							{
								console.log("INFO: the number of rows deleted is ", rowsAffected);
								navigation.navigate(listSavedDataName, {deleteId: id});
							} 
						 )
	}
	React.useLayoutEffect
    (
        () =>
        {
            // Use `setOptions` to update the button that we previously specified
            // Now the button includes an `onPress` handler to update 
            navigation.setOptions
            (
                {
                    headerRight: () => <IconButton 
                                            icon='delete' 
                                            color='#000' 
                                            size={25} 
                                            disabled={false}
                                            onPress={deleteItem}
                                        />
                }
            );
        },
        [navigation]
    );
    
	//console.log("diagnosis: \n", chatGptResponse);
	return(
		<ScrollView style={{padding: 10}}>
			<Card mode='outlined'>
				<Card.Title title="Patient Information"/>
				<Card.Content>
					<Text style={{borderWidth: 0, fontSize: 14, fontWeight: 'bold'}}>Age :
						<Text style={{fontWeight: 'normal'}}>&nbsp;{age}</Text>
					</Text>
					<Text style={{fontSize: 14, fontWeight: 'bold'}}>Gender :
						<Text style={{fontWeight: 'normal'}}>&nbsp;{gender.toUpperCase() === 'M'? 'Male' : 'Female'}</Text>
					</Text>
					<Text style={{fontSize: 14, fontWeight: 'bold'}}>
						MedicalHistory:
					</Text>
					<Paragraph>{medicalHistory}</Paragraph>
					<Text style={{fontSize: 14, fontWeight: 'bold'}}>
						Symptoms:
					</Text>
					<Paragraph>{symptoms}</Paragraph>
					<Text style={{fontSize: 14, fontWeight: 'bold'}}>
						Signs:
					</Text>
					<Paragraph>{signs}</Paragraph>	
				</Card.Content>
			</Card>
			<Card mode='outlined' style={{marginTop: 10}}>
				<Card.Title title="Diagnosis"/>
				<Card.Content>
				{
					loading ? <ActivityIndicator size='large' /> :
							  <Autolink text={ABC.toAscii(chatGptResponse)} component={Paragraph} />
					
				}
				</Card.Content>
			</Card>
		</ScrollView>
		);
}