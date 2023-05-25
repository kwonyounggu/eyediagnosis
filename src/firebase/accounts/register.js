import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import 
{ 
    Button, 
    List, 
    HelperText, 
    Text,
    TextInput
} from 'react-native-paper'; 
//import * as SecureStore from 'expo-secure-store';

import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';

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
	
    return (	
		<KeyboardAwareScrollView>
			<View style={{flexDirection: 'column', marginLeft: 20, marginRight: 20}}>
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
                    <View style={{flexDirection: 'row'}}>
                        <TextInput 
                            style={{flex: 1, marginRight: 3}}
                            mode='outlined'
                            label='First Name (*)'
                            placeholder='Type first name'
                            multiline={false}
                            maxLength={40} 
                            left={<TextInput.Icon name='email' />}   
                        />
                    </View>
                </List.Section>
            </View>
		</KeyboardAwareScrollView>   
    )
}

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