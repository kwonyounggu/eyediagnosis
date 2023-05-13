import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native'
import { Input, Button } from 'react-native-elements';
import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, sendSignInLinkToEmail, sendEmailVerification } from 'firebase/auth';


const Register = () =>
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
	    handleCodeInApp: true,
  		iOS: { bundleId: 'com.example.ios'},
  		android: 
  		{
		    packageName: 'com.example.android',
		    installApp: true,
		    minimumVersion: '12'
  		},
  		dynamicLinkDomain: 'example.page.link'
	};
	const register = () => 
	{
	  createUserWithEmailAndPassword(auth, email, password)
	    .then((userCredential) => 
	    {
			const user = userCredential.user;
			sendEmailVerification(actionCodeSettings)
			.then
			(
				()=>
				{
					// The link was successfully sent. Inform the user.
				    // Save the email locally so you don't need to ask the user for it again
				    // if they open the link on the same device.
				    alert("Verification email sent!!!");
				    window.localStorage.setItem('emailForSignIn', email);
				    // ...
				}
			)
			.catch
			(
				(error) => 
				{
				    alert(error.message + ", errorCode: ", error.code);
				    // ...
				}
			);

	        // Registered
	        
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
	            	alert('Registered, please login.');
	        	}
	        )
	        .catch
	        (
				(error) => 
				{
	            	alert(error.message);
	        	}
	        )
	    })
	    .catch
	    (
			(error) => 
			{
	        	const errorCode = error.code;
	        	const errorMessage = error.message;
	        	alert(errorMessage);
	    	}
	    );
	}
	
	return (
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <Input
                placeholder='Enter your name'
                label='Name'
                value={name}
                onChangeText={text => setName(text)}
            />
            <Input
                placeholder='Enter your email'
                label='Email'
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Input
                placeholder='Enter your password'
                label='Password'
                value={password} onChangeText={text => setPassword(text)}
                secureTextEntry
            />
            <Input
                placeholder='Enter your image url'
                label='Profile Picture'
                value = {avatar}
                onChangeText={text => setAvatar(text)}
            />
            <Button title='register' onPress={register} style={styles.button} />
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