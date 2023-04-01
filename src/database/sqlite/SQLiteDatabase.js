import * as SQLite from 'expo-sqlite'
import { chatGptDbName } from '../constants';
const db = SQLite.openDatabase(chatGptDbName)

export default db;