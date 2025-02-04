
//Import initialization scripts
import { DB_NAME } from '../constants';





export async function updateVariableDb (variable, db) {

    if(variable === null )              throw new Error("Variable received to update in DB is null.");
    if(variable.id  === undefined)      throw new Error("Variable id received to update in DB is null.");
    if(variable.value  === undefined)   throw new Error("Variable value to update in DB is null.");
    
    const resultDB = await db.runAsync('UPDATE Variable SET value = ? WHERE id = ?', variable.value , variable.id);
    if(resultDB.changes === 0) throw new Error("Variable value not updated in DB, check update function.");
    return resultDB;
}

