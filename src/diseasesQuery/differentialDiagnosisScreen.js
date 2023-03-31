import * as React from 'react';
//import {useCallback, useEffect, useRef, useState} from "react";
//import {useChatGpt} from "react-native-chatgpt";
import { useChatGpt } from '../chatGpt';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {ActivityIndicator, IconButton, Colors, Button, Snackbar, Tooltip} from 'react-native-paper';

import ChatGptUser from '../database/models/chatGptUser';
import ChatGptQuery from '../database/models/chatGptQuery';
//import { AppConsumer } from '../commonComponents/appProvider';
//import storage from '../commonComponents/storage';


const DifferentialDiagnosisScreen = ({route, navigation}) =>
{
    //console.log("DifferentialDiagnosisScreen: ", appCtx);
    const [queryResult, setQueryResult] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [queryDone, setQueryDone] = React.useState(true);
    const {flush, sendMessage} = useChatGpt();
    
    const messageId = React.useRef('');
    const conversationId = React.useRef('');

    //const [contextData, setContextData] = React.useState();

    const save = () =>
    {
        //console.log("save, data: ", data);
        //stop all screen change while doing this
        console.log("saving ..., disable button");
        setSaving(true);

        //const {nextChatGptUserQueryId} = appCtx.state;
        //const {onUpdateChatGptUserQueryIds, onIncreaseLastChatGptUserQueryId} = appCtx.actions;
        
        //console.log("nextChatGptUserId: ", appCtx.state.nextChatGptUserQueryId);
        //1. save with a key=chatGptUser, id=nextChatGptUserQueryId
        //2. put currentId into appCtx.actions.onUpdateChatGptUserQueryIds(nextChatGptUserQueryId)
        //3. increase nextChatGptUserQueryId by appCtx.cations.onIncreaseLastChatGptUserQueryId(nextChatGptUserQueryId)
        //flush;
        //...
        //setSaving(false);
        console.log("saving is done. enable button")
    }
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
                                    setQueryDone(true);
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

    React.useEffect
    (
        () =>
        {
            // Use `setOptions` to update the button that we previously specified
            // Now the button includes an `onPress` handler to update 
            navigation.setOptions
            (
                {
                    headerRight: () => <IconButton 
                                            icon='archive' 
                                            color='#000' 
                                            size={30} 
                                            AccessibilityLabel='Save'
                                            disabled={!queryDone}
                                            onPress={flush}
                                        />
                }
            );
        },
        [navigation]
    );
    return (
        <View style={{flex: 1}}>
            <ScrollView>
                <View style={styles.queryStringConatainer}><Text>{route.params.queryStringDisplayable}</Text></View>
                {
                    loading ? <ActivityIndicator size='large' /> :
                              <View style={styles.queryResultContainer}><Text>{queryResult}</Text></View> 
                }
            </ScrollView>
            <Snackbar 
                    visible={!!errorMessage}
                    onDismiss={()=>setErrorMessage('')}
                    duration={4000}
                    style={{backgroundColor: 'red'}}
            >
                {errorMessage}
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
        }
    }
  );

export default DifferentialDiagnosisScreen;