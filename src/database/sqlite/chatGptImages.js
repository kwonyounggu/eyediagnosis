//https://stackoverflow.com/questions/52910469/how-can-we-insert-an-image-in-sqlite-databasetable
//However, it's not really recommended to store images but to rather store the path to the image and then retrieve the file when you want to display/use the image.

import db from './SQLiteDatabase';
import {chatGptImageTable, chatGptQueryTable} from '../constants';


db.transaction
(
	(tx) =>
	{
		const sql = "CREATE TABLE IF NOT EXISTS " + chatGptImageTable + " " +
	  				"(" +
	  				"    id INTEGER PRIMARY KEY AUTOINCREMENT, " +
	  				"    imageFilePath VARCHAR(255) NOT NULL UNIQUE, " +
	  				"    queryId INTEGER, " +
	  				" 	 FOREIGN KEY(queryId) REFERENCES " + chatGptQueryTable +" (id)" +
	  				")";
	    tx.executeSql(sql,[],(_, result)=>console.log(result), (_, err)=>console.error(err));
	}
);

const insert = (user) =>
{
	return new Promise
	(
		(resolve, reject) => 
		{
		    db.transaction
		    (
				(tx) => 
			    {
				      tx.executeSql
				      (
				        "INSERT INTO " + chatGptImageTable + " (email, iat, exp) values (?, ?, ?);",
				        [user.email, user.iat, user.exp],
				        //-----------------------
				        (_, { rowsAffected, insertId }) => 
				        {
				          if (rowsAffected > 0) resolve(insertId);
				          else reject("Error inserting user: " + JSON.stringify(user));
				        },
				        (_, error) => reject(error)
				      );
			    }
			);
	  	}
  	);	
};


const findByEmail = (email) =>
{
	return new Promise
	(
		(resolve, reject) => 
		{
		    db.transaction
		    (
				(tx) => 
			    {
				      tx.executeSql
				      (
						 "select * from " + chatGptImageTable + " where email=?;",
				        [email],
				        //-----------------------
				        (_, { rows }) => 
				        {
				          if (rows.length > 0) resolve(rows._array[0]);
				          else resolve({}); //no record but no error
				        },
				        (_, error) => reject(error)
				      );
			    }
			);
	  	}
  	);	
};

const getAll = () =>
{
	return new Promise
	(
		(resolve, reject) => 
		{
		    db.transaction
		    (
				(tx) => 
			    {
				      tx.executeSql
				      (
						 "select * from " + chatGptImageTable + ";",
				        [],
				        (_, {rows}) => resolve(rows._array),
				        (_, error) => reject(error)
				      );
			    }
			);
	  	}
  	);	
};

const update = (user) =>
{
	return new Promise
	(
		(resolve, reject) => 
		{
		    db.transaction
		    (
				(tx) => 
			    {
				      tx.executeSql
				      (
						 "update " + chatGptImageTable + " set iat=?, exp=? where email=?;",
				        [user.iat, user.exp, user.email],
				        //-----------------------
				        (_, {rowsAffected}) => 
				        {
							//console.log("update: ", rowsAffected, ", ", insertId);
				          if (rowsAffected > 0) resolve(rowsAffected);
          				  else reject("Error updating user: " + user.email);
				        },
				        (_, error) => reject(error)
				      );
			    }
			);
	  	}
  	);	
};

const dropTable = () =>
{
	return new Promise
	(
		(resolve, reject) => 
		{
		    db.transaction
		    (
				(tx) => 
			    {
				      tx.executeSql
				      (
						 "DROP TABLE " + chatGptImageTable + ";",
				        [],
				        //-----------------------
				        (_, { rows }) => resolve(rows._array),
				        (_, error) => reject(error)
				      );
			    }
			);
	  	}
  	);	
};

export default {insert, findByEmail, dropTable, update, getAll};