import React from 'react';
import 
{
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Text
} from 'react-native';
import PDFReader from 'rn-pdf-reader-js';

function InChatViewFile({props, visible, onClose}) 
{	  console.log("pdf visible: ", props.currentMessage.document);
	  const {currentMessage} = props;
	  return (
	    <Modal
	      visible={visible}
	      onRequestClose={onClose}
	      animationType="slide"
	      style={{height: 600, width: '100%'}}
	    >

	        <Text>{props.currentMessage.document}</Text>
	        <TouchableOpacity onPress={onClose} style={styles.buttonCancel}>
	          <Text style={styles.textBtn}>X</Text>
	        </TouchableOpacity>
	    
	    </Modal>
	  );
}

/*
function InChatViewFile({props, visible, onClose}) 
{	  console.log("pdf visible: ", props.currentMessage.document);
	  const {currentMessage} = props;
	  return (
	    <Modal
	      visible={visible}
	      onRequestClose={onClose}
	      animationType="slide"
	      style={{height: 600, width: '100%'}}
	    >

	        <PDFReader source={{uri: currentMessage.document}} style={{width: '100%', height: '100%'}}/>
	        <TouchableOpacity onPress={onClose} style={styles.buttonCancel}>
	          <Text style={styles.textBtn}>X</Text>
	        </TouchableOpacity>
	    
	    </Modal>
	  );
}
*/
const styles = StyleSheet.create
(
	{
		  buttonCancel: 
		  {
		    width: 35,
		    height: 35,
		    borderRadius: 50,
		    justifyContent: 'center',
		    alignItems: 'center',
		    position: 'absolute',
		    borderColor: 'black',
		    left: 13,
		    top: 20
		  },
		  textBtn: 
		  {
		    fontSize: 18,
		    fontWeight: 'bold',
		    color: 'black'
		  }
	}

);

export default InChatViewFile;