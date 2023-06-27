import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import 
{ 
	ActivityIndicator,
    Button, 
    List, 
    HelperText, 
    Headline,
    Text,
    TextInput
} from 'react-native-paper'; 
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { theme } from '../../common/theme';

import { chattingName, appForgotPasswordScreenName, appRegisterScreenName, homeRootName, appHome } from '../../constants';
import { emailValidator, passwordValidator } from '../../common/validate';

const Login = ({route, navigation}) => 
{
    const [email, setEmail] = useState({value: '', error: ''});
    const [password, setPassword] = useState({value: '', error: ''});

    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [passwordIcon, setPasswordIcon] = useState('eye-off');
    const [errorMessage, setErrorMessage] = useState('');
    
    const [signingInNow, setSigningInNow] = useState(false);
    
    //console.log("params: ", route.params.email, " email: ", eml, " password: ", password);

	React.useEffect
	(
		() => 
		{
    		setEmail({value: route.params.email, error: ''});
    		setPassword({value: route.params.password, error: ''});
    		setErrorMessage('');
  		}, [route.params]
  	);
    const openRegisterScreen = () => 
    {
      navigation.navigate(appRegisterScreenName);
    };
    const changePasswordIcon = () =>
	{
		passwordIcon !== 'eye-off' ? setPasswordIcon('eye-off') : setPasswordIcon('eye');
		setSecureTextEntry(!secureTextEntry);
	}
	const resetInputs = () =>
    {
        setEmail({value: '', error: ''});
        setPassword({value: '', error: ''});
    }
    const signin = () => 
    {
		let error = '';
		if (error=emailValidator(email.value))
    	{
			setEmail({ ...email, error });
		}
		else if (error=passwordValidator(password.value))
		{
			setPassword({ ...password, error });
		}
		
		if (error) 
		{
			setErrorMessage(error);
			return;
		}
		
		setSigningInNow(true);
		if (errorMessage.length !== 0) setErrorMessage('');
		
		

    //navigation.navigate('Dashboard');
		 
        signInWithEmailAndPassword(auth, email.value, password.value)
        .then
        (
			(userCredential) => 
	        {
	          console.log("INFO: userCredential=", userCredential.user);
	          console.log("emailVerified: ", userCredential.user.emailVerified);
	          if (userCredential.user.emailVerified) 
	          {
				  navigation.navigate(appHome);//check if it is working, do onauthstatechanged without using rememeberme
			  }
	          else 
	          {
				  //here do signOut
				  setErrorMessage('Ooops! You haven\'t verified your email if it\'s yours.');
				  signOut(auth)
				  .then
				  (
					  ()=>console.log('Signed out because it has been verified.')
				  )
				  .catch
				  (
					  (e)=>console.log('Signing out due to the unverified is failed: ', e.message)
				  )
			  }
	            
	        }
	    )
        .catch
        (
			(error) => 
			{
	          console.log("errorCode: ", error.code);
	          if (error.code.includes('auth/invalid-value-(email)')) setErrorMessage('Ooops!, The email is not valid.');
	          else if (error.code === 'auth/user-not-found') setErrorMessage('Ooops!, The email is not found in our account list.');
	          else if (error.code === 'auth/wrong-password') setErrorMessage('Ooops!, The password is not correct.');
	          else if (error.code === 'auth/user-disabled') setErrorMessage('Ooops!, Your account is disabled.');
	          else setErrorMessage(error.message);
	        }
	    )
	    .finally
	    (
			() => setSigningInNow(false)
		);
	    
    };

    return (
		<KeyboardAwareScrollView>
			<View style={{flexDirection: 'column', marginLeft: 20, marginRight: 20}}>
			    <Image style={styles.image} source={require("../../../assets/images/chatgpt_logo.jpeg")} />
	            <Headline style={{fontWeight: 'bold', alignSelf: 'center', marginBottom: 10}}>
	                Welcome back.
	            </Headline>
                
                <List.Section>
                        <TextInput 
                            mode='outlined'
                            label='Email'
                            placeholder='Type email'
                            multiline={false}
                            maxLength={62}  
                            value={email.value}
                            onChangeText={(value)=>setEmail({value: value.trim(), error: ''})} 
                            error={!!email.error} 
                            errorText={email.error}
                            returnKeyType='next'
                            textContentType='emailAddress'
                            keyboardType='email-address'
                            autoCapitalize='none'
                        />
                </List.Section>        
                <List.Section>
                    <TextInput 
                        mode='outlined'
                        label='Password'
                        placeholder='Type passowrd'
                        multiline={false}
                        secureTextEntry={secureTextEntry}
                        maxLength={15}  
                        right=
                        {
					        <TextInput.Icon icon={passwordIcon}
					          				onPress={changePasswordIcon}
						    /> 
						}
						value={password.value}
                        onChangeText={(value)=>setPassword({value, error: ''})}  
                        returnKeyType='done'
                        error={!!password.error}
        				errorText={password.error}
                    />                     
                </List.Section>
                <List.Section style={{flexDirection: 'row-reverse', marginTop: 0, justifyContent: 'flex-start'}}>
                	<TouchableOpacity onPress={() => navigation.navigate(appForgotPasswordScreenName, {email: email.value})}>
                		<Text style={[styles.labelSecondary, {marginTop: 0}]} >Forgot your password? </Text>
                	</TouchableOpacity>
                </List.Section>
                <List.Section>
                {
                    !!errorMessage && <HelperText style={{paddingLeft: 10}} type='error' padding='none' visible={true}>{errorMessage}</HelperText>
                }
                </List.Section>
				<List.Section style={{flexDirection: 'row', marginTop: 0, justifyContent: 'space-between'}}>
                    <Button style={{width: 130, marginRight: 10}}  mode='outlined' onPress={resetInputs}>
                        Reset
                    </Button>
                    <Button style={{width: 130}} loading={false} mode='contained' onPress={signin} disabled={false}> 
                        Login
                    </Button>
                </List.Section>
                <List.Section style={{flexDirection: 'row', marginTop: 0, justifyContent: 'center'}}>
                	<Text style={[styles.labelSecondary, {marginTop: 0}]} >Don't have an account? </Text>
                	<TouchableOpacity onPress={openRegisterScreen}>
			          <Text style={styles.link}>Sign up</Text>
			        </TouchableOpacity>
                </List.Section>
                {
					signingInNow && <View style={styles.signingInNow}>
                                <ActivityIndicator size='large' />
                            </View>
				}
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
	    image: 
        {
            alignSelf: 'center',
            width: 80,
            height: 80,
            resizeMode: 'contain',
            borderRadius: 64,
            marginBottom: 4,
            marginTop: 4
        },
	    signingInNow:
        {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center'
        },
        labelPrimary:
        {
			color: theme.colors.primary
		},
        labelSecondary:
        {
			color: theme.colors.secondary
		},
		labelError:
		{
			color: theme.colors.error
		},
		link: 
		{
		    fontWeight: 'bold',
		    color: theme.colors.primary
		}
});

export default Login;
