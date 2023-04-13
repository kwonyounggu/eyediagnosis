
/* ************* March 13 2023 */
//Note that ERROR  Invariant Violation: Tried to register two views with the same name RNCSafeAreaProvider, js engine: hermes
//this ERROR comes from when you do not use import {Components ...} from 'brabra'
//In this case, comment in the line of import or remove the line.

import React from 'react';
//import { useChatGpt } from 'react-native-chatgpt';
import { useChatGpt } from '../../chatGpt';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Login from '../../common/login';
//import Chat from './chat';
import DiagnosisScreen from '../../diseasesQuery/diagnosisScreen';

//import ChatGptUser from '../../database/models/chatGptUser';
//import ChatGptQuery from '../../database/models/chatGptQuery';

const styles = StyleSheet.create
(
    {
        container: 
        {
            flex: 1
        },

        loaderContainer:
        {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }
);

export default function DiseaseQueryScreen({navigation})
{
    
    //status: 'initializing' | 'logged-out' | 'getting_auth_token' | 'authenticated';
    const {status, flush, login} = useChatGpt();
    //console.log("useChatGpt() in DiseasesQueryHome, status: ", status, ", flush: ", flush, ", login: ", login);
    
    if (status === 'initializing') return null;
    if (status === 'logged-out' || status === 'getting_auth_token')
    {
        return (
            <View style={styles.container}>
                <Login />
                {
                    status === 'getting_auth_token' &&
                    (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size='large' color='white' />
                        </View>
                    )
                }
            </View>
        );
    }
    
    //authenticated 
    return <DiagnosisScreen />
}
