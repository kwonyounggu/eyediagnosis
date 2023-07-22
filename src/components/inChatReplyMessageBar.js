import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';

import { replyMessageBarHeight } from '../constants'

/*
 * https://medium.com/@ravil.nell/react-native-chat-reply-on-swipe-like-in-telegram-9083f83f180c
	type ReplyMessageBarProps = 
	{
	  clearReply: () => void;
	  message: { text: string };
	};
*/
const ReplyMessageBar = ({ clearReply, message }) => 
{
	//console.log("[INFO] in ReplyMessageBar, message: ", message);
  return(
	 <View style={{flexDirection: 'column'}}>
	 	<View><Text style={{paddingLeft: 10, fontWeight: 'bold'}}>Reply to {message?.user?.name}</Text></View>
	    <View style={styles.container} >
	      <View style={styles.replyImageContainer} >
	        <Image
	          style={styles.replyImage}
	          source={require('../../assets/images/reply.png')}
	        />
	      </View>
	
	      <View style={styles.messageContainer}>
	        <Text numberOfLines={1} ellipsizeMode='tail' >
	        {
				message.document ? message.fileName :
				message.image ? 'Photo' : message?.text
			}
			</Text>
	      </View>
	
	      <TouchableOpacity style={styles.crossButton} onPress={clearReply}>
	        <Image
	          style={styles.crossButtonIcon}
	          source={require('../../assets/images/cross-button.png')}
	        />
	      </TouchableOpacity>
	    </View>  
	 </View>
  );


}

export default ReplyMessageBar;

const styles = StyleSheet.create
(
	{
		  container: 
		  {
		    flexDirection: 'row',
		    alignItems: 'center',
		    paddingVertical: 8,
		    borderBottomWidth: 1,
		    borderBottomColor: 'lightgrey',
		    height: replyMessageBarHeight
		  },
		  replyImage: 
		  {
		    width: 20,
		    height: 20
		  },
		  replyImageContainer: 
		  {
		    paddingLeft: 8,
		    paddingRight: 6,
		    borderRightWidth: 2,
		    borderRightColor: '#2196F3',
		    marginRight: 6,
		    height: '100%',
		    justifyContent: 'center'
		  },
		  crossButtonIcon: 
		  {
		    width: 24,
		    height: 24
		  },
		  crossButton: 
		  {
		    padding: 4
		  },
		  messageContainer: 
		  {
		    flex: 1
		  }
	}
);