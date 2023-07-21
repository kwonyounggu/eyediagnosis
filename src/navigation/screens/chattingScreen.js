import * as React from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, Text, Platform, LogBox } from 'react-native';
//import { Avatar } from 'react-native-elements';
import { AppContext } from '../../contexts/appProvider';
import { auth, db, app } from '../../firebase/firebase';
//import { signOut } from 'firebase/auth';
import { Bubble, GiftedChat, InputToolbar, MessageImage } from 'react-native-gifted-chat';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
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
//import InChatViewFile from '../../components/inChatViewFile';
import { onPressAvatar } from '../../components/inChatRender';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ReplyMessageBar from '../../components/inChatReplyMessageBar';
import { renderMessageText } from '../../components/inChatMessage';
import { imageViewerScreenName, pdfFileViewerScreenName } from '../../constants';

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
 *
 * mac simulator
 * https://stackoverflow.com/questions/1108076/where-does-the-iphone-simulator-store-its-data?rq=3
 */

const FILE_SIZE_MAX = 5120000; //4MB
const FILE_SIZE_MAX_S = ( FILE_SIZE_MAX >>> 20 ) + '.' + ( FILE_SIZE_MAX & (2*0x3FF ) ) + 'MB';
//console.log("FILE_SIZE_MAX: ", FILE_SIZE_MAX_S);

LogBox.ignoreLogs([ 'Non-serializable values were found in the navigation state', ]);

export default function ChattingScreen({navigation})
{
	//console.log("INFO in ChattingScreen: ", React.useContext(AppContext));
	
    const [messages, setMessages] = React.useState([]);
    //const [popupVisible, setPopupVisible] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [replyMessage, setReplyMessage] = React.useState(null);
	
	
	const insets = useSafeAreaInsets();
	
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
		//setPopupVisible(false);
		
		let result = null;
		
		switch(option)
		{
			case 'Images':  
			case 'Videos': 
					ImagePicker.launchImageLibraryAsync
					(
						{
							mediaTypes: option,
			            	allowsEditing: true,
			            	aspect: [4, 3],
			            	base64: true,
			            	quality: 1
						}
					)
					.then
					(
						(result) =>
						{
							if (!result.canceled) checkFileAndUpload(result);
						}
					)
					.catch
					(
						(e) => alert("Failed in getting an image/video file: ", e)
					)
					break;	
			case 'Camera': 
				try
				{
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
					if (!result.canceled) checkFileAndUpload(result);
				}
				catch (e)
				{
					alert("Failed in cameraPermissionsAsync/launchCameraAsync: ", e);
				}
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
					{	console.log("pdf result: ", result);
						if (result.type === 'success') 
						{
							checkFileAndUpload({assets: [{uri: result.uri, type: 'pdf', fileSize: result.size, fileName: result.name}]});
						}
					}
				)
				.catch
				(
					(e) => alert("Failed in getting a pdf file: ", e)
				)
				break;
				
			default: break;
		}
	}
	
	const checkFileAndUpload = (result) =>
	{	//console.log("result: ", Object.keys(result.assets[0]));
		getFileInfo(result.assets[0].uri)
		.then
		(
			(fileInfo) =>
			{   
				if (fileInfo.size > FILE_SIZE_MAX)
					alert("File size must be smaller than " + FILE_SIZE_MAX_S + "!");
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
		console.log("result: ", Object.keys(result));

		const imageMessage = 
        [
          {
            _id: uuid.v4(),
            createdAt: new Date(),
            [result.assets[0].type]: result.assets[0].uri, //local path
            user,
            ...(result.assets[0].fileName && {fileName: result.assets[0].fileName})
          }
        ];
        setMessages(previousMessages => GiftedChat.append(previousMessages, imageMessage))
		
		setLoading(true);
		const fetchResponse = await fetch(result.assets[0].uri);
		const blob = await fetchResponse.blob();
		const filename = result.assets[0].uri.substring(result.assets[0].uri.lastIndexOf('/') + 1);
		const storage = getStorage(app);
        const storageRef = ref(storage, result.assets[0].type +'s/' + filename); //eg: images/imageFileName.jpg, videos/videoFileName.mp4
        
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
					        let fbMessage = null;
					        switch(result.assets[0].type)
					        {
								case 'video': fbMessage = {...imageMessage[0], video: url}; break;
								case 'image': fbMessage = {...imageMessage[0], image: url}; break;
								case 'pdf': fbMessage = 
											{
												_id: imageMessage[0]._id,
												createdAt: imageMessage[0].createdAt,
												user: imageMessage[0].user,
											    document: url,
											    fileName: imageMessage[0].fileName
											}; 
											break;
								default: console.error("Unexpected file type out of video, image, pdf!!!");
										break;
							}
							addDoc(collection(db, 'eyediagnosisChats'), fbMessage)
					    	.then
					    	(
								()=>console.log("[INFO]: a " + result.assets[0].type + " file is added into firestore")
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

	/** *
	 * Uncomment if video is needed
	 * 
    const renderMessageVideo = (props) => 
    {
        const { currentMessage } = props;
        //console.log(currentMessage.video);

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
	*/
	//see https://github.com/FaridSafi/react-native-gifted-chat/issues/1950
	const renderMessageImage = (props) => 
    {	    
	    if (props.currentMessage.image)
		{	
			return (
				<TouchableOpacity
					onPress=
					{
						()=>navigation.navigate(imageViewerScreenName, {image: props.currentMessage.image, fileName: props.currentMessage.fileName})
					}	
					onLongPress=
					{
						()=>setReplyMessage(props.currentMessage)
					}
				>
					
					<View style={{flexDirection: 'column'}}>
					    <Image 
						    style=
						    {
								{
						            borderRadius: 14,
						            height: 150,
						            width: 200,
						            marginBottom: -5
						        }
						    }
					    	source={{uri: props.currentMessage.image}} /> 
						<Text style={{color: 'grey'}} numberOfLines={1} ellipsizeMode={'tail'}>{props.currentMessage.fileName}</Text>
					</View>
				</TouchableOpacity>
				);
		}
    }
    
    const renderBubble = (props) =>
    {   //if (props.currentMessage.document) console.log("renderBubble: <<<<<", props.currentMessage.document);
		
		if (props.currentMessage.image || props.currentMessage.video || props.currentMessage.document)	
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
			return (<Bubble {...props} wrapperStyle={{left: {backgroundColor: '#e4e7eb'}}}/>);
		else return (<Bubble {...props} />); //right text
	}
	
	const renderLoading = () => 
	{
		//console.log("renderLoading ()................");
	    return (
	      <View style={styles.loadingContainer}>
	        <ActivityIndicator size="large" color="#6646ee" />
	      </View>
	    );
	}
	
	const clearReplyMessage = () => setReplyMessage(null);
	
	const renderCustomInputToolbar = (props) =>
	(
		<InputToolbar 
			{...props} 
			containerStyle={styles.inputContainer} 
			accessoryStyle={styles.replyBarContainer}
		/>	
	);
	
	const renderAccessory = () =>
	(
		replyMessage && <ReplyMessageBar
			message={replyMessage}
			clearReply={clearReplyMessage}
		/>	
	);
	
	const renderCustomViewPdf = (props) =>
	{ 
		
		if (props.currentMessage.document)
		{	//console.log("renderCustomViewPdf: props.currentMessage>>>>", props.currentMessage);
		    //console.log("[INFO], ref: ", giftedChatRef.current);
			return (
				<TouchableOpacity
					onPress=
					{
						()=>navigation.navigate(pdfFileViewerScreenName, {document: props.currentMessage.document, fileName: props.currentMessage.fileName})
					}	
					onLongPress=
					{
						()=>setReplyMessage(props.currentMessage)
					}
				>
					
					<View style={{flexDirection: 'column'}}>
					    <Image style={styles.pdfImage} source={require("../../../assets/images/pdf-image.png")} /> 
						<Text style={{color: 'grey'}} numberOfLines={1} ellipsizeMode={'tail'}>{props.currentMessage.fileName}</Text>
					</View>
				</TouchableOpacity>
				);
		}
	}
	
	/*
	const mediaCallback = React.useCallback
	(
		(option) =>handleMedia(option),
		[]
	);*/
	const tempF = () =>
	{
		console.log("Scroll test", Object.keys(giftedChatRef.current._listRef._scrollRef));
		/*giftedChatRef.current?._messageContainerRef?.current?.scrollToIndex
		(
			{
		        animated: true,
		        index: 5,
	      	}
	    );
	    */
	    giftedChatRef.current.scrollToIndex({index: 8, viewOffset: 0, viewPosition: 1});
	}
	const onViewableItemsChanged = ({viewableItems}) => 
	{
	  // Do stuff
	  	console.log("", viewableItems);
	};
	
	const giftedChatRef = React.useRef();
	React.useEffect
    (
		() =>
		{
			//this param function will be called from the header bar
			navigation.setParams({handleMedia, scroll: tempF})
		}, []
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
				                ...(doc.data().text && {text: doc.data().text}),
				                ...(doc.data().image && {image: doc.data().image}),
				                ...(doc.data().video && {video: doc.data().video}),
				                ...(doc.data().document && {document: doc.data().document}),
				                ...(doc.data().fileName && {fileName: doc.data().fileName}),
				                user: doc.data().user,
				                ...(doc.data().replyMessage && {replyMessage: doc.data().replyMessage})
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
        	
        	if (replyMessage) console.log("replyMassge: ", replyMessage);
        	
        	addDoc(collection(db, 'eyediagnosisChats'), {_id, createdAt, text, user, ...(replyMessage && {replyMessage})})
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
			setReplyMessage(null);
    	}, [replyMessage]
    );
    //DEFAULT_BOTTOM_TABBAR_HEIGHT = 50
    //bottomOffset={Platform.OS==='ios' ? (50+insets.bottom) : 0}, to solve a gap between bottom textinput and keyboard
    return (		
		<View style={{flex: 1}}>
	        <GiftedChat
	            messageContainerRef={giftedChatRef}
	            messages={messages}
	            showAvatarForEveryMessage={true}
	            onSend={messages => onSend(messages)}
	            renderUsernameOnMessage={false}
	            disableComposer={false}
	            user={user}
	            renderMessageVideo={()=>{}}
	            renderMessageImage={renderMessageImage}
	            renderMessageText={renderMessageText}
	            renderCustomView={renderCustomViewPdf}
	            renderLoading={renderLoading}
	            isLoadingEarlier={true}
	            renderBubble={renderBubble} 
	            bottomOffset={Platform.OS==='ios' ? (50+insets.bottom) : 0}
	            maxInputLength={1024} 
	            onPressAvatar={onPressAvatar}
        		
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
		      	isKeyboardInternallyHandled={false}
		      	renderInputToolbar={renderCustomInputToolbar}
		      	renderAccessory={renderAccessory}
		      	onLongPress={(_, message) => setReplyMessage(message)}
		      	messagesContainerStyle={styles.messagesContainer}
		      	renderFooter={()=>{}}
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
        },
        inputContainer:
        {
			position: 'relative',
			flexDirection: 'column-reverse'
		},
		replyBarContainer:
		{
			height: 'auto'
		},
		messagesContainer:
		{
			flex: 1
		},
		replyMessageContainer:
		{
			padding: 8,
			paddingBottom: 0
		},
		replyMessageDivider:
		{
			borderBottomWidth: 1,
			borderBottomColor: 'lightgrey',
			paddingTop: 6
		}
    }
);