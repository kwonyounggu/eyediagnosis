import React from 'react';

const AppContext = React.createContext();
const AppConsumer = AppContext.Consumer;

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
        chatGptUser: {}
    };
  }

  actions = 
  {
    onUpdateText: 
        (text) => 
        {
            this.setState({inputText: text,});
        },
     onUpdateChatGptUser:
     	(user) =>
		{
			//user={email: "kwon.younggu@gamil.com", iat: 1679877172, exp: 1681086772}
			console.log("user: ", user);
			this.setState({chatGptUser: user})
		}	 
		
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
export { AppContext, AppConsumer, AppProvider };