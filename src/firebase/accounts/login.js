import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native'
import { Input, Button } from 'react-native-elements';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useHeaderHeight } from '@react-navigation/elements';

import { chattingName } from '../../constants';

const Login = ({navigation}) => 
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const headerHeight = useHeaderHeight();

    const openRegisterScreen = () => 
    {
      navigation.navigate('userRegister');
    };
    
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
          <View style={styles.container}>
            <Input
                placeholder='Enter your email'
                label='Email'
                leftIcon={{ type: 'material', name: 'email' }}
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Input
                placeholder='Enter your password'
                label='Password'
                leftIcon={{ type: 'material', name: 'lock' }}
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
            />
            <Button title='Log in' style={styles.button} onPress={signin}/>
            <Button title="Register" style={styles.button} onPress={openRegisterScreen} />
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
});

export default Login;
