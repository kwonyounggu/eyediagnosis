import React, { useState } from 'react';
import { View, StyleSheet, Image, Platform, TouchableOpacity } from 'react-native'
import 
{ 
	ActivityIndicator,
    Button, 
    List, 
    HelperText, 
    Headline,
    Text,
    TextInput,
    Checkbox
} from 'react-native-paper'; 
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useHeaderHeight } from '@react-navigation/elements';
import { theme } from '../../common/theme';

import { chattingName } from '../../constants';

const Login = ({navigation}) => 
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const headerHeight = useHeaderHeight();
    const [isValid, setIsValid] = useState(true);
    const [checkedTerms, setCheckedTerms] = useState(Platform.OS === 'ios' ? 'checked' : 'unchecked');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [passwordIcon, setPasswordIcon] = useState('eye-off');
    const [errorMessage, setErrorMessage] = useState('');
    
    const [signingInNow, setSigningInNow] = useState(false);

    const openRegisterScreen = () => 
    {
      navigation.navigate('userRegister');
    };
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
    const signin = () => 
    {
      signInWithEmailAndPassword(auth, email, password)
        .then
        (
			(userCredential) => 
	        {
	          //navigation.navigate(chattingName);
	          console.log("INFO: userCredential=", userCredential.user);
	          console.log("len: ", userCredential.user.providerData.length)
	          for (let i=0; i<userCredential.user.providerData.length; i++)
	          {
				  console.log(i, "-", userCredential.user.providerData[i]);
			  }
	            
	        }
	    )
        .catch
        (
			(error) => 
			{
	          const errorCode = error.code;
	          const errorMessage = error.message;
	          alert(errorMessage);
	        }
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
                            value={email}
                            onChangeText={(value)=>setEmail(value.trim())}  
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
						value={password}
                        onChangeText={(value)=>setPassword(value)}  
                    />                     
                </List.Section>
                <List.Section style={{flexDirection: 'row-reverse', marginTop: 0, justifyContent: 'flex-start'}}>
                	<TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
                		<Text style={[styles.labelSecondary, {marginTop: 0}]} >Forgot your password? </Text>
                	</TouchableOpacity>
                </List.Section>
                <List.Section>
                {
                    !isValid && <HelperText style={{paddingLeft: 10}} type='error' padding='none' visible={true}>{errorMessage}</HelperText>
                }
                </List.Section>
                <List.Section style={{flexDirection: 'row', marginTop: 0, justifyContent: 'flex-start'}}>
                	<Checkbox status={checkedTerms === 'checked' ? 'checked' : 'unchecked'}
						      onPress={() =>  setCheckedTerms( checkedTerms === 'checked' ? 'unchecked' : 'checked')}
					/>
					<Text style={[styles.labelPrimary, {marginTop: 10}]} >Remember Me</Text>
                </List.Section>
				<List.Section style={{flexDirection: 'row', marginTop: 0, justifyContent: 'space-between'}}>
                    <Button style={{width: 130, marginRight: 10}}  mode='outlined' onPress={resetInputs}>
                        Reset
                    </Button>
                    <Button style={{width: 130}} loading={false} mode='contained' onPress={signin} disabled={checkedTerms === 'unchecked'}> 
                        SignUp
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
