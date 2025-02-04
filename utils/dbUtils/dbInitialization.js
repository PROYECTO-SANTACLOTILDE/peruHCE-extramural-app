
//Import initialization scripts
import { PatientTableScript, UserTableScript } from './dbInitializationScripts';



export function initializeDatabase(db) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // User Table
      tx.executeSql(UserTableScript);

      // Patient Table
      tx.executeSql(PatientTableScript);
      
    }, reject, resolve);
  });
}

export function getDatabase() {
  return db;
}
