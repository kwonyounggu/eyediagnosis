import React, { createContext } from 'react';
import storage from './storage';

const AppContext = React.createContext();
const AppConsumer = AppContext.Consumer;

var chatGptUserQueryIds = [];

storage.getIdsForKey('chatGptUser').then
(
  (ids) => {console.log("chatGptUserQueryIds: ", ids); chatGptUserQueryIds = ids;}
)
.catch
(
  (error) => 
  {
    console.warn("chatGptUserQueryIds: ", error.message);
    switch(error.name)
    {
      case 'NotFoundError': console.log("chatGptUserQueryIds: not found");
                            break;
      default: console.log("chatGptUserQueryIds: unknown error, ", error.name); 
               break;
    }
  }
)
/**
 * https://github.com/hyochan/react-native-training/blob/master/react-native-global-state.md#context-api
 */
class AppProvider extends React.Component
{
  constructor(props) 
  {
    super(props);
    this.state = 
    {
        inputText: '',
        chatGptUserQueryIds: chatGptUserQueryIds,
        nextChatGptUserQueryId: chatGptUserQueryIds.length > 0 ? (parseInt(chatGptUserQueryIds.slice(-1)) + 1) : 10000
    };
  }

  actions = 
  {
    onUpdateText: 
        (text) => 
        {
            this.setState({inputText: text,});
        },
    onIncreaseLastChatGptUserQueryId:
        (currentChatGptUserQueryId) => this.setState({nextChatGptUserQueryId: currentChatGptUserQueryId + 1}),
    onUpdateChatGptUserQueryIds:
        (currentId) => this.setState({chatGptUserQueryIds: [...this.state.chatGptUserQueryIds, currentId]})
  };

  render() 
  {
    const { state, actions } = this;
    const store = { state, actions };
    return (
      <AppContext.Provider value={store}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
export { AppConsumer, AppProvider };