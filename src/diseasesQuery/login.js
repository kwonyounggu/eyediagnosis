import { Image, StyleSheet, View } from 'react-native';
import { Button, Headline } from 'react-native-paper';
//import { useChatGpt } from 'react-native-chatgpt';
import { useChatGpt } from '../chatGpt';

const styles = StyleSheet.create
(
    {
        container: 
        {
            flex: 1,
            justifyContent: 'center',
            padding: 32
        },

        image: 
        {
            alignSelf: 'center',
            width: 128,
            height: 128,
            resizeMode: 'contain',
            borderRadius: 64,
            marginBottom: 32
        }
    }
);
const Login = () =>
{
    const {login} = useChatGpt();
    console.log("login of useChatGpt() in Navigator: ", login);

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../../assets/images/chatgpt_logo.jpeg")} />
            <Headline style={{fontWeight: 'bold', alignSelf: 'center', marginBottom: 128}}>
                Welcome to ChatGPT
            </Headline>
            <Button
                contentStyle={{ height: 56 }}
                labelStyle={{ fontSize: 16 }}
                mode="contained"
                onPress={login}
            >
                Login
            </Button>
        </View>
    );
};

export default Login;