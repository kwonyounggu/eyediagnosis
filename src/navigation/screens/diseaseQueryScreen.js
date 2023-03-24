import * as React from 'react';

import { ChatGptProvider } from 'react-native-chatgpt';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DiseasesQueryHome from '../../diseasesQuery/diseasesQueryHome';


export default function DiseaseQueryScreen({navigation})
{
    return (
        <SafeAreaProvider>
            <PaperProvider>
                <ChatGptProvider>
                    <DiseasesQueryHome />
                </ChatGptProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}

/* ************* March 13 2023 */
//Note that ERROR  Invariant Violation: Tried to register two views with the same name RNCSafeAreaProvider, js engine: hermes
//this ERROR comes from when you do not use import {Components ...} from 'brabra'
//In this case, comment in the line of import or remove the line.
