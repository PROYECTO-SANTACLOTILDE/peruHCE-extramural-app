import { Stack } from 'expo-router';

import { createContext, useContext } from 'react';

//Expo SQL Lite
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

// Expo Secure Store
import * as SecureStore from 'expo-secure-store';



//Others
import { DB_NAME } from '@Utils/constants';
import { CohortTableScript, EncounterAttributesTableScript, FormTableScript, LogTableScript, ObservationTableScript, ObservationValueTableScript, PatientTableScript, UserTableScript, VariablesTableScript, VisitAttributesTableScript, VisitTableScript } from '@Utils/dbUtils/dbInitializationScripts';

const AuthContext = createContext(null);

export default function ExtramuralLayout() {  
  return (
    <AuthContext.Provider value="test">
      <SQLiteProvider databaseName={DB_NAME} onInit={migrateDbIfNeeded}> 
          
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="patientListScreen" />
              <Stack.Screen name="formsScreen" />
              <Stack.Screen name="settingsScreen" />
              <Stack.Screen name="homeScreen" />
            </Stack>
          
      </SQLiteProvider>
    </AuthContext.Provider>
  );
}

async function migrateDbIfNeeded(db) {

  //DB_KEY
  let value = "";

  console.log("MIGRATE DB");
  try {
    const db_key = await SecureStore.getItemAsync("DB_KEY");
    value = db_key;    
  } catch (e) {
    return;
  }

  console.log("Starting Database");
  console.log("Using key: ",value);
  const DATABASE_VERSION = 1;

  let firstQuery  =  await db.execAsync(`PRAGMA key = '${value}';`);
  let secondQuery =  await db.execAsync("PRAGMA journal_mode = WAL");
  let thirdQuery  =  await db.execAsync("PRAGMA foreign_keys = ON");

  let result =  await db.getFirstAsync('PRAGMA user_version');
  let currentDbVersion = result.user_version;
  console.log('InDevice: ',currentDbVersion,' Version: ',DATABASE_VERSION);  
  
  console.log('Creating database on init');
  /* if (currentDbVersion >= DATABASE_VERSION) {
    console.log('Not creating tables');
    return;
  } */
  

  if (currentDbVersion === 0) {
    console.log("Creating Tables");
    let finalScript = PatientTableScript + 
                      UserTableScript +
                      FormTableScript +
                      ObservationTableScript +
                      ObservationValueTableScript +
                      CohortTableScript + 
                      VisitTableScript +                       
                      VisitAttributesTableScript +
                      VariablesTableScript + 
                      EncounterAttributesTableScript +
                      LogTableScript;
    
    await db.execAsync(finalScript);

    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }

  //await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  
  console.log("Ended Initializing DB");

  
}