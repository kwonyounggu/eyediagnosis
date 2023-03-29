//import {enablePromise, openDatabase, SQLiteDatabase} from 'react-native-sqlite-storage';

import * as SQLite from 'expo-sqlite';


/**
 * Notice that this is referenced from https://blog.logrocket.com/using-sqlite-with-react-native/
 */
const chatGptDbName = 'chatGptDatabase.db';

const chatGptUserTable = 'chatGptUserTable';
const chatGptQueryTable = 'chatGptQueryTable';


//what is the return value if failed?
export const getDBConnection = () => 
{
  	return SQLite.openDatabase(chatGptDbName);
};


export const createChatGptUserTable = (db) => 
{
  // create table if not exists
  const query = 
  "CREATE TABLE IF NOT EXISTS " + chatGptUserTable + " " +
  "(userId INTEGER PRIMARY KEY AUTOINCREMENT, userEmail VARCHAR(255));";
 
  db.transaction
  (
	  (tx) => {tx.executeSql(query)}
  );
};

export const getUserTableRecords = (db) =>
{
	let records = undefined;
	const query = "select * from " + chatGptUserTable;
	
	db.transaction
	(
		(tx) => 
		{
			tx.executeSql
			(
				query, 
				null, 
				(_, resultSet) => records = resultSet.rows._array,
				(_, error) => console.error(error)
				
			)
		}
	);
	
	return records;
}

export const insertIntoUserTable = (db, email) =>
{
	let record = undefined;
	const query = "insert into " + chatGptUserTable + " values (?)";
	
	db.transaction
	(
		(tx) => 
		{
			tx.executeSql
			(
				query, 
				[email], 
				(txObj, resultSet) => record = {userId: resultSet.insertId, userEmail: email},
				(txObj, error) => console.error(error)
				
			)
		}
	);
	
	return record;
}
/*
export const createChatGptQueryTable = async (db: SQLiteDatabase) => 
{
  // create table if not exists
  const query = 
  "CREATE TABLE IF NOT EXISTS " + chatGptQueryTable + " " +
  "(queryId INTEGER PRIMARY KEY AUTOINCREMENT, " +
  " age INT2, " +
  " gender VARCHAR(1), " +
  " medicalHistory TEXT, " +
  " symptoms TEXT, " +
  " signs TEXT, " +
  " chatGptResponse TEXT, " +
  " queryDate DATE, " +
  " queryUserId INTEGER);";

  await db.executeSql(query);
};
*/
/*
export const createChatGptQueryTable = async (db: SQLiteDatabase) => 
{
  // create table if not exists
  const query = 
  "CREATE TABLE IF NOT EXISTS " + chatGptQueryTable + " " +
  "(queryId INTEGER PRIMARY KEY AUTOINCREMENT, " +
  " age INT2, " +
  " gender VARCHAR(1), " +
  " medicalHistory TEXT, " +
  " symptoms TEXT, " +
  " signs TEXT, " +
  " chatGptResponse TEXT, " +
  " queryDate DATE, " +
  " queryUserId INTEGER, " +
  " FOREIGN KEY(queryUserId) REFERENCES " + chatGptUserTable +" (userId));";

  await db.executeSql(query);
};
*/
/*
//We can use rowid, which comes with SQLite, as the primary key. 
export const getDiagnosedRecords = async (db: SQLiteDatabase): Promise<DiagnosedRecord[]> => 
{
  try 
  {
    const diagnosedRecords: DiagnosedRecord[] = [];
    const sqlStatement = "select * from " + chatGptQueryTable;
    const results = await db.executeSql(sqlStatement);
    results.forEach
    (
		(result) => 
		{
      		for (let index = 0; index < result.rows.length; index++) 
      		{
        		diagnosedRecords.push(result.rows.item(index))
      		}
    	}
    );
    return diagnosedRecords;
  } 
  catch (error) 
  {
    console.error(error);
    throw Error('Failed to get diagnosedRecords !!!');
  }
};
*/
/*
export const saveDiagnosedRecords = async (db: SQLiteDatabase, diagnosedRecords: DiagnosedRecord[]) => 
{
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(rowid, value) values` +
    diagnosedRecords.map(i => `(${i.id}, '${i.value}')`).join(',');

  return db.executeSql(insertQuery);
};
*/
/*
export const insertDiagnosedRecord = async (db: SQLiteDatabase, diagnosedRecord: DiagnosedRecord) => 
{
  const insertQuery =
  	"insert into " + chatGptQueryTable + " values (" + diagnosedRecord.queryId + ", " +
  												       diagnosedRecord.age + ", " +
  												 "'" + diagnosedRecord.gender + "', " +
  												 "'" + diagnosedRecord.medicalHistory + "', " +
  												 "'" + diagnosedRecord.symptoms + "', " +
  												 "'" + diagnosedRecord.signs + "', " +
  												 "'" + diagnosedRecord.chatGptResponse + "', " +
  												 "'" + diagnosedRecord.queryDate + "')";

  return db.executeSql(insertQuery);
};
*/
/*
export const insertDiagnosedRecord = async (db: SQLiteDatabase, diagnosedRecord: DiagnosedRecord) => 
{
  const insertQuery =
  	"insert into " + chatGptQueryTable + " values (" + diagnosedRecord.queryId + ", " +
  												       diagnosedRecord.age + ", " +
  												 "'" + diagnosedRecord.gender + "', " +
  												 "'" + diagnosedRecord.medicalHistory + "', " +
  												 "'" + diagnosedRecord.symptoms + "', " +
  												 "'" + diagnosedRecord.signs + "', " +
  												 "'" + diagnosedRecord.chatGptResponse + "', " +
  												 "'" + diagnosedRecord.queryDate + "', " +
  												       diagnosedRecord.queryUserId + ")";

  return db.executeSql(insertQuery);
};
*/

/*
export const deleteDiagnosedRecord = async (db: SQLiteDatabase, id: number) => 
{
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  await db.executeSql(deleteQuery);
};

export const deleteTable = async (db: SQLiteDatabase) => 
{
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};
*/