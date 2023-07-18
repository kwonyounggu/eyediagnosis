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
					headerTitle: () => <Text>PDF</Text>
		        }
		    )
		 },[]
	)
	return (<PDFReader source={{uri: document}} style={{width: '100%', height: '100%'}}/>);
}