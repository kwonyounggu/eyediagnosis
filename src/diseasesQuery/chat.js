import React from "react";

//see https://initialcommit.com/blog/usestate-useeffect-hooks-react
//useEffect is most commonly used to execute code 
//when the component is initially rendered, when it is updated, and when it is unmounted
//useEffect accepts a function and a dependency array as arguments. The function will be executed when a variable in the dependency array changes. If no dependency array is provided, the function will run every time the component is re-rendered. If the dependency array is empty, the function will only be run when the component first mounts to the DOM. A common use case for an empty dependency array would be when fetching data from an API.
import {useCallback, useEffect, useRef, useState} from "react";
import {GiftedChat, IMessage} from "react-native-gifted-chat";
import {useChatGpt} from "react-native-chatgpt";
import { useChatGpt } from "../chatGpt";
//import {Snackbar} from "react-native-paper";
import {Dimensions, StyleSheet, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const CHAT_GPT_THUMBNAIL_URL =
  "https://styles.redditmedia.com/t5_7hqomg/styles/communityIcon_yyc98alroh5a1.jpg?width=256&s=cb48e1046acd79d1cc52b59b34ae56b0c1a9b4b8";

const CHAT_GPT_ID = "CHAT_GPT_ID";

const createBotMessage = (text) => 
{
    return (
        {
            _id: String(Date.now()),
            text,
            createdAt: new Date(),
            user: 
            {
                _id: CHAT_GPT_ID,
                name: 'react-native-chatgpt',
                avatar: CHAT_GPT_THUMBNAIL_URL,
            }
        }
    );
  };

  function print (messages)
  {
    messages.forEach
    (
        (element, index) => 
        {
            //console.log("["+index+"]: {_id: ", element._id, ", text: ", element.text, " user._id: ", element.user._id,"}");
        }
    );
  }

  const Chat = () =>
  {
        const {sendMessage} = useChatGpt();
        const inssets = useSafeAreaInsets();
        const [messages, setMessages] = useState();
        const [errorMessage, setErrorMessage] = useState("");
        const messageId = useRef("");
        const conversationId = useRef("");

        useEffect
        (
            () =>
            {
                console.log("useEffect [1] - here 0 - before setMessages(..)");
                setMessages([createBotMessage("Ask me anything :)")]);
            },
            [] //empty array, the function is only executed once when Chatcomponent first mounts.
        ); 

        useEffect
        (
            () =>
            {
                console.log("useEffect [2]");

                if (messages !== undefined) print(messages);

                if (messages && messages.length) //((messages != undefined || messages != null) && messages.length)
                {
                    const lastMessage = messages[0];

                    //if there exists lastMessage and its object is about 'Ask me anything then return
                    if (lastMessage.user._id === CHAT_GPT_ID) 
                    {
                        console.log("useEffect [2] - here 0 - lastMessage.user._id === CHAT_GPT_ID, so just return");
                        return;
                    }
                    
                    console.log("useEffect [2] - here 1 - just before setMessages()");
                    setMessages
                    ( 
                        (prevMessages) =>
                        [createBotMessage("..."), ...prevMessages]
                    );
                }
            },
            [messages] //if the messages state variable changes its value, then execute the function.
        );

        useEffect
        (
            () =>
            {
                console.log("useEffect [3]");
                if (messages !== undefined) print(messages);
                else 
                {
                    console.log("messages is null or undefined: ", messages);
                    return;
                }

                const lastMessage = messages[0];

                if (lastMessage &&
                    lastMessage.user._id === CHAT_GPT_ID &&
                    lastMessage.text === "..."
                    )
                {
                    console.log("useEffect [3], just before sendMessage(..) ");
                    sendMessage
                    (
                        {
                            message: messages[1].text,
                            options: messageId.current && conversationId.current ?
                                     {
                                        messageId: messageId.current,
                                        conversationId: conversationId.current
                                     } 
                                     :
                                     undefined,
                            onAccumulatedResponse:
                                     (accumulatedResponse) =>
                                     {
                                        messageId.current = accumulatedResponse.messageId;
                                        conversationId.current = accumulatedResponse.conversationId;

                                        if (accumulatedResponse.isDone) console.log("onAccumulatedResponse: ", accumulatedResponse);
                                        //Attach to last message
                                        setMessages
                                        (
                                            (previousMessages) =>
                                            {
                                                const newMessages = [...previousMessages];
                                                newMessages[0] =
                                                {
                                                    ...previousMessages[0],
                                                    text: accumulatedResponse.message
                                                };
                                                return newMessages;
                                            }
                                        );
                                     },
                            onError:
                                    (e) =>
                                    {
                                        setErrorMessage(`${e.statusCode} ${e.message}`);
                                        setMessages
                                        (
                                            (previousMessages) => 
                                            {
                                                const newMessages = [...previousMessages];

                                                newMessages[0] = 
                                                {
                                                    ...previousMessages[0],
                                                    text: "Sorry, I couldn't process your request"
                                                };
                                                return newMessages;
                                            }
                                        );
                                    }
                        }
                    ); //sendMessage()
                } //if statement
            },
            [messages] //if the messages state variable changes its value, then execute the function.
        ); //useEffect

        const onSend = useCallback
                       (
                            (msgs = []) => 
                            {
                                setMessages
                                (
                                    (previousMessages) =>
                                    {   
                                        let appendedMsg = GiftedChat.append(previousMessages, msgs);
                                        console.log("onSend = useCallback, appendedMsg: ", appendedMsg);
                                        return appendedMsg;
                                    }
                                );
                            }, 
                            []
                        );

        return (
            <View style={styles.conatainer}>
                <GiftedChat messages={messages} 
                            onSend={onSend}
                            user={{_id: 1}}
                />
                {/*
                <Snackbar visible={!!errorMessage}
                          onDismiss={()=>setErrorMessage("")}
                          style=
                            {
                                [
                                    styles.snackbar,
                                    {
                                        top: -Dimensions.get("window").height + inssets.top + 32
                                    }
                                 ]
                            }
                          duration={3000}
                >
                    {errorMessage}
                </Snackbar>   
                        */}
            </View>
        );
  };

  const styles = StyleSheet.create
  (
    {
        conatainer: {flex: 1},
        snackbar:
        {
            backgroundColor: "red",
            position: "absolute",
            left: 0,
            right: 0
        }
    }
  );

  export default Chat;
  

