import * as SQLite from 'expo-sqlite'
import { localDbName, chatGptDbName } from '../constants';
//console.log("localDbName: ", localDbName);

const db = SQLite.openDatabase(chatGptDbName);

//console.log("db: ", db);

export default db;