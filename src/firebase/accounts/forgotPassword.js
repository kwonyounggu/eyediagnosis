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
import { sendPasswordResetEmail } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { theme } from '../../common/theme';

import { appLoginScreenName } from '../../constants';
import { emailValidator } from '../../common/validate';

const ForgotPassword = ({navigation}) => 
{
    const [email, setEmail] = useState({value: '', error: ''});
    const [isValid, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    
    const [sendingNow, setSendingNow] = useState(false);

    const resetPassword = () => 
    {
		const emailError = emailValidator(email.value);
		
		if (emailError)
		{
			setEmail({ ...email, error: emailError });
      		return;
		}
		
		setSendingNow(true);
		sendPasswordResetEmail(auth, email.value)
		.then
		(
			() => navigation.navigate(appLoginScreenName, {email: email.value, password: ''})	
		)
		.catch
		(
			(e) => setEmail({...email, error: e.message})
		)
		.finally
		(
			() => setSendingNow(false)
		)
		
    };

    return (
		<KeyboardAwareScrollView>
			<View style={{flexDirection: 'column', marginLeft: 20, marginRight: 20}}>
			    <Image style={styles.image} source={require("../../../assets/images/chatgpt_logo.jpeg")} />
	            <Headline style={{fontWeight: 'bold', alignSelf: 'center', marginBottom: 10}}>
	                Restore Password
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
                            returnKeyType='done'
                            textContentType='emailAddress'
                            keyboardType='email-address'
                            autoCapitalize='none'
                        />
                </List.Section>        

                <List.Section>
                {
                    !!email.error && <HelperText style={{paddingLeft: 10}} type='error' padding='none' visible={true}>{email.error}</HelperText>
                }
                </List.Section>
				<List.Section style={{flexDirection: 'row', marginTop: 0, justifyContent: 'center'}}>
                    <Button style={{width: 200}} loading={false} mode='contained' onPress={resetPassword} disabled={false}> 
                        Send Reset Instructions
                    </Button>
                </List.Section>
                <List.Section style={{flexDirection: 'row', marginTop: 0, justifyContent: 'center'}}>            	
                	<TouchableOpacity onPress={() => navigation.navigate(appLoginScreenName, {email: '', password: ''})} >
			          <Text style={[styles.labelSecondary, {marginTop: 0}]} >← Back to login</Text>
			        </TouchableOpacity>
                </List.Section>
                {
					sendingNow && <View style={styles.sendingNow}>
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
	    sendingNow:
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

export default ForgotPassword;
