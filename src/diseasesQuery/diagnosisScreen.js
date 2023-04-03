import * as React from 'react';

//import { useChatGpt } from 'react-native-chatgpt';
import { useChatGpt } from '../chatGpt';
import { View, ScrollView, StyleSheet } from 'react-native';
import 
{ 
    IconButton, 
    Button, 
    RadioButton,
    List, 
    Menu,
    HelperText, 
    Text, 
    TextInput
} from 'react-native-paper'; 

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import DifferentialDiagnosisScreen from './differentialDiagnosisScreen';
import ListDataScreen from './listDataScreen';
import DisplayDetailedQueryDataScreen from './displayDetailedQueryDataScreen';

import {AppContext} from '../contexts/appProvider';
import chatGptUserTable from '../database/sqlite/chatGptUser';

import * as SecureStore from 'expo-secure-store';

import jwt_decode from 'jwt-decode';

//Screen names
const diagnosisName = 'Eye Diagnosis';
const differentialDiagnosisName = 'Differential Diagnosis';
const listSavedDataName = 'List of Saved Data';
export const displayDetailedQueryDataName = 'Detailed Data';

const TOKEN_ACCESS_KEY = 'react_native_chatgpt_access_token';
const TOKEN_EMAIL_PROPERTY = "https://api.openai.com/profile";

async function getTokenFromDisk() 
{
  return SecureStore.getItemAsync(TOKEN_ACCESS_KEY);
}

function createQueryString (params) 
{
    console.log("params in createQueryString: ", params);
    
    let queryString = 
        "What differential diagnosis would you make if a " + params.age + " year " + params.gender +" patient " +
        "shows up with symptoms of " + params.symptoms.join(", ");
    if (params.medicalHistory.length > 0)
        queryString += ", signs of " + params.signs.join(", ") +
                       ", and medical history of " + params.medicalHistory.join(", ") + "?";
    else
        queryString += ", and signs of " + params.signs.join(", ") + "?"; 

    let queryStringDisplayable = queryString;

    queryString += " In addition, please summarize each disease according to eyewiki.aao.org and" +
                   " include its direct href link address at the bottom of the whole page separately altogether."

    return {queryString, queryStringDisplayable, patient: params};
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
					  exp: decodedToken.exp
				  };
				  
				  //console.log("Login User: ", user);
				  
				  chatGptUserTable.findByEmail(user.email)
				  				  .then
				  				  (
										(record)=>
										{
											//console.log("INFO: findByEmail("+user.email+"),  ", record);
											if (Object.keys(record).length === 0) //new user insertion
											{
												chatGptUserTable.insert(user).then ((i)=>console.log(i)).catch(e=>console.error(e));
											}
											else if (!(user.iat === record.iat && user.exp === record.exp))//Update only iat and exp
											{
												chatGptUserTable.update(user).then ((i)=>console.log(i)).catch(e=>console.error(e));
											}
										}
								  )
				  				  .catch(e=>console.error(e));
			      //State change globally
			      onUpdateChatGptUser(user);
			     
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
                }
            )
        );
    }

    return (
        <ScrollView>
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
        </ScrollView>
    );
}

const Stack = createNativeStackNavigator();

/****** 
 * Adding a button to the header
 * https://reactnavigation.org/docs/header-buttons/#:~:text=You%20can%20set%20buttons%20in,headerBackTitle%20%2C%20headerBackTitleStyle%20%2C%20and%20headerBackImageSource%20.
 */
const DiagnosisScreen = (props) =>
{
    //console.log("DiagnosisScreen, props: ", props);
    const {flush} = useChatGpt();
    const [popupVisible, setPopupVisible] = React.useState(false);
    return (
        
            <Stack.Navigator initialRouteName={diagnosisName}>
              <Stack.Group>
                <Stack.Screen 
                	name={diagnosisName} 
                	component={EyeDiagnosisInputScreen} 
                	options=
                    {
						({navigation}) =>
						(
	                        {
	                            headerRight: ()=>
	                            	<Menu visible={popupVisible}
	                            		  onDismiss={()=>setPopupVisible(false)}
	                            		  anchor={<IconButton style={{margin: 0, padding: 0}} icon='dots-vertical' color='#000' size={30} onPress={()=>setPopupVisible(true)}/>}
	                            	>
	                            		  <Menu.Item leadingIcon='logout' title='Log out' onPress={flush} />
	                            		  <Menu.Item leadingIcon='database-sync-outline' 
	                            		  			 title='List Data' 
	                            		  			 onPress=
	                            		  			 {
														   () =>
														   {
															   setPopupVisible(false); 
															   return navigation.navigate(listSavedDataName);
														   }
													 } 
										/>
	                            	</Menu>
	                            		           
	                        }
                        )
                    }
                />
                <Stack.Screen 
                    name={differentialDiagnosisName} 
                    options=
                    {
                        {
                            headerRight: ()=><IconButton icon='archive' color='#000' size={30}/>
                        }
                    }
                    > 
                    {
                        (props) => <DifferentialDiagnosisScreen {...props} />
                    }
                </Stack.Screen> 
              </Stack.Group>
              <Stack.Group>  
                <Stack.Screen 
                    name={listSavedDataName} 
                    options=
                    {
                        {
                            headerRight: ()=><IconButton icon='quora' color='#000' size={30}/>
                        }
                    }
                    > 
                    {
                        (props) => <ListDataScreen {...props} />
                    }
                </Stack.Screen>  
               </Stack.Group>
               <Stack.Group screenOptions={{presentation: 'modal'}}>
                <Stack.Screen name={displayDetailedQueryDataName} component={DisplayDetailedQueryDataScreen} /> 
               </Stack.Group>
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
        }
    }
);

export default DiagnosisScreen;