import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';

//Expo Router
import { useNavigation, useRouter  } from 'expo-router';

//Expo SQL Lite
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

//Expo screen rotation
import * as ScreenOrientation from "expo-screen-orientation";

// Expo Secure Store
import * as SecureStore from 'expo-secure-store';

//Expo Crypto
import * as Crypto from 'expo-crypto';

//Expo Async Storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//Screens
import { COLOR_DARK_GREEN, COLOR_RED, COLOR_WHITE, DB_NAME } from '@Utils/constants';
import { cleanDB, fillDummyCohort, fillDummyForm, fillDummyPatients, fillDummyVariables, resetDB_user_version } from '@Utils/dbUtils/fillDummyData.js';
import { CohortTableScript, EncounterAttributesTableScript, EraseRowsTablesScript, FormTableScript, LogTableScript, ObservationTableScript, ObservationValueTableScript, PatientTableScript, UserTableScript, VariablesTableScript, VisitAttributesTableScript, VisitTableScript } from '@Utils/dbUtils/dbInitializationScripts';


import { Login } from '@Components/Login.js';

async function eraseDB_KEY() {
  try {
    await SecureStore.deleteItemAsync("DB_KEY");
    console.log("Secure variable erased.");
  } catch (error) {
    console.error("Error erasing value:", error);
  }
}

const WaitScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.alertContainer}>
          <Text style={styles.alert} >
            INICIANDO APLICACIÓN ...
          </Text>
      </View>
    </View>
  );
}


const LoginComponent = () => {
  return (
    <Login> </Login>
  );
}

const KeyCheckerComponent = () => {
  const [password, setPassword] = useState(null);
  const [keyFound, setKeyFound] = useState(null);
  const [inputPassword, setInputPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    
    //Function to get the DB_Key
    const getKey = async () => {
      try {
        const db_key = await SecureStore.getItemAsync("DB_KEY");
        console.log("Secure store returned: ",db_key);
        if (db_key) {
          setKeyFound(true);
          console.log("Found DB_KEY: " + db_key);
          setPassword(db_key);
          router.push('/(extramural)'); 
        } else {
          setKeyFound(false);
          console.log("DB_KEY not set yet");
        }
      } catch (error) {
        throw new Error("No DB_KEY could be retrieved from device.");
      }
    }

    //Set to permit the device to rotate
    const unlockOrientation = async () => {      
      await ScreenOrientation.unlockAsync();
    };
    
    unlockOrientation();
    getKey();
  }, []);

  const handlePasswordSubmit = async () => {
    console.log("DB_KEY to save: ",inputPassword);
    try {
      await SecureStore.setItemAsync('DB_KEY', inputPassword);
      //console.log("Saved key: ",test);
      setPassword(true);
      setKeyFound(true);
      router.push('/(extramural)'); 
    } catch (error) {
      throw new Error("DB_KEY couldnt be saved using safe storage.");
    }    
  };

  const cleanDBKey = async () => {
    try {
      await SecureStore.deleteItemAsync("DB_KEY");
      console.log("DB_KEY cleaned",test);
    } catch (error) {
      throw new Error("DB_KEY couldnt be cleaned using safe storage.");
    }    
  };

  return (
    <View style={styles.container}>

      { (keyFound === null && password === null) && 
        (
          <WaitScreen />
        )
      }  
      { ( keyFound === false && password === null ) && 
        (
          <View style={styles.container}>
            <Text>Establezca la contraseña de la base de datos:</Text>
            <TextInput
              style={styles.input}
              value={inputPassword}
              onChangeText={setInputPassword}
            />
            <Button title="Guardar" onPress={handlePasswordSubmit} />
          </View>
        )
      }
      
    <Text>CARGANDO ....</Text>  
    <Text>Key: {keyFound ? keyFound.toString() : "null"}</Text>
    <Text>Password: {password ? password.toString() : "null"}</Text>
    <Button title="Clean DB_KEY" onPress={cleanDBKey} />

  </View>
  );
}


async function logDB_KEY() {
  try {
    const value = await SecureStore.getItemAsync("DB_KEY");
    if (value) {
      console.log("DB_KEY value:", value);
    } else {
      console.log("No value found in SecureStore.");
    }
  } catch (error) {
    console.error("Error retrieving value:", error);
  }
}

export default function Page() {
  return (
    <KeyCheckerComponent></KeyCheckerComponent> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: COLOR_DARK_GREEN,
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    maxWidth: 130,
    justifyContent: 'center',
    margin: 10,
    textAlign: 'center' 
  },
  buttonDev: {
    backgroundColor: COLOR_RED,
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    maxWidth: 130,
    justifyContent: 'center',
    margin: 10,
    textAlign: 'center' 
  },
  input: {
    width: 250,
    height: 50,
    borderWidth: 2, // Border thickness
    borderColor: "black", // Black border color
    borderRadius: 8, // Optional: rounded corners
    paddingHorizontal: 10, // Space inside the input
    fontSize: 16,
    backgroundColor: "white", // Optional: Background color
  },
});

const buttonsInfo = [
  { name: 'Lista de Pacientes',     screen: 'Lista de Pacientes' },
  { name: 'Formularios',            screen: 'Formularios Cargados' },
  { name: 'Editar Encuentro',       screen: 'Screen3' },
  { name: 'Ajuste de Visita',       screen: 'Ajuste de Visita' },
  { name: 'Información de visita',  screen: 'Screen5' },
  { name: 'Configuración',          screen: 'Configuración' },
  { name: 'Visor de Logs',          screen: 'Visor de Logs' },
];

async function migrateDbIfNeeded(db) {

  //DB_KEY
  let value = "";

  try {
    const db_key = await SecureStore.getItemAsync("DB_KEY");
    value = dbKey;    
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
