import * as React from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, Text } from 'react-native';
//import { Avatar } from 'react-native-elements';
import { AppContext } from '../../contexts/appProvider';
import { auth, db, app } from '../../firebase/firebase';
//import { signOut } from 'firebase/auth';
import { Bubble, GiftedChat, MessageImage, MessageText } from 'react-native-gifted-chat';
import { collection, addDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, getDownloadURL, uploadBytes} from "firebase/storage";
import uuid from 'react-native-uuid';
import { Video, ResizeMode} from 'expo-av';
import 
{ 
    IconButton, 
    Menu,
    Divider,
    ActivityIndicator
} from 'react-native-paper'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import InChatViewFile from '../../components/inChatViewFile';
import { renderMessageText } from '../../components/inChatMessage';
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
 * 
 * InputEntry
 * https://codesandbox.io/p/sandbox/react-native-gifted-chat-q7ry4n3356?file=%2Fexample%2Fexample-gifted-chat%2Fsrc%2FInputToolbar.js%3A1%2C1
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
	
	//ExponentImagePicker.launchCameraAsync' has been rejected
	//https://github.com/expo/expo/issues/19512
	//About permission
	//https://www.kindacode.com/article/image-picker-in-react-native/
    const handleMedia = async (option) => 
    {
		setPopupVisible(false);
		
		let result = null;
		
		switch(option)
		{
			case 'Images':  
			case 'Videos': result = await ImagePicker.launchImageLibraryAsync
							(
								{
									mediaTypes: option,
					            	allowsEditing: true,
					            	aspect: [4, 3],
					            	base64: true,
					            	quality: 1
								}
							);
							break;
			case 'Camera': 
				const permission = await ImagePicker.requestCameraPermissionsAsync();
				if (permission.granted === false)
				{
					alert("You've refused to allow this app to access your camera!");
					return;
				}
				result = await ImagePicker.launchCameraAsync
				(
					{
						mediaTypes: ImagePicker.MediaTypeOptions.Images,
						allowsEditing: true,
		            	//aspect: [4, 3],
		            	quality: 1
					}
				);
				break;
			case 'Pdf':
				DocumentPicker.getDocumentAsync
				(
					{
						copyToCacheDirectory: true,
						type: 'application/pdf'
					}
				)
				.then
				(
					(result) => 
					{
						if (result.type === 'success') 
							checkFileAndUpload({uri: result.uri, type: 'pdf'});
					}
				)
				.catch
				(
					(e) => alert("Failed getting a pdf file: ", e)
				)
				return;
				
			default: return;
		}
		
		if (!result) alert("Selecting or making a media file is failed!");
		else if (!result.cancelled)
        {
			checkFileAndUpload(result);
			/*getFileInfo(result.uri)
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
				(e)=> alert("Failed in getting a media file info: ", e)
			)*/
		}
	}
	
	const checkFileAndUpload = (result) =>
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
			(e)=> alert("Failed in getting a media file info: ", e)
		)
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
						  /*
            				if (result.type == 'video') 
            				{
					              setVideoData([{...imageMessage[0], video: url}]);
					              //alert("Oops!, sending video is not being perfomed!");
					        } 
					        else if (result.type == 'image')
					        {     
					              setImageData([{...imageMessage[0], image: url}]);
					        }
					        else if (result.type == 'pdf')
					        	setImageData([{...imageMessage[0], pdf: url}]);
					        */
					        
					        let fbMessage = null;
					        switch(result.type)
					        {
								case 'video': fbMessage = {...imageMessage[0], video: url}; break;
								case 'image': fbMessage = {...imageMessage[0], image: url}; break;
								case 'pdf': fbMessage = {...imageMessage[0], pdf: url}; break;
								default: console.error("Unexpected file type out of video, image, pdf!!!");
										break;
							}
							addDoc(collection(db, 'eyediagnosisChats'), fbMessage)
					    	.then
					    	(
								()=>console.log("[INFO]: a " + result.type + " file is added into firestore")
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
				            borderRadius: 22
		          	  }
		          }       	  
	              source={{ uri: currentMessage.video }}
	              useNativeControls
        		  resizeMode={ResizeMode.CONTAIN}
        		  isLooping={false}
	           /> 
	             
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

	const [pdfVisible, setPdfVisible] = React.useState(false);
    const renderBubble = (props) =>
    {
		if (props.currentMessage.pdf)
		{
			return (
				<TouchableOpacity
					onPress={()=>setPdfVisible(true)}	
				>
					<InChatViewFile props={props} visible={pdfVisible} onClose={()=>setPdfVisible(false)} />
					<View style={{flexDirection: 'column'}}>
					    <Image style={styles.pdfImage} source={require("../../../assets/images/pdf-image.png")} /> 
						<Text style={{color: 'gray'}}>Click to view PDF</Text>
					</View>
				</TouchableOpacity>
			);
		}
		else if (props.currentMessage.image || props.currentMessage.video)	
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
		else return (<Bubble {...props} renderMessageText={renderMessageText}/>); //right text
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
                    		  <Menu.Item leadingIcon='camera' title='Camera' onPress={()=>handleMedia('Camera')} />
                    		  <Menu.Item leadingIcon='image' 
                    		  			 title='Photos' 
                    		  			 onPress={()=>handleMedia(ImagePicker.MediaTypeOptions.Images)}
                    		  />
                    		  <Menu.Item leadingIcon='video' 
                    		  			 title='Video' 
                    		  			 onPress={()=>handleMedia(ImagePicker.MediaTypeOptions.Videos)} 
                    		  />
                    		  <Divider />
                    		  <Menu.Item leadingIcon='file' title='Pdf' onPress={()=>handleMedia('Pdf')} />
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
							return {
				                _id: doc.data()._id,
				                createdAt: doc.data().createdAt.toDate(),
				                text: doc.data().text,
				                image: doc.data().image,
				                video: doc.data().video,
				                pdf: doc.data().pdf,
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
	            renderLoadEarlier={renderLoading}
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
				parsePatterns=
				{
					(linkStyle) => 
					[
				        {
				          pattern: /#(\w+)/,
				          style: linkStyle,
				          onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
				        }
		      		]
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
        },
        pdfImage: 
        {
            alignSelf: 'center',
            width: 128,
            height: 128,
            resizeMode: 'contain',
            borderRadius: 0,
            marginBottom: 0
        }
    }
);