import * as React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native'
//import { AppContext } from "../../contexts/appProvider";
import ChatGptUser from '../database/models/chatGptUser';
import ChatGptQuery from '../database/models/chatGptQuery';

const DbTransactions = () =>
{
	//const db = React.useContext(AppContext).state.chatGptDb;
	console.log("Date.now: ", Date.now, ", Date.now(): ", Date.now());
	const [user, setUser] = React.useState([]);
	const [query, setQuery] = React.useState([]);
	
	const createUserTable = React.useCallback
	(
		async () =>
		{
			await ChatGptUser.createTable();;
			Alert.alert("chatGptUserTable is created");
		}, []	
	);
	
	const createQueryTable = React.useCallback
	(
		async () =>
		{
			await ChatGptQuery.createTable();
			Alert.alert("chatGptQueryTable is created");
		}, []	
	);
	
	const insertUserRecord = React.useCallback
	(
		async () =>
		{
			//await ChatGptUser.dropTable();
			
			const props =
			{
				email: 'kwon.younggu@gmail.com'
			};
			ChatGptUser.create(props);
			setUser(await ChatGptUser.query());
			
		}, []	
	);
	
	const insertQueryRecord = React.useCallback
	(
		async () =>
		{
			//await ChatGptQuery.dropTable();
			
			const props =
			{
				age: 77,
				gender: 'female',
				symptoms: 'headache',
				signs: 'VA 20/30',
				chatGptResponse: 'verylong text',
				queryDate: Date.now(),
				userId: 1
			};
			ChatGptQuery.create(props);
			setQuery(await ChatGptQuery.query());
			
		}, []	
	);
	
	return (
	    <View style={styles.container}>
	      <TouchableOpacity style={{ padding: 20 }} onPress={createUserTable}>
	        <Text>Create user table</Text>
	      </TouchableOpacity>
	      <TouchableOpacity style={{ padding: 20 }} onPress={insertUserRecord}>
	        <Text>Insert a user</Text>
	      </TouchableOpacity>
	      <TouchableOpacity style={{ padding: 20 }} onPress={createQueryTable}>
	        <Text>Create Query table</Text>
	      </TouchableOpacity>
	      <TouchableOpacity style={{ padding: 20 }} onPress={insertQueryRecord}>
	        <Text>Insert a query</Text>
	      </TouchableOpacity>
	      <ScrollView style={{ flex: 1 }}>
	        {
	          user.map(user => <Text key={user.id}>{JSON.stringify(user)}</Text>) &&
	          query.map(query => <Text key={query.id}>{JSON.stringify(query)}</Text>)
	        }
	      </ScrollView>
	    </View>
	  );

}

const styles = StyleSheet.create
(
	{
		  container: 
		  {
		    flex: 1,
		    backgroundColor: '#fff',
		    alignItems: 'center',
		    justifyContent: 'center',
		    paddingTop: 40
		  }
	}
);

export default DbTransactions;