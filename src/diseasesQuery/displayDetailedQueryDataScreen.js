import * as React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import { ABC } from '../common/utils';

export default function DisplayDetailedQueryDataScreen({route, navigation})
{
	//console.log("detailed data: ", route.params);
	const {age, gender, medicalHistory, symptoms, signs, chatGptResponse, queryDate} = route.params;
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
					<Paragraph>{ABC.toAscii(chatGptResponse)}</Paragraph>	
				</Card.Content>
			</Card>
		</ScrollView>
		);
}