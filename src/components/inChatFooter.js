import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const renderFooter = (props) =>
{
	console.log("renderFooter: ", props.currentMessage);
	const replyTo = 'someone';
	const replyMsg = 'bra bra bra';
	
	return(
	<View style={{height: 50, flexDirection: 'row'}}>
        <View style={{height:50, width: 5, backgroundColor: 'red'}}></View>
        <View style={{flexDirection: 'column'}}>
            <Text style={{color: 'red', paddingLeft: 10, paddingTop: 5}}>{replyTo}</Text>
            <Text style={{color: 'gray', paddingLeft: 10, paddingTop: 5}}>{replyMsg}</Text>
        </View>
        <View style={{flex: 1,justifyContent: 'center',alignItems:'flex-end', paddingRight: 10}}>
            <TouchableOpacity onPress={()=>{}}>
                <Ionicons name="x" type="feather" color="#0084ff" />
            </TouchableOpacity>
        </View>
      </View>
     );
}