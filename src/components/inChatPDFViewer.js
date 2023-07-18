import * as React from 'react';
import 
{
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Text
} from 'react-native';
import PDFReader from 'rn-pdf-reader-js';

export default function ChatPDFViewer ({route, navigation})
{
	const {document} = route.params;
	//console.log("ChatPDFViewer: document=", document);
	
	
	React.useEffect
	(
		() =>
		{
			navigation.setOptions
	        (
				{
					headerTitle: () => <Text>&nbsp;file name</Text>,
					headerLeft: () => <Text onPress={()=>navigation.goBack()}>&#x2190;&nbsp;PDF</Text>
		        }
		    )
		 },[]
	)
	return (<PDFReader source={{uri: document}} style={{width: '100%', height: '100%'}}/>);
}