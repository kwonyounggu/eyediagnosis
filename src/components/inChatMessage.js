/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Avatar, Bubble, SystemMessage, Message, MessageText } from 'react-native-gifted-chat';

export const renderAvatar = (props) => (
  <Avatar
    {...props}
    containerStyle={{ left: { borderWidth: 0, borderColor: 'red' }, right: {} }}
    imageStyle={{ left: { borderWidth: 0, borderColor: 'blue' }, right: {} }}
  />
);

export const renderBubble = (props) => (
  <Bubble
    {...props}
    // renderTime={() => <Text>Time</Text>}
    // renderTicks={() => <Text>Ticks</Text>}
    containerStyle={{
      left: { borderColor: 'teal', borderWidth: 8 },
      right: {},
    }}
    wrapperStyle={{
      left: { borderColor: 'tomato', borderWidth: 4 },
      right: {},
    }}
    bottomContainerStyle={{
      left: { borderColor: 'purple', borderWidth: 4 },
      right: {},
    }}
    tickStyle={{}}
    usernameStyle={{ color: 'tomato', fontWeight: '100' }}
    containerToNextStyle={{
      left: { borderColor: 'navy', borderWidth: 4 },
      right: {},
    }}
    containerToPreviousStyle={{
      left: { borderColor: 'mediumorchid', borderWidth: 4 },
      right: {},
    }}
  />
);

export const renderSystemMessage = (props) => (
  <SystemMessage
    {...props}
    containerStyle={{ backgroundColor: 'pink' }}
    wrapperStyle={{ borderWidth: 10, borderColor: 'white' }}
    textStyle={{ color: 'crimson', fontWeight: '900' }}
  />
);

export const renderMessage = (props) => (
  <Message
    {...props}
    // renderDay={() => <Text>Date</Text>}
    containerStyle={{
      left: { backgroundColor: 'lime' },
      right: { backgroundColor: 'gold' },
    }}
  />
);

//see https://github.com/FaridSafi/react-native-gifted-chat/issues/750
export const renderMessageText = (props) => 
{
    if (props.currentMessage.replyMessage) 
    {
      return <CustomMessageText {...props} />;
    }
    return <MessageText {...props} />;
}

const CustomMessageText = (props) => 
{
    return (
      <>
        <View style={{padding: 5}}>
          <View 
	          style=
	          {
				  {
					  //backgroundColor: '#005CB5', 
	          		  borderRadius: 15
	          	  }
	          }
          >
          <TouchableOpacity
					onPress=
					{
						()=>props.goToMessage(props.currentMessage?.replyMessage?._id, props.currentMessage?._id)
					}	
				>
            <View style={{flexDirection: 'column'}}>
                <Text
	                  style=
	                  {
						  {
			                    //color: 'white',
			                    paddingHorizontal: 10,
			                    paddingTop: 5,
			                    fontWeight: '700'
	                  		}
	                  }
	                  numberOfLines={1} ellipsizeMode={'tail'}
                 >
                  {"Reply to " + props.currentMessage?.replyMessage?.user.name}
                </Text>
                <Text
                	  numberOfLines={1} ellipsizeMode='tail'
	                  style=
	                  {
						  {
			                    color: '#443355',
			                    fontSize: 12,
			                    paddingHorizontal: 10,
			                    paddingTop: 5,
			                    marginBottom: 5
	                  	  }
	                  }
                 >
                  {
					  //props.currentMessage?.replyMessage?.document ? props.currentMessage?.replyMessage?.fileName :
					  //props.currentMessage?.replyMessage?.image ? 'Photo' : props.currentMessage?.replyMessage?.text
					  (props.currentMessage?.replyMessage?.document || props.currentMessage?.replyMessage?.image) ? 
					   props.currentMessage?.replyMessage?.fileName : props.currentMessage?.replyMessage?.text
                  }
                </Text>
              </View>
			</TouchableOpacity>
          </View>
        </View>

        <MessageText {...props} />
      </>
    );
  }


export const renderCustomView = ({ user }) => (
  <View style={{ minHeight: 20, alignItems: 'center' }}>
    <Text>
      Current user:
      {user.name}
    </Text>
    <Text>From CustomView</Text>
  </View>
);
