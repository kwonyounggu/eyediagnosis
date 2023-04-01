import db from './SQLiteDatabase';
import { chatGptUserTable } from '../constants';

db.transaction
(
	(tx) =>
	{
		const sql = "CREATE TABLE IF NOT EXISTS " + chatGptUserTable + " " +
	  				"(" +
	  				"    id INTEGER PRIMARY KEY AUTOINCREMENT, " +
	  				"    email VARCHAR(255) NOT NULL UNIQUE, " +
	  				"    iat INTEGER, " +
	  				"    exp INTEGER" +
	  				")";
	    tx.executeSql(sql);
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
				        "INSERT INTO " + chatGptUserTable + " (email, iat, exp) values (?, ?, ?);",
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
						 "select * from " + chatGptUserTable + " where email=?;",
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
						 "update " + chatGptUserTable + " set iat=?, exp=? where email=?;",
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
						 "DROP TABLE " + chatGptUserTable + ";",
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

export default {insert, findByEmail, dropTable, update};