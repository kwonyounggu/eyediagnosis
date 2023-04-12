import db from './SQLiteDatabase';
import { chatGptQueryTable, chatGptUserTable } from '../constants';


db.transaction
(
	(tx) =>
	{
	  	const sql = "CREATE TABLE IF NOT EXISTS " + chatGptQueryTable + " " +
					  "(" +
					  "      id INTEGER PRIMARY KEY AUTOINCREMENT, " +
					  " 	 age INT2, " +
					  " 	 gender VARCHAR(1), " +
					  " 	 medicalHistory TEXT, " +
					  " 	 symptoms TEXT, " +
					  " 	 signs TEXT, " +
					  " 	 chatGptResponse TEXT, " +
					  " 	 queryDate DATE, " +
					  " 	 userId INTEGER NOT NULL, " +
					  " 	 FOREIGN KEY(userId) REFERENCES " + chatGptUserTable +" (id)" +
					  ");";	
		tx.executeSql(sql,[],(_, result)=>console.log(result), (_, err)=>console.error(err));
	}
);

const insert = (patient) =>
{
	return new Promise
	(
		(resolve, reject) => 
		{
		    db.transaction
		    (
				(tx) => 
			    {
					  /**
					   * Note that the following statement doesn't work properly all the time
					   * const params = Object.values(patient);
					   */
					  
					  /**
					   * Note that the contents of params may contain [ or ] then it could be problem without
					   * inserting and without error
					   */
					  
					  const params = Object.values(patient);
					  //const params = [patient.age, patient.gender, patient.medicalHistory, patient.symptoms, patient.signs, patient.chatGptResponse, patient.userId];
					  console.log("[here before insert into chatGptQueryTable]:\n", params);
					  //[patient.age, patient.gender, patient.medicalHistory, patient.symptoms, patient.signs, patient.chatGptResponse, patient.userId]
				      tx.executeSql
				      (
				        "INSERT INTO " + chatGptQueryTable + 
				        " (age, gender, medicalHistory, symptoms, signs, chatGptResponse, queryDate, userId) values" +
				        " (?, ?, ?, ?, ?, ?, ?, ?);",
				        params,
				        (_, {rowsAffected, insertId}) => 
				        {
				          if (rowsAffected > 0) resolve(insertId);
				          else reject("Error inserting a patient info: " + JSON.stringify(patient));
				        },
				        (_, error) => reject(error)
				      );
			    }
			);
	  	}
  	);	
};

//change or discard
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
						 "select * from " + chatGptQueryTable + ";",
				        [],
				        (_, {rows}) => resolve(rows._array),
				        (_, error) => reject(error)
				      );
			    }
			);
	  	}
  	);	
};

const getById = (userId) =>
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
						 "select * from " + chatGptQueryTable + " where userId=?;",
				        [userId],
				        (_, {rows}) => resolve(rows._array),
				        (_, error) => reject(error)
				      );
			    }
			);
	  	}
  	);	
};

const getNumberOfRows = () =>
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
						 "select count(*) as numRows from " + chatGptQueryTable + ";",
				        [],
				        (_, {rows:{_array}}) => resolve(_array[0].numRows),
				        (_, error) => reject(error)
				      );
			    }
			);
	  	}
  	);	
};

//change or discard
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

//change or discard
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
						 "DROP TABLE " + chatGptQueryTable + ";",
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

export default {insert, getById, dropTable, update, getAll, getNumberOfRows};