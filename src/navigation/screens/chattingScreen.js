import * as React from 'react';
import { View, StyleSheet, ActionSheetIOS } from 'react-native';
//import { Avatar } from 'react-native-elements';
import { AppContext } from '../../contexts/appProvider';
import { auth, db, app } from '../../firebase/firebase';
//import { signOut } from 'firebase/auth';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, getDownloadURL, uploadBytes} from "firebase/storage";
//import uuid from 'react-native-uuid';
import Video from 'react-native-video';
import 
{ 
    IconButton, 
    Menu,
    Divider
} from 'react-native-paper'; 

/**
 * https://blog.logrocket.com/build-chat-app-react-native-gifted-chat/
 * https://enappd.com/blog/react-native-chat-application-using-firebase-and-hooks/207/
 * 
 * Name above etc see the below
 * https://medium.com/@decentpianist/react-native-chat-with-image-and-audio-c09054ca2204
 * 
 * https://stackoverflow.com/questions/56798962/display-an-image-or-video-in-gifted-chat
 * https://github.com/FaridSafi/react-native-gifted-chat/tree/master/example/example-gifted-chat
 * https://github.com/FaridSafi/react-native-gifted-chat/tree/master/example/example-slack-message
 * 
 * Most recent info
 * https://code.tutsplus.com/tutorials/how-to-upload-images-to-firebase-from-a-react-native-app--cms-93907
 */
