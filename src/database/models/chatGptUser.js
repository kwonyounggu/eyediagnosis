import * as SQLite from 'expo-sqlite';
import {BaseModel, types} from 'expo-sqlite-orm';
import { chatGptDbName, chatGptUserTable } from '../constants';

export default class ChatGptUser extends BaseModel
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
		return chatGptUserTable;
	}
	
	static get columnMapping()
	{
		return {
					id: {type: types.INTEGER, primary_key: true, autoincrement: true},
					email: {type: types.TEXT, not_null: true},
					iat: {type: types.INTEGER},
					exp: {type: types.INTEGER}
		       }
	}
	static checkTableExist() 
	{
      const sql = "select * from " + chatGptUserTable;
      return this.repository.databaseLayer
	        .executeSql(sql)
	        .then(({ rows }) => rows)
	        .catch(error => JSON.stringify(error));

        
	}
	static getAllCatatanById(id, user_id) 
	{
	    const sql = 'select * from tbl_catatan where video_id = ? AND user_id = ? ORDER BY id DESC'
	    const params = [id, user_id]
	    return this.repository.databaseLayer
	      .executeSql(sql, params)
	      .then(({ rows }) => rows)
	}
	
	static getTopCatatanById(id, user_id) 
	{
	     const sql = 'select * from tbl_catatan where video_id = ? AND user_id = ? ORDER BY id DESC LIMIT 3'
	     const params = [id,user_id]
	     return this.repository.databaseLayer
	       .executeSql(sql, params)
	       .then(({ rows }) => rows)
	}
	
	static deleteSoalByKuis(id_user,id_kuis)
	{
        const sql = 'DELETE FROM tbl_soal WHERE user_id = ? AND kuis_id = ?'
        const params = [id_user,id_kuis]
        return this.repository.databaseLayer.executeSql(sql, params).then(({ rows }) => rows)
    }
}