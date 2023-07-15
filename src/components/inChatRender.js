/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Image, Alert } from 'react-native';
import { InputToolbar, Actions, Composer, Send } from 'react-native-gifted-chat';
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from '../firebase/firebase';
import { getCountryProvinceProfession } from '../common/utils';

export const renderInputToolbar = (props) => 
(
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: '#222B45',
      paddingTop: 6,
    }}
    primaryStyle={{ alignItems: 'center' }}
  />
);

export const renderActions = (props) => 
(
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => (
      <Image
        style={{ width: 32, height: 32 }}
        source={{
          uri: 'https://placeimg.com/32/32/any',
        }}
      />
    )}
    options={{
      'Choose From Library': () => {
        console.log('Choose From Library');
      },
      Cancel: () => {
        console.log('Cancel');
      },
    }}
    optionTintColor="#222B45"
  />
);

export const renderComposer = (props) => 
(
  <Composer
    {...props}
    textInputStyle={{
      color: '#222B45',
      backgroundColor: '#EDF1F7',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#E4E9F2',
      paddingTop: 8.5,
      paddingHorizontal: 12,
      marginLeft: 0,
    }}
  />
);

export const renderSend = (props) => 
(
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
    }}
  >
    <Image
      style={{ width: 32, height: 32 }}
      source={{
        uri: 'https://placeimg.com/32/32/any',
      }}
    />
  </Send>
);

export const onPressAvatar = (props) =>
{
	//console.log("onPressAvatar, props: ", props);
	let userInfo = "\n\nUnknown\n\n" + "State, Canada/USA\n\n";
	const q = query(collection(db, 'registeredUsers'), where("email", "==", props._id), limit(1));
	getDocs(q).then
	(
		(snapShot) => 
		{
			if (!snapShot.empty)
			{	//console.log("user info: ", snapShot.docs[0].data());
				const data = snapShot.docs[0].data();
				const o = getCountryProvinceProfession(data.country, data.province, data.profession);
				userInfo = "\n\n" + o.profession + "\n\n" +
						   o.province + ", " + o.country + "\n\n";
			}
			else
			{	
				console.log("[INFO]: user information from firestore is empty...");
			}
			
		}
	)
	.catch
	(
		(e)=>console.log("Ooops! there found an error: ", e)
	)
	.finally
	(
		() =>
		   Alert.alert
	       (
			   props.name, 
			   userInfo +
			   props._id,	   
	      	   [
	      	  		{text: 'OK', onPress: () => {}}
	      	   ]
	       )
	);
	

	
}
