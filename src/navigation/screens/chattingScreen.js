import * as React from 'react';
import { View, StyleSheet, ActionSheetIOS, Dimensions } from 'react-native';
//import { Avatar } from 'react-native-elements';
import { AppContext } from '../../contexts/appProvider';
import { auth, db, app } from '../../firebase/firebase';
//import { signOut } from 'firebase/auth';
import { Bubble, GiftedChat, MessageImage } from 'react-native-gifted-chat';
import { collection, addDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { getStorage, ref, getDownloadURL, uploadBytes} from "firebase/storage";
import uuid from 'react-native-uuid';

import 
{ 
    IconButton, 
    Menu,
    Divider,
    ActivityIndicator
} from 'react-native-paper'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
//import { Colors } from 'react-native/Libraries/NewAppScreen';

/**
 * https://blog.logrocket.com/build-chat-app-react-native-gifted-chat/
 * https://enappd.com/blog/react-native-chat-application-using-firebase-and-hooks/207/
 * https://www.linkedin.com/pulse/react-native-chat-application-using-firebase-hooks-part-gehani
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
 * 
 * DataInputBar change
 * https://stackoverflow.com/questions/60078901/react-native-gifted-chat-change-color-under-inputtoolbar
 * 
 * sending a file 
 * https://medium.com/@WynneTran/sending-files-through-react-native-gifted-chat-cddd9b1be0a0
 * 
 * make a channel for more complex
 * https://chatkitty.com/blog/building-a-chat-app-with-react-native-and-gifted-chat-part-2
 * 
 * copy or share
 * https://github.com/FaridSafi/react-native-gifted-chat/issues/2022
 * 
 * WhatsApp clone using react native using expo and firebase
 * https://www.youtube.com/watch?v=YPSjNIJEdXU&ab_channel=EstebanCodes
 */

const FILE_SIZE_MAX = 2621440; //2.5MB
export default function ChattingScreen({navigation})
{
	console.log("INFO in ChattingScreen: ", React.useContext(AppContext));
	
    const [messages, setMessages] = React.useState([]);
    const [popupVisible, setPopupVisible] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	
    const user = {
		              _id: auth?.currentUser?.email,
			          name: auth?.currentUser?.displayName,
			          avatar: auth?.currentUser?.photoURL
		         };

	const getFileInfo = async (fileURI) => 
	{
	   const fileInfo = await FileSystem.getInfoAsync(fileURI, {size: true});
	   return fileInfo;
	}
	
    const handleMedia = async (option) => 
    {
		setPopupVisible(false);
		
		ImagePicker.launchImageLibraryAsync
		(
			{
				mediaTypes: option,
            	allowsEditing: false,
            	//aspect: [4, 3],
            	quality: 1
			}
		)
		.then
        (
			(result) => 
			{ 	console.log("result: ", result);

                if (!result.cancelled)
                {
					getFileInfo(result.uri)
					.then
					(
						(fileInfo) =>
						{   
							if (fileInfo.size > FILE_SIZE_MAX)
								alert("File size must be smaller than 2.5MB!");
							else uploadToStorage(result);
						}
					)
					.catch
					(
						(e)=> alert("Failed in getting file info: ", e)
					)
				}
        	}
        )
        .catch
        (
			(e) => alert("Selecting a media file failed: ", e)
		);
	}
	
	//image, video, pdf
	const uploadToStorage = async (result) =>
	{
		const imageMessage = 
        [
          {
            _id: uuid.v4(),
            createdAt: new Date(),
            [result.type]: result.uri, //local path
            user
          }
        ];
        setMessages(previousMessages => GiftedChat.append(previousMessages, imageMessage))
		
		setLoading(true);
		const fetchResponse = await fetch(result.uri);
		const blob = await fetchResponse.blob();
		const filename = result.uri.substring(result.uri.lastIndexOf('/') + 1);
		const storage = getStorage(app);
        const storageRef = ref(storage, result.type +'s/' + filename); //eg: images/imageFileName.jpg, videos/videoFileName.mp4
        
        const metaData = {contentType: blob.type}; //eg: image/jpg
        
        uploadBytes(storageRef, blob, metaData)
        .then
        (
			async (snapshot) =>
			{
				getDownloadURL(snapshot.ref).then
          		(
					  (url) => 
					  {
            				if (result.type == 'video') 
            				{
					              setVideoData([{...imageMessage[0], video: url}]);
					        } 
					        else 
					        {     
					              setImageData([{...imageMessage[0], image: url}]);
					        }
          			  }
          		);
			}
		)
		.catch
		(
			(error)=>
			{
				alert(error);
			}
		)
		.finally
		(
			()=>setLoading(false)
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
    const setVideoData = (imageMessage) => 
    {
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
    const setImageData = (imageMessage) => 
    {   
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
    /**
	 * <Video
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
	          	 
	              source={{ uri: currentMessage.video }}
	              onError={(e)=>console.error(e)}
	           />
	 */
    const renderMessageVideo = (props) => 
    {
        const { currentMessage } = props;
        console.log(currentMessage.video);
        return (
          
          <View style={{ position: 'relative', height: 150, width: 250 }}>
	          
	             
          </View>
        );
    }
    /**
	 * see the image TouchableOpacity
	 */

    const renderMessageImage = (props) => 
    {
        //const { currentMessage } = props;
        //if (currentMessage.user._id === user._id) console.log("renderMessageImage: ", currentMessage);
        
        return (
          
          <MessageImage 
			    {...props}
			    imageStyle=
			    {
					{
						resizeMode: 'contain' //cover
			    	}
			    }
		  />
        );
    }

    const renderBubble = (props) =>
    {
		//console.log("renderBudder: ", props);
		//if (props.currentMessage.user._id === user._id && props.currentMessage.image)
		if (props.currentMessage.image)	
			if (props.currentMessage.user._id === user._id)//right side image
				return (
					<Bubble {...props}
							wrapperStyle=
							{
								{
									right: 
									{
										backgroundColor: 'transparent' //image requires no bg color
									}
								}
							}	
							timeTextStyle=
							{
								{
							        right: 
							        {
							          color: '#808080' //grey
							        }
							      }
							}
					/>
				);
			else return (<Bubble {...props} />); //left side image
		else if (props.currentMessage.user._id !== user._id)  //left text 
			return (<Bubble {...props} wrapperStyle={{left: {backgroundColor: '#d3d3d3'}}}/>);
		else return (<Bubble {...props} />); //right text
	}
	function renderLoading() 
	{
		console.log("renderLoading ()...");
	    return (
	      <View style={styles.loadingContainer}>
	        <ActivityIndicator size="large" color="#6646ee" />
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
                    		  			 onPress={()=>handleMedia(ImagePicker.MediaTypeOptions.Images)}
                    		  />
                    		  <Menu.Item leadingIcon='logout' 
                    		  			 title='Video' 
                    		  			 onPress={()=>handleMedia(ImagePicker.MediaTypeOptions.Videos)} 
                    		  />
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
						{
							//if (doc.data().image) console.log("[INFO] image url: ", doc.data().image);
							return {
				                _id: doc.data()._id,
				                createdAt: doc.data().createdAt.toDate(),
				                text: doc.data().text,
				                image: doc.data().image,
				                video: doc.data().video,
				                user: doc.data().user
            				};
            			}
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
		<View style={{flex: 1}}>
	        <GiftedChat
	            messages={messages}
	            showAvatarForEveryMessage={true}
	            onSend={messages => onSend(messages)}
	            renderUsernameOnMessage={true}
	            disableComposer={false}
	            user={user}
	            renderMessageVideo={renderMessageVideo}
	            renderMessageImage={renderMessageImage}
	            renderLoading={renderLoading}
	            renderBubble={renderBubble} 
	            renderActions=
	            {
					()=>
				
		              <Ionicons
		                name="ios-mic"
		                size={35}
		                hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
		                color={"red"}
		                style={{
		                  bottom: 50,
		                  right: Dimensions.get("window").width / 2,
		                  position: "absolute", 
		                  shadowColor: "#000",
		                  shadowOffset: { width: 0, height: 0 },
		                  shadowOpacity: 0.5,
		                  zIndex: 2,
		                  backgroundColor: "transparent"
		                }}
		                onPress={()=>{}}
		              />

				}
	        />
        	{
                loading &&   <View style={styles.loading}>
                                <ActivityIndicator size='large' />
                            </View>
            } 
        </View>
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
		},
		loading: 
        {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center'
        }
    }
);