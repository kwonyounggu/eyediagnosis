import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import { AppContext } from '../../contexts/appProvider';
import { auth, db } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';


export default function ChattingScreen({navigation})
{
	console.log("INFO in ChattingScreen: ", React.useContext(AppContext));
	/*const loadDataCallback = React.useCallback
	(
		async () => 
		{
		    try 
		    {
				console.log("INFO: inside loadDataCallback");
		      const db = await getDBConnection();
		      //await createChatGptUserTable(db); 
		    } 
		    catch (error) 
		    {
		      console.error(error);
		    }
		}, []
	);
	
	React.useEffect
	(
		() => 
		{
    		loadDataCallback(); console.log("here in useEffect");
  		}, [loadDataCallback]
  	);*/
  	
    const [messages, setMessages] = React.useState([]);
    const signOutNow = () => 
    {
        signOut(auth).then
        (
			() => 
			{
	            // Sign-out successful.
	            navigation.replace('appLogin');
        	}
        ).
        catch
        (
			(error) => 
			{
            // An error happened.
        	}
        );
    }
    React.useLayoutEffect
    (
		() => 
		{
	        navigation.setOptions
	        (
				{
		            headerLeft: () => 
		            (
		                <View style={{ marginLeft: 20 }}>
		                    <Avatar
		                        rounded
		                        source={{
		                            uri: auth?.currentUser?.photoURL,
		                        }}
		                    />
		                </View>
		            ),
		            headerRight: () => 
		            (
		                <TouchableOpacity 
		                	style={{marginRight: 10}}
		                    onPress={signOutNow}
		                >
		                    <Text>logout</Text>
		                </TouchableOpacity>
	                )
	        	}
	        );
	        const q = query(collection(db, 'eyediagnosisChats'), orderBy('createdAt', 'desc'));
            const unsubscribe = onSnapshot
            ( q, (snapshot) => 
            	 setMessages
            	 (
            		snapshot.docs.map
            		(
						doc => 
						(
							{
				                _id: doc.data()._id,
				                createdAt: doc.data().createdAt.toDate(),
				                text: doc.data().text,
				                user: doc.data().user
            				}
            			)
            		)
        		)
        	);

            return () => {unsubscribe();};
	        
         }, [navigation]
      );

	/*
    React.useEffect
    (
		() => 
		{
	        setMessages
	        (
				[
		            {
		                _id: 1,
		                text: 'Hello developer',
		                createdAt: new Date(),
		                user: 
		                {
		                    _id: 2,
		                    name: 'React Native',
		                    avatar: 'https://placeimg.com/140/140/any',
		                }
		             }
	            ]
	        )
	    }, []
	);*/
    const onSend = React.useCallback
    (
		(messages = []) => 
		{
        	const { _id, createdAt, text, user,} = messages[0];
			addDoc(collection(db, 'eyediagnosisChats'), { _id, createdAt,  text, user });
    	}, []
    );
  
    return (
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user=
            {
				{
	                _id: auth?.currentUser?.email,
	                name: auth?.currentUser?.displayName,
	                avatar: auth?.currentUser?.photoURL
            	}
            }
        />
    );
}
