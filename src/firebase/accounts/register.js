import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import 
{ 
    Button, 
    List, 
    HelperText, 
    Text,
    TextInput,
    Checkbox
} from 'react-native-paper'; 
//import * as SecureStore from 'expo-secure-store';

import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

import { PROFESSIONS, COUNTRIES, CANADA_PROVINCES, USA_STATES } from '../../common/utils';
import Anchor from './anchor';

/**
 * https://stackoverflow.com/questions/40404567/how-to-send-verification-email-with-firebase
 * Steps:
 * 1. User can use createUserWithEmailAndPassword method.
 * 2. send verification email
 * 3. Login and check if the email is verified or not
 * 4. log out if the email is not verified.
 * 5. Else login state and store the user object in secure place
 * 
 * Ref: https://stackoverflow.com/questions/66096926/sendemailverification-vs-sendsigninlinktoemail-for-email-verification-using-fire
 */
const Register = ({navigation}) =>
{
	const [name, setName] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState('');
    const headerHeight = useHeaderHeight();
    
    const [openProfession, setOpenProfession] = useState(false);
    const [profession, setProfession] = useState('optometrist');
    const [professionItems, setProfessionItems] = useState(PROFESSIONS);
    
    const [openCountry, setOpenCountry] = useState(false);
    const [country, setCountry] = useState('CA');
    const [countryItems, setCountryItems] = useState(COUNTRIES);
    
    const [openProvince, setOpenProvince] = useState(false);
    const [province, setProvince] = useState('ON');
    const [provinceItems, setProvinceItems] = useState(CANADA_PROVINCES);
    
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [passwordIcon, setPasswordIcon] = useState('eye-off');
    
    const [isValid, setIsValid] = useState(true);
    const [checkedTerms, setCheckedTerms] = useState(Platform.OS === 'ios' ? 'checked' : 'unchecked');
    
    
    
    const actionCodeSettings = 
    {
  		url: 'https://eyediagnosis-mh153.firebaseapp.com',
	    // This must be true.
	    handleCodeInApp: true
	};
	const register = () => 
	{
	    createUserWithEmailAndPassword(auth, email, password)
	    .then((userCredential) => 
	    {
			const user = userCredential.user;
			sendEmailVerification(user, actionCodeSettings)
			.then
			(
				()=>
				{
					// The link was successfully sent. Inform the user.
				    // Save the email locally so you don't need to ask the user for it again
				    // if they open the link on the same device.
				    //alert("Verification email sent!!!");
				    //window.localStorage.setItem('emailForSignIn', email);
				    // ...
				    
				    /*
				    updateProfile
			        (
						user, 
						{
			            	displayName: name,
			            	photoURL: avatar ? avatar : 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x'
			        	}
			        )
			        .then
			        (
						() => 
						{
			            	alert('You are registered, please login after your email verification is done.');
			        	}
			        )
			        .catch
			        (
						(error) => 
						{
			            	alert(error.message + ", errorCode: ", error.code);
			        	}
			        )
			        */
				   
				   //Here, 1. put signup information to fire-store
				   alert('You are registered, please login after you verify your email.');
				   //after ok, route to login page
				}
			)
			.catch
			(
				(error) => 
				{
					user.delete();
				    alert("[Verification Email Error], " + error.message + ", errorCode: ", error.code);
				    // ...
				}
			);
	    })
	    .catch
	    (
			(error) => 
			{
	        	alert("[Creation Error], " + error.message + ", errorCode: ", error.code);
	    	}
	    );
	}
	const onChangeOfCountry = (value) =>
	{
		//console.log("onChangeOfCountry: ", value);
		switch(value)
		{
			case 'CA': setProvinceItems(CANADA_PROVINCES);
					   setProvince('ON');
					   break;
			case 'US': setProvinceItems(USA_STATES);
					   setProvince('AL');
					   break;
			default: console.error("Unknwon value selected: ", value);
					 break;
		}
	}
	
	const changePasswordIcon = () =>
	{
		passwordIcon !== 'eye-off' ? setPasswordIcon('eye-off') : setPasswordIcon('eye');
		setSecureTextEntry(!secureTextEntry);
	}
	
	const resetInputs = () =>
    {
		/*
        setAge('');
        setGender('female');
        setMedicalHistory('');
        setSigns('');
        setSymptoms(''); */
    }
    return (	
		<KeyboardAwareScrollView>
			<View style={{flexDirection: 'column', marginLeft: 20, marginRight: 20}}>
			    <Text style={{borderWidth: 0, fontSize: 14, fontWeight: 'bold', paddingLeft: 10, paddingTop: 15}}>Your basic information</Text>
                <List.Section>
                    <View style={{flexDirection: 'row'}}>
                        <TextInput 
                            style={{flex: 1, marginRight: 3}}
                            mode='outlined'
                            label='First Name (*)'
                            placeholder='Type first name'
                            multiline={false}
                            maxLength={40}   
                        />
                        <TextInput 
                            style={{flex: 1, marginLeft: 3}}
                            mode='outlined'
                            label='Last Name (*)'
                            placeholder='Type last name'
                            multiline={false}
                            maxLength={40}      
                        />
                    </View>
                </List.Section>
                <List.Section>
                        <TextInput 
                            mode='outlined'
                            label='Email (*)'
                            placeholder='Type email'
                            multiline={false}
                            maxLength={40}   
                        />
                </List.Section>
                <List.Section>
                        <TextInput 
                            mode='outlined'
                            label='Profile picture URL'
                            placeholder='Get your image URL'
                            multiline={false}
                            maxLength={40}   
                        />
                </List.Section>
                <List.Section>
                	<Text style={{borderWidth: 0, fontSize: 14, fontWeight: 'bold', padding: 10}}>Profession (*)</Text>
                    <DropDownPicker 
                    	listMode="MODAL"
                    	open={openProfession}
                    	value={profession}
                    	items={professionItems}
                    	setOpen={setOpenProfession}
                    	setValue={setProfession}
                    	setItems={setProfessionItems}
                    />
                </List.Section>
                <List.Section>
                	<Text style={{borderWidth: 0, fontSize: 14, fontWeight: 'bold', padding: 10}}>Registered province/state (*)</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
	                    <DropDownPicker 
	                    	listMode="MODAL"
	                    	open={openCountry}
	                    	value={country}
	                    	items={countryItems}
	                    	setOpen={setOpenCountry}
	                    	setValue={setCountry}
	                    	setItems={setCountryItems}
	                    	containerStyle={{width: '35%'}}
	                    	onChangeValue={onChangeOfCountry}
	                    />
	                    <DropDownPicker 
	                    	listMode="MODAL"
	                    	open={openProvince}
	                    	value={province}
	                    	items={provinceItems}
	                    	setOpen={setOpenProvince}
	                    	setValue={setProvince}
	                    	setItems={setProvinceItems}
	                    	containerStyle={{width: '63%'}}
	                    />
                    </View>
                </List.Section>
                <List.Section>
                	<Text style={{borderWidth: 0, fontSize: 14, fontWeight: 'bold', padding: 10}}>Choose your password</Text>
	                    <TextInput 
                            mode='outlined'
                            label='Password (*)'
                            placeholder='Type passowrd'
                            multiline={false}
                            secureTextEntry={secureTextEntry}
                            maxLength={40}  
                            right=
                            {
						        <TextInput.Icon icon={passwordIcon}
						          				onPress={changePasswordIcon}
							    /> 
							}
                        />
	                    <TextInput 
                            mode='outlined'
                            label='Confirm password (*)'
                            placeholder='Type password'
                            multiline={false}
                            secureTextEntry={secureTextEntry}
                            maxLength={40} 
							right=
                            {
						        <TextInput.Icon icon={passwordIcon}
						          				onPress={changePasswordIcon}
							    /> 
							}
                        />
                </List.Section>
                <List.Section>
                {
                    isValid ?  
                    <HelperText style={{paddingLeft: 10}} type='info' padding='none' visible={true}>Info (*): fields are required</HelperText> :
                    <HelperText style={{paddingLeft: 10}} type='error' padding='none' visible={true}>Error (*): Age, Signs and Symptoms are required</HelperText>
                }
                </List.Section>
                <List.Section style={{flexDirection: 'row', marginTop: 0, justifyContent: 'flex-start'}}>
                	<Checkbox status={checkedTerms === 'checked' ? 'checked' : 'unchecked'}
						      onPress={() =>  setCheckedTerms( checkedTerms === 'checked' ? 'unchecked' : 'checked')}
					/>
					<Text style={{marginTop: 10}} >I accept the </Text>
					<Anchor style={{marginTop: 10, color: 'blue'}} href='https://jsparling.github.io/hashmarks/terms_and_conditions'>
						Terms of Use & Privacy Policy
					</Anchor>
                </List.Section>
				<List.Section style={{flexDirection: 'row', marginTop: 0, justifyContent: 'space-between'}}>
                    <Button style={{width: 130, marginRight: 10}}  mode='outlined' onPress={resetInputs}>
                        Reset
                    </Button>
                    <Button style={{width: 130}} loading={false} mode='contained' onPress={register} disabled={checkedTerms === 'unchecked'}> 
                        SignUp
                    </Button>
                </List.Section>
            </View>
		</KeyboardAwareScrollView>   
    )
}
//<Text style={{marginTop: 10, color: 'blue'}} onPress={()=>console.log("modal popup")}>Terms of Use & Privacy Policy</Text>

const styles = StyleSheet.create
(
	{
	    container: 
	    {
	        flex: 1,
	        alignItems: 'center',
	        padding: 10,
	        marginTop: 10
	    },
	    button: 
	    {
	        width: 370,
	        marginTop: 10
	    }
	}
);

export default Register;