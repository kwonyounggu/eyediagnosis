/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { View, Text } from 'react-native';
import { Avatar, Bubble, SystemMessage, Message, MessageText } from 'react-native-gifted-chat';

export const renderAvatar = (props) => (
  <Avatar
    {...props}
    containerStyle={{ left: { borderWidth: 3, borderColor: 'red' }, right: {} }}
    imageStyle={{ left: { borderWidth: 3, borderColor: 'blue' }, right: {} }}
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
          <View style={{backgroundColor: '#005CB5', borderRadius: 15}}>
            <View style={{flexDirection: 'row'}}>
              <View
	                style=
	                {
						{
			                  height: '100%',
			                  width: 10,
			                  backgroundColor: '#00468A',
			                  borderTopLeftRadius: 15,
			                  borderBottomLeftRadius: 15
	                	}
	                }
              />
              <View style={{flexDirection: 'column'}}>
                <Text
	                  style=
	                  {
						  {
			                    color: 'white',
			                    paddingHorizontal: 10,
			                    paddingTop: 5,
			                    fontWeight: '700'
	                  		}
	                  }
                 >
                  {props.currentMessage?.replyMessage?.user.name}
                </Text>
                <Text
	                  style=
	                  {
						  {
			                    color: 'white',
			                    paddingHorizontal: 10,
			                    paddingTop: 5,
			                    marginBottom: 5
	                  	  }
	                  }
                 >
                  {props.currentMessage?.replyMessage?.text}
                </Text>
              </View>
            </View>
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
