import * as React from 'react';

//import { useChatGpt } from 'react-native-chatgpt';
import { useChatGpt } from '../chatGpt';
import { View, StyleSheet, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import 
{ 
    IconButton, 
    Button, 
    RadioButton,
    List, 
    Menu,
    HelperText, 
    Text, 
    TextInput,
    Divider
} from 'react-native-paper'; 

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import DifferentialDiagnosisScreen from './differentialDiagnosisScreen';
import ListDataScreen from './listDataScreen';
import DisplayDetailedQueryDataScreen from './displayDetailedQueryDataScreen';

import {AppContext} from '../contexts/appProvider';
import chatGptUserTable from '../database/sqlite/chatGptUser';

import * as SecureStore from 'expo-secure-store';

import jwt_decode from 'jwt-decode';
import { useHeaderHeight } from '@react-navigation/elements';

/**
 * https://stackoverflow.com/questions/47475818/react-native-textinput-multiline-is-not-being-pushed-up-by-keyboard
 * https://blog.logrocket.com/keyboardawarescrollview-keyboardavoidingview-react-native/
 */

import { diagnosisName, differentialDiagnosisName, listSavedDataName, displayDetailedQueryDataName } from '../constants';

const TOKEN_ACCESS_KEY = 'react_native_chatgpt_access_token';
const TOKEN_EMAIL_PROPERTY = "https://api.openai.com/profile";

async function getTokenFromDisk() 
{
  return SecureStore.getItemAsync(TOKEN_ACCESS_KEY);
}

function createQueryString (params, messageId, conversationId) 
{
    console.log("params in createQueryString: ", params);
    
    let queryString = 
        "Say you are an eye doctor. What differential diagnosis would you make if a " + params.age + " year " + params.gender +" patient " +
        "shows up with symptoms of " + params.symptoms.join(", ");
    if (params.medicalHistory.length > 0)
        queryString += ", signs of " + params.signs.join(", ") +
                       ", and medical history of " + params.medicalHistory.join(", ") + "?";
    else
        queryString += ", and signs of " + params.signs.join(", ") + "?"; 

    let queryStringDisplayable = queryString;

    //queryString += " In addition, please summarize each disease according to eyewiki.aao.org and" +
    //               " include its direct href link address at the bottom of the whole page separately altogether."

    return {queryString, queryStringDisplayable, patient: params, messageId, conversationId};
}

const EyeDiagnosisInputScreen = ({navigation}) =>
{
    //const {flush, login} = useChatGpt();
    
    //The following function is to update user information globally
    const {onUpdateChatGptUser} = React.useContext(AppContext).actions;
    
    const [age, setAge] = React.useState('');
    const [gender, setGender] = React.useState('female');
    const [signs, setSigns] = React.useState('');
    const [symptoms, setSymptoms] = React.useState('');
    const [medicalHistory, setMedicalHistory] = React.useState('');

    const [isValid, setIsValid] = React.useState(true);
    
    //https://stackoverflow.com/questions/48420468/keyboardavoidingview-not-working-properly
    const headerHeight = useHeaderHeight();
    
    const messageId = React.useRef('');
    const conversationId = React.useRef('');
    
    React.useEffect
    (
		() => 
	    {
		    (
				async () => 
				{
			      const accessToken = await getTokenFromDisk();
			      let decodedToken = jwt_decode(accessToken.replace('Bearer ',''));

			      //console.log(decodedToken[TOKEN_EMAIL_PROPERTY].email);
			      
			      const user =
			      {
					  email: decodedToken[TOKEN_EMAIL_PROPERTY].email,
					  iat: decodedToken.iat,
					  exp: decodedToken.exp,
					  id: undefined
				  };
				  
				  
				  
				  chatGptUserTable.findByEmail(user.email)
				  				  .then
				  				  (
										(record)=>
										{
											console.log("INFO: findByEmail("+user.email+"),  ", record);
											if (Object.keys(record).length === 0) //not registered
											{
												chatGptUserTable.insert(user).then ((id)=>user.id = id).catch(e=>console.error(e));
											}
											else if (!(user.iat === record.iat && user.exp === record.exp))//Update only iat and exp
											{
												chatGptUserTable.update(user).then ((i)=>user.id = record.id).catch(e=>console.error(e));
											}
											else user.id = record.id;
										}
								  )
				  				  .catch(e=>console.error(e))
				  				  .finally
				  				  (
										() =>
										{
											console.log("Login User: ", user);
										    //State change globally
										    onUpdateChatGptUser(user);
										}
								  );
				  
			     
		    	}
		    )();
	  	}, []
	 );

    const resetInputs = () =>
    {
        setAge('');
        setGender('female');
        setMedicalHistory('');
        setSigns('');
        setSymptoms(''); 
    }
    
    const handleSubmit = () =>
    {
       /* console.log("age: ", age);
        console.log("gender: ", gender);
        console.log("signs: ", signs);
        console.log("symptoms: ", symptoms);
        console.log("medical history: ", medicalHistory);
*/
      
        let signsArray = signs.split("\n").filter(e=>e); //always use split('\n') and filter(e=>e) for remove (empty, 0, undefined, etc) array element
        let symptomsArray = symptoms.split("\n").filter(e=>e);
        let medicalHistoryArray = medicalHistory.split("\n").filter(e=>e);

        //remove leading spaces on each line
        signsArray.forEach((element, i) => signsArray[i] = element.replace(/^\s+|\s+$/g, ''));
        symptomsArray.forEach((element, i) => symptomsArray[i] = element.replace(/^\s+|\s+$/g, ''));
        medicalHistoryArray.forEach((element, i) => medicalHistoryArray[i] = element.replace(/^\s+|\s+$/g, ''));

        //remove empty array element
        signsArray = signsArray.filter((e)=>e.length>0);
        symptomsArray = symptomsArray.filter((e)=>e.length>0);
        medicalHistoryArray = medicalHistoryArray.filter((e)=>e.length>0);

        /*
        signsArray.forEach((e) => console.log(e));
        symptomsArray.forEach((e) => console.log(e));
        medicalHistoryArray.forEach((e) => console.log(e));
        */

        if (!(age.length>0 && signsArray.length>0 && symptomsArray.length>0))
        {
            setIsValid(false);
            return;
        }
        else if (!isValid) setIsValid(true);
        
        
        navigation.navigate
        (
            differentialDiagnosisName, 
            createQueryString
            (
                {
                    age: parseInt(age), 
                    gender: gender, 
                    signs: signsArray, 
                    symptoms: symptomsArray, 
                    medicalHistory: medicalHistoryArray
                },
                messageId,
                conversationId
            )
        );
    }
    
    /**
	 * <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : (headerHeight+47)} 
        					  style={{flex: 1}} 
        					  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        					  enabled>
	 */
    return (	
		<KeyboardAwareScrollView>
			<View style={{flexDirection: 'column', marginLeft: 20, marginRight: 20}}>
                <List.Section>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{flex: 1, borderWidth: 0, fontSize: 14, fontWeight: 'bold', paddingLeft: 10, paddingTop: 15}}>Age (*)</Text>
                        <TextInput 
                            style={{flex: 3, marginLeft: 10, marginRight: 10}} 
                            mode='outlined'
                            placeholder='How old ?'
                            value={age}
                            onChangeText={(value)=>setAge(value.replace(/[^0-9]/g, ''))}
                            maxLength={2}
                        />
                    </View>
                </List.Section>
                <List.Section>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{flex: 1, borderWidth: 0, fontSize: 14, fontWeight: 'bold', paddingLeft: 10, paddingTop: 15}}>Gender (*)</Text>
                        <View style={{flex: 3, flexDirection: 'row'}}>
                            <RadioButton.Group onValueChange={(newValue)=>setGender(newValue)} value={gender}>
                                <View style={{flexDirection: 'row', borderWidth: 0}}>
                                    <RadioButton.Item label='Female' value='female' />
                                    <RadioButton.Item label='Male' value='male' />
                                </View>
                            </RadioButton.Group>
                        </View>
                    </View>
                </List.Section>
                <List.Section>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{borderWidth: 0, fontSize: 14, fontWeight: 'bold', paddingLeft: 10, paddingTop: 0}}>Medical History</Text>
                        <TextInput 
                            style={{margin: 8}}
                            mode='outlined'
                            placeholder="Type each line by line"
                            multiline
                            maxLength={512}
                            value={medicalHistory}
                            onChangeText={(value)=>setMedicalHistory(value.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, ''))}
                        />
                    </View>
                </List.Section>
                <List.Section>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{borderWidth: 0, fontSize: 14, fontWeight: 'bold', paddingLeft: 10, paddingTop: 0}}>Symptoms (*)</Text>
                        <TextInput 
                            style={{margin: 8}}
                            mode='outlined'
                            placeholder="Type each symptom line by line"
                            multiline
                            maxLength={512}
                            value={symptoms}
                            onChangeText={(value)=>setSymptoms(value.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, ''))}
                        />
                    </View>
                </List.Section>
                <List.Section>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{borderWidth: 0, fontSize: 14, fontWeight: 'bold', paddingLeft: 10, paddingTop: 0}}>Signs (*)</Text>
                        <TextInput 
                            style={{margin: 8}}
                            mode='outlined'
                            placeholder="Type each sign line by line"
                            multiline
                            maxLength={512}
                            value={signs}
                            onChangeText={(value)=>setSigns(value.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, ''))}
                        />
                    </View>
                </List.Section>
                <List.Section>
                {
                    isValid ?  
                    <HelperText style={{paddingLeft: 10}} type='info' padding='none' visible={true}>Info (*): fields are required</HelperText> :
                    <HelperText style={{paddingLeft: 10}} type='error' padding='none' visible={true}>Error (*): Age, Signs and Symptoms are required</HelperText>
                }
                </List.Section>
                <List.Section style={{flexDirection: 'row', marginTop: 0, justifyContent: 'space-between'}}>
                    <Button style={{width: 130, marginRight: 10}}  mode='outlined' onPress={resetInputs}>
                        Reset
                    </Button>
                    <Button style={{width: 130}} loading={false} mode='contained' onPress={handleSubmit}>
                        Submit
                    </Button>
                </List.Section>
            </View>
		</KeyboardAwareScrollView>     
    );
}

const Stack = createNativeStackNavigator();

/****** 
 * Adding a button to the header
 * https://reactnavigation.org/docs/header-buttons/#:~:text=You%20can%20set%20buttons%20in,headerBackTitle%20%2C%20headerBackTitleStyle%20%2C%20and%20headerBackImageSource%20.
 * https://github.com/callstack/react-native-paper/issues/3466
 */
const DiagnosisScreen = (props) =>
{
    //console.log("DiagnosisScreen, props: ", props);
    const {flush} = useChatGpt();
    const [popupVisible, setPopupVisible] = React.useState(false);
    
    return (
        
            <Stack.Navigator initialRouteName={diagnosisName}
            	screenOptions=
            	{
					({route})=>
					(
						{
							headerStyle: 
							{
					            backgroundColor: '#4e5180'
					        },
							headerTintColor: '#fff',
					        headerTitleStyle: 
					        {
					            fontWeight: 'bold'
					        }
						}
					)
				}
            >
              
                <Stack.Screen 
                	name={diagnosisName} 
                	component={EyeDiagnosisInputScreen} 
                	options=
                    {
						({navigation}) =>
						(
	                        {
	                            headerRight: ()=> <IconButton style={{margin: 0, padding: 0}} icon='database-sync-outline' iconColor={'#ffffff'} size={30} onPress={() => navigation.navigate(listSavedDataName)}/>	                            	
	                        }
                        )
                    }
                />
                <Stack.Screen name={differentialDiagnosisName} > 
                    {
						//https://aboutreact.com/react-native-image-icon-inside-navigation-bar/#:~:text=js-,%2F%2F%203%20Ways%20to%20Add%20Image%20Icon%20Inside%20Navigation%20Bar,navigation%7D)%20%3D%3E%20%7B%20React.
                        (props) => <DifferentialDiagnosisScreen {...props} />
                    }
                </Stack.Screen>                 
                <Stack.Screen 
                    name={listSavedDataName} 
                    options=
                    {
                        {
                            headerRight: ()=>{}
                        }
                    }
                    > 
                    {
                        (props) => <ListDataScreen {...props} />
                    }
                </Stack.Screen>  
                <Stack.Screen name={displayDetailedQueryDataName} component={DisplayDetailedQueryDataScreen} />              
            </Stack.Navigator>

    );
};

const styles = StyleSheet.create
(
    {
        viewRow:
        {
            flexDirection: 'row',
            padding: 0
        },
        ageView:
        {
            flexDirection: 'row',
            padding: 20
        },
        ageText: 
        {
            flex: 0.3,
            borderWidth: 1
        },
        ageTextInput:
        {
            flex: 0.7,
            height: 35,
            margin: 0,
            borderWidth: 1,
            padding: 10
        },
        popupMenu: 
		{
		    borderTopLeftRadius: 10,
		    borderRadius: 20,
		    
		    borderWidth: 2,
		    borderColor: 'white',
		    backgroundColor: '#f4511e'
		}
    }
);

export default DiagnosisScreen;