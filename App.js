import MainContainer from './src/navigation/mainContainer';
import { AppProvider } from './src/contexts/appProvider';
import {ChatGptProvider} from './src/chatGpt'
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() 
{
	

  return (
    <AppProvider>   
      <SafeAreaProvider>
            <PaperProvider>
                <ChatGptProvider>
                    <MainContainer />
                </ChatGptProvider>
            </PaperProvider>
        </SafeAreaProvider>
    </AppProvider>
  );
}

