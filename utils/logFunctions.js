export async function writeLog(db, type, content) {
    try {
        if(type === null) throw error('Log received a null type.');
        if(type === "") throw error('Log received an empty type.');
        if(content === null) throw error('Log received a null content.');

        const isoDate = new Date().toISOString();

        const result = await db.runAsync('INSERT INTO Log (type, content, dateTime, active) VALUES (?,?,?,?)', type, content,new Date().toISOString(),'1');
        if(result.changes === 0) throw new Error("Variable value not updated in DB, check writeLog function.");
        return result; 

    }catch(error){
        throw new Error("Variable value not updated in DB, check writeLog function.");
    }   

    
}