
import MainContainer from './src/navigation/mainContainer';
import { AppProvider } from './src/commonComponents/appProvider';

export default function App() 
{
  return (
    <AppProvider>
      <MainContainer />
    </AppProvider>
  );
}