export default function ChattingScreen({navigation})
{
	console.log("INFO in ChattingScreen: ", React.useContext(AppContext));
	
    const [messages, setMessages] = React.useState([]);
    const [popupVisible, setPopupVisible] = React.useState(false);

    const handePhotos = () => 
    {
		setPopupVisible(false);
		
		ImagePicker.launchImageLibraryAsync
		(
			{
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
            	allowsEditing: false,
            	aspect: [4, 3],
            	quality: 1
			}
		)
		.then
        (
			(result) => 
			{ 	console.log("result: ", result);
                //if (!result.cancelled) uploadMediaToFirestore(result);
                if (!result.cancelled)
                {
					uploadToStorage(result);
				}
        	}
        )
        .catch
        (
			(e)=>console.log("[ERROR]: ", e)
		);
	}
	
	const uploadToStorage = async (result) =>
	{
		const fetchResponse = await fetch(result.uri);
		const blob = fetchResponse.blob();
		const filename = result.uri.substring(result.uri.lastIndexOf('/') + 1);
		const storage = getStorage(app);
        const storageRef = ref(storage, 'images/' + filename); 
        
        uploadBytes(storageRef, blob)
        .then
        (
			(snapshot) =>
			{
				console.log("Uploaded a blob or file");
			}
		)
		
	}
    const goToMedia = () => 
    {
        ActionSheetIOS.showActionSheetWithOptions
        (
			{
		          options: ["Cancel", "Camera", "Photos", "Video"],
		          cancelButtonIndex: 0
	        },
            buttonIndex => 
            { console.log("buttonIndex: ", buttonIndex);
	          if (buttonIndex == 2) 
	          {
	            ImagePicker.launchImageLibraryAsync().then
	            (
					(res) => 
					{ 	console.log("res: ", res);
		                if (!res.cancelled) uploadMediaToFirestore(res);
	            	}
	            )
	            .catch
	            (
					(e)=>console.log("[ERROR]: ", e)
				);
	          } 
	          else if (buttonIndex == 1) 
	          {
	            ImagePicker.launchCameraAsync().then
	            (
					(res) => 
					{
						console.log("res: ", res);
		                if (!res.cancelled) 
		                {
		                    uploadMediaToFirestore(res);
		                }
	            	}
	            )
	            .catch
	            (
					(e)=>console.log("[ERROR]: ", e)
				);
	          } 
	          else if (buttonIndex == 3) 
	          {
	            const options = 
	            {
	              title: 'Video Picker', 
	              mediaType: 'video', 
	            };
	            ImagePicker.launchImageLibraryAsync(options).then
	            (
					(res) => 
		            {
		              if (!res.cancelled) 
		              {
		                uploadMediaToFirestore(res, 'video');
		              }
		            }
		        )
		        .catch
	            (
					(e)=>console.log("[ERROR]: ", e)
				);
          	  }
           }
         );
    }
    const uploadMediaToFirestore = async (res) => 
    {
        const uri = res.uri;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        //const uploadUri = uri;
        
        console.log("[INFO]: filename=", filename, ", uploadUri=", uploadUri);

        const storage = getStorage(app);

        const storageRef = ref(storage, 'images/' + filename); 
        const img = await fetch(uploadUri);
        const bytes = await img.blob();
        console.log("----- 7 ------");
        let metadata;
        if (res.type == 'video') 
        {
	          metadata = 
	          {
	              contentType: 'video/mp4',
	          };
        } 
        else 
        {    console.log("----- 8 ------");
	          metadata = 
	          {   
	              contentType: 'image/jpeg',
	          };
        }
        console.log("----- 9 ------ bytes: ", bytes);
        
        if (1>0) return;
        uploadBytes(storageRef, bytes, metadata)
        .then
        (
			async (uploadTask) => 
			{
          		console.log('task', uploadTask);
          		getDownloadURL(uploadTask.ref).then
          		(
					  (url) => 
					  {
            				if (res.type == 'video') 
            				{
					              setVideoData(url);
					        } 
					        else 
					        {     console.log("----- 0 ------");
					              setImageData(url);
					        }
          			  }
          		);
        	}
        )
        .catch
        (
			(error) => 
			{
          			alert('Error while uploading Image!')
          			console.log(error);
        	}
        );
    }  
    const setVideoData = (url) => 
    {
        const imageMessage = 
        [
          {
            _id: uuid.v4(),
            createdAt: new Date(),
            video: url,
            user: 
            {
             	_id: auth?.currentUser?.email,
	            name: auth?.currentUser?.displayName,
	            avatar: auth?.currentUser?.photoURL
            }
          }
        ];
        //setMessages(previousMessages => GiftedChat.append(previousMessages, imageMessage))
        const { _id, createdAt, user, video} = imageMessage[0]
        addDoc(collection(db, 'eyediagnosisChats'), { _id, createdAt,  video, user })
    	.then
    	(
			()=>console.log("[INFO]: video is added into firestore")
		)
		.catch
		(
			(e)=>console.log("[ERROR]: ", e)
		)
		.finally
		(
			()=>{}
		);
    }
    const setImageData = (url) => 
    {   console.log("----- 1 ------");
        const imageMessage = 
        [
          {
            _id: uuid.v4(),
            createdAt: new Date(),
            image: url,
            user: 
            {
             	_id: auth?.currentUser?.email,
	            name: auth?.currentUser?.displayName,
	            avatar: auth?.currentUser?.photoURL
            }
          }
        ];
        //setMessages(previousMessages => GiftedChat.append(previousMessages, imageMessage))
        const { _id, createdAt, user, image} = imageMessage[0]
        addDoc(collection(db, 'eyediagnosisChats'), { _id, createdAt, image, user })
    	.then
    	(
			()=>console.log("[INFO]: image is added into firestore")
		)
		.catch
		(
			(e)=>console.log("[ERROR]: ", e)
		)
		.finally
		(
			()=>{}
		);
    }
    const renderMessageVideo = (props) => 
    {
        const { currentMessage } = props;
        console.log(currentMessage.video);
        return (
          
          <View style={{ position: 'relative', height: 150, width: 250 }}>
	          <Video
		          style=
		          {
					  {
				            position: 'absolute',
				            left: 0,
				            top: 0,
				            height: 150,
				            width: 250,
				            borderRadius: 20
		          	  }
		          }
	          	  shouldPlay
	              rate={1.0}
	              resizeMode="cover"
	              height={150}
	              width={250}
	              muted={false}
	              source={{ uri: "https://firebasestorage.googleapis.com/v0/b/coupon-2379f.appspot.com/o/small.mp4?alt=media&token=4f4722e3-c9fc-49a8-a753-1d635e99eb43" }}
	              allowsExternalPlayback={false}
	           >
	           </Video>    
          </View>
        );
    }
    React.useEffect
    (
		() =>
		{
			navigation.setOptions
	        (
				{
		            headerRight: () => 
		            (
		                <Menu visible={popupVisible} 
		                	  contentStyle={styles.popupMenu}
		                	  onDismiss={()=>setPopupVisible(false)}
                    		  anchor=
                    		  {
								  <IconButton style={{margin: 0, padding: 0}} 
								  			  icon='dots-vertical' color='#000' size={30} 
								  			  onPress={()=>setPopupVisible(true)}
								  />
							  }
                    	>
                    		  <Menu.Item leadingIcon='logout' title='Camera' onPress={()=>{}} />
                    		  <Menu.Item leadingIcon='logout' 
                    		  			 title='Photos' 
                    		  			 onPress={handePhotos}
                    		  />
                    		  <Menu.Item leadingIcon='logout' title='Video' onPress={()=>{}} />
                    		  <Divider />
                    		  <Menu.Item leadingIcon='database-sync-outline' 
                    		  			 title='List Data' 
                    		  			 onPress=
                    		  			 {
											   () =>
											   {
												   //setPopupVisible(false); 
												   //return navigation.navigate(listSavedDataName);
											   }
										 } 
							/>
                    	</Menu>
	                )
	        	}
	        );
		}
		
	);
    React.useLayoutEffect
    (
		() => 
		{
	        //Retrieve old messages from firestore
	        
	        const q = query(collection(db, 'eyediagnosisChats'), orderBy('createdAt', 'desc'));
            const unsubscribe = onSnapshot
            ( q, 
              (snapshot) =>
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
        		),
        	  (error) =>
        	  {
				  console.log(error);
			  }
        	);

            return () => unsubscribe();           
		   
         }, [navigation]
    );

    const onSend = React.useCallback
    (
		(messages = []) => 
		{
        	const { _id, createdAt, text, user} = messages[0];
        	addDoc(collection(db, 'eyediagnosisChats'), { _id, createdAt,  text, user })
        	.then
        	(
				()=>console.log("[INFO]: message is added into firestore")
			)
			.catch
			(
				(e)=>console.log("[ERROR]: ", e)
			)
			.finally
			(
				()=>{}
			);

    	}, []
    );
  
    return (
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            renderUsernameOnMessage={true}
            user=
            {
				{
	                _id: auth?.currentUser?.email,
	                name: auth?.currentUser?.displayName,
	                avatar: auth?.currentUser?.photoURL
            	}
            }
            renderMessageVideo={renderMessageVideo}
        />
    );
}

const styles = StyleSheet.create
(
    {
        popupMenu: 
		{
		    borderTopLeftRadius: 10,
		    borderRadius: 20,
		    
		    borderWidth: 5,
		    backgroundColor: 'red'
		}
    }
);