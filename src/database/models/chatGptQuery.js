import * as SQLite from 'expo-sqlite';
import {BaseModel, types} from 'expo-sqlite-orm';
import { chatGptDbName, chatGptQueryTable } from '../constants';

export default class ChatGptQuery extends BaseModel
{
	constructor(obj)
	{
		super(obj);
	}
	
	static get database()
	{
		return async () => SQLite.openDatabase(chatGptDbName);
	}
	
	static get tableName()
	{
		return chatGptQueryTable;
	}
	
	static get columnMapping()
	{
		return {
					id: {type: types.INTEGER, primary_key: true, autoincrement: true},
					age: {type: types.NUMERIC, not_null: true},
					gender: {type: types.TEXT, not_null: true},
					medicalHistory: {type: types.TEXT, not_null: false},
					symptoms: {type: types.TEXT, not_null: true},
					signs: {type: types.TEXT, not_null: true},
					chatGptResponse: {type: types.TEXT, not_null: true},
					queryDate: {type: types.INTEGER, default: ()=>Date.now()},
					userId: {type: types.INTEGER, not_null: true}
		       }
	}
}