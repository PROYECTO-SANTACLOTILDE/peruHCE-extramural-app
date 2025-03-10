import * as Crypto from 'expo-crypto';

export async function writeUserDB(db, nuUser, nuPassword) {
    try {
        //Encrypt password
        const digest = await Crypto.digestStringAsync( Crypto.CryptoDigestAlgorithm.SHA256, nuPassword );
        const result = await db.runAsync('INSERT INTO User (username, password, active) VALUES (?,?,?)', nuUser, digest,'1');
        if(result.changes === 0) throw new Error("Variable value not updated in DB, check writeLog function.");
        console.log("Saved user: ",nuUser, " ",digest)
        return result; 

    }catch(error){
        throw new Error("Variable value not updated in DB, check writeLog function.");
    }       
}