import React from 'react';
import { useChatGpt } from 'react-native-chatgpt';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Login from './login';
//import Chat from './chat';
import DiagnosisScreen from './diagnosisScreen';

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

export default function DiseasesQueryHome()
{
    
    //status: 'initializing' | 'logged-out' | 'getting_auth_token' | 'authenticated';
    const {status, flush, login} = useChatGpt();
    console.log("useChatGpt() in DiseasesQueryHome, status: ", status, ", flush: ", flush, ", login: ", login);
    
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
    //return <Chat />;
    
    return <DiagnosisScreen />
}
