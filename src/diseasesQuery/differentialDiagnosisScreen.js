import * as React from 'react';

import {useChatGpt} from '../chatGpt';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {ActivityIndicator, IconButton, Snackbar, FAB} from 'react-native-paper';
import Autolink from 'react-native-autolink'

import { ABC } from '../common/utils';
import {clone} from 'lodash';

import {AppContext} from '../contexts/appProvider';

import chatGptQueryTable from '../database/sqlite/chatGptQuery';
import {eyeWikiName} from '../constants';

//import { queryData } from '../common/testData';

const DifferentialDiagnosisScreen = ({route, navigation}) =>
{
    const {chatGptUser} = React.useContext(AppContext).state;
    
    //const [queryResult, setQueryResult] = React.useState(queryData);
    const [queryResult, setQueryResult] = React.useState('');
    
    const [errorMessage, setErrorMessage] = React.useState('');
    
    //const [loading, setLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    
    const [saving, setSaving] = React.useState(false);
    const [onSave, setOnSave] = React.useState(false);

    const [savedMessage, setSavedMessage] = React.useState('');
    //const [queryDone, setQueryDone] = React.useState(false);
    const {sendMessage} = useChatGpt();
    
    const messageId = React.useRef('');
    const conversationId = React.useRef('');
    

	React.useEffect
	(
	    () =>
	    {
			if (!onSave) { console.log("INFO: onSave is false!"); return;}
	        setSaving(true);
	        const {age, gender, medicalHistory, symptoms, signs} = route.params.patient;
	        
	        /**
			 * 	var date = new Date("Sun May 11,2014");
				var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
	                    .toISOString()
	                    .split("T")[0];
			 */
	
	        const diagnosisResult = ABC.toBinary(clone(queryResult.trim()));
	        console.log("diagnosisResult.length: ", diagnosisResult.length);
	        const patientData =
			{
				age: age,
				gender: gender.charAt(0).toUpperCase(),
				medicalHistory: medicalHistory.toString(),
				symptoms: symptoms.toString(),
				signs: signs.toString(),
				chatGptResponse: diagnosisResult,
				queryDate: new Date().toISOString().split('T')[0]
			}
			
			if (patientData.chatGptResponse.length > 0)
				chatGptQueryTable.insert(patientData, chatGptUser.email)
								 .then(o=>setSavedMessage('It is saved.'))
								 .catch(e=>console.error(e))
								 .finally(()=>setSaving(false));
			else 
			{
				console.error ("Diagnosis data is missing");
				setSaving(false);
			}
	    },
	    [onSave]
	 );
    
    React.useEffect
    (
        () =>
        {
                sendMessage
                (
                    {
                        message: route.params.queryString,
                        options: messageId.current && conversationId.current ?
                                     {
                                        messageId: messageId.current,
                                        conversationId: conversationId.current
                                     } 
                                     :
                                     undefined,
                        onAccumulatedResponse:
                            (accumulatedResponse) =>
                            {
                                messageId.current = accumulatedResponse.messageId;
                                conversationId.current = accumulatedResponse.conversationId;

                                //console.log("messageId: ", messageId.current);
                                //console.log("conversationId.current: ", conversationId.current);

                                if (accumulatedResponse.isDone) 
                                {
                                    //remove leading white spaces
                                    setQueryResult(accumulatedResponse.message.replace(/^\s+/g, ''));
                                    //setQueryDone(true);
                                }
                                else
                                {
                                    if (loading) setLoading(false);
                                    setQueryResult(accumulatedResponse.message);
                                }

                            },
                        onError:
                                (e) =>
                                {
                                   console.log(`Error from Chat GPT: ${e.statusCode} ${e.message}`);
                                   if (loading) setLoading(false);
                                   setErrorMessage(`${e.statusCode} ${e.message}`);   
                                }
                    }
                ); //sendMessage()
        },
        [] //empty array, the function is only executed once when this component first mounts.
    ); //useEffect
    
    React.useLayoutEffect
    (
        () =>
        {
            // Use `setOptions` to update the button that we previously specified
            // Now the button includes an `onPress` handler to update 
            navigation.setOptions
            (
                {
                    headerRight: () => !onSave && <IconButton 
                                            icon='archive' 
                                            color='#000' 
                                            size={25} 
                                            disabled={false}
                                            onPress={()=>setOnSave(true)}
                                        />
                }
            );
        },
        [onSave]
    );
    

    return (
        <View style={{flex: 1}}>
            <ScrollView>
                {/*<View style={styles.queryStringConatainer}><Text>{route.params.queryStringDisplayable}</Text></View>*/}
                {
                    loading ? <ActivityIndicator size='large' /> :
                              <View style={styles.queryResultContainer}>
                              	<Autolink text={queryResult} 
							  		      component={Text} 
							  		      onPress=
							  		      {
											  (url, match) =>
											  {
												 //console.log("url: ", url);
												 //console.log("match: ", match); 
												 //navigation.navigate(eyeWikiName, "https://eyewiki.aao.org/Age-Related_Macular_De");
												 navigation.navigate(eyeWikiName, {url});
											  }
										  }
							  />
                              </View> 
                }
            </ScrollView>
            <Snackbar 
                    visible={!!errorMessage}
                    onDismiss={()=> setErrorMessage('')}
                    duration={4000}
                    style={{backgroundColor: 'red'}}
            >
            {
				errorMessage
			}    
            </Snackbar> 
            <Snackbar 
                    visible={savedMessage.length > 0}
                    onDismiss={()=> setSavedMessage('')}
                    duration={4000}
                    style={{backgroundColor: 'black'}}
            >
            {
				savedMessage
			}    
            </Snackbar> 
            {
                saving &&   <View style={styles.saving}>
                                <ActivityIndicator size='large' />
                            </View>
            }  
        </View>
    );
};

const styles = StyleSheet.create
  (
    {
        queryStringConatainer: {margin: 10, padding: 10, borderRadius: 9, borderWidth: 1},
        queryResultContainer: {margin: 10, marginTop: 12, padding: 10, borderRadius: 9, borderWidth: 1},
        saving: 
        {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center'
        },
        
        fab: 
        {  
			borderRadius: 25,
		    position: 'absolute',
		    margin: 0,
		    right: 0,
		    bottom: 0
		}
    }
  );

export default DifferentialDiagnosisScreen;