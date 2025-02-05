import React, {useState, useEffect} from 'react';

import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from "react-native-safe-area-context";

//Expo SQL Lite
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

//Expo screen rotation
import * as ScreenOrientation from "expo-screen-orientation";


//Screens
import { COLOR_DARK_GREEN, COLOR_RED, COLOR_WHITE, DB_NAME } from './utils/constants';
import { cleanDB, fillDummyCohort, fillDummyForm, fillDummyPatients, fillDummyVariables, resetDB_user_version } from './utils/dbUtils/fillDummyData.js';
import { CohortTableScript, EncounterAttributesTableScript, EraseRowsTablesScript, FormTableScript, LogTableScript, PatientTableScript, UserTableScript, VariablesTableScript, VisitAttributesTableScript, VisitTableScript } from './utils/dbUtils/dbInitializationScripts';
import FormsScreen from './screens/FormsScreen';
import PatientListScreen from './screens/PatientListScreen';
import VisitInfoScreen from './screens/VisitInfoScreen';
import ConfigurationScreen from './screens/ConfigurationScreen';
import LogScreen from './screens/LogScreen.js';

const Stack = createNativeStackNavigator();



const HomeButtonGrid = () => {

  const db = useSQLiteContext();
  const navigation = useNavigation();

  return (
    <View style={styles.container}> 
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {/* Lista de Pacientes */}
        <TouchableOpacity
          key={1}
          style={styles.button}
          onPress={() => navigation.navigate(buttonsInfo[0].screen)}
        >
          <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
            {buttonsInfo[0].name}
          </Text>
        </TouchableOpacity>
        {/* Formularios */}
        <TouchableOpacity
          key={2}
          style={styles.button}
          onPress={() => navigation.navigate(buttonsInfo[1].screen)}
        >
          <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
            {buttonsInfo[1].name}
          </Text>
        </TouchableOpacity>
        {/* Editar Encuentro */}
        <TouchableOpacity
          key={3}
          style={styles.button}
          onPress={() => navigation.navigate(buttonsInfo[2].screen)}
        >
          <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
            {buttonsInfo[2].name}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
          {/* Ajuste de Visita */}
          <TouchableOpacity
            key={4}
            style={styles.button}
            onPress={() => navigation.navigate(buttonsInfo[3].screen)}
          >
            <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
              {buttonsInfo[3].name}
            </Text>
          </TouchableOpacity>
          {/* Información de visita */}
          <TouchableOpacity
            key={5}
            style={styles.button}
            onPress={() => navigation.navigate(buttonsInfo[4].screen)}
          >
            <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
              {buttonsInfo[4].name}
            </Text>
          </TouchableOpacity>
          {/* Configuración */}
          <TouchableOpacity
            key={6}
            style={styles.button}
            onPress={() => navigation.navigate(buttonsInfo[5].screen)}
          >
            <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
              {buttonsInfo[5].name}
            </Text>
          </TouchableOpacity>
          {/* Visor de Logs */}
          <TouchableOpacity
            key={7}
            style={styles.button}
            onPress={() => navigation.navigate(buttonsInfo[6].screen)}
          >
            <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
              {buttonsInfo[6].name}
            </Text>
          </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {/* Fill dummy patient data */}
        <TouchableOpacity
            key={1}
            style={styles.buttonDev}
            onPress={() => fillDummyPatients(db)}
          >
          <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
            Llenar pacientes dummy
          </Text>
        </TouchableOpacity>
        {/* Reset user_version*/}
        <TouchableOpacity
            key={2}
            style={styles.buttonDev}
            onPress={() => resetDB_user_version(db)}
          >
            <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
              Resetear DB
            </Text>
        </TouchableOpacity>
         {/* Empty db tables*/}
         <TouchableOpacity
            key={3}
            style={styles.buttonDev}
            onPress={() => cleanDB(db)}
          >
            <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
              Limpiar DB
            </Text>
        </TouchableOpacity>
        {/* Fill dummy form data */}
        <TouchableOpacity
            key={4}
            style={styles.buttonDev}
            onPress={() => fillDummyForm(db)}
          >
          <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
            Llenar form dummy
          </Text>
        </TouchableOpacity>
        {/* Fill dummy cohort visit data */}
        <TouchableOpacity
            key={5}
            style={styles.buttonDev}
            onPress={() => fillDummyCohort(db)}
          >
          <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
            Llenar cohort visit dummy
          </Text>
        </TouchableOpacity>
        {/* Fill dummy variables */}
        <TouchableOpacity
            key={6}
            style={styles.buttonDev}
            onPress={() => fillDummyVariables(db)}
          >
          <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
            Llenar variables dummy
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function App() {
  
  useEffect(() => {
    const unlockOrientation = async () => {      
      await ScreenOrientation.unlockAsync();
    };
    
    unlockOrientation();
  }, []);

  return (
      <SQLiteProvider databaseName={DB_NAME} onInit={migrateDbIfNeeded}>
        <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Inicio" component={HomeButtonGrid} />
              <Stack.Screen name="Lista de Pacientes" component={PatientListScreen} />
              <Stack.Screen name="Formularios Cargados" component={FormsScreen} />
              <Stack.Screen name="Ajuste de Visita" component={VisitInfoScreen} />
              <Stack.Screen name="Configuración" component={ConfigurationScreen} />
              <Stack.Screen name="Visor de Logs" component={LogScreen} />
              {/*<Stack.Screen name="Screen5" component={Screen5} />
              <Stack.Screen name="Screen6" component={Screen6} /> */}
            </Stack.Navigator>     
        </NavigationContainer>  
      </SQLiteProvider>
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
  }
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

  //.env DB_KEY variable
  const dbKey = process.env.EXPO_PUBLIC_DB_KEY;

  console.log("Starting Database");
  console.log("Using key: ",dbKey);
  const DATABASE_VERSION = 1;
  let first =  await db.execAsync(`PRAGMA key = '${dbKey}';`);
  let result = await db.getFirstAsync('PRAGMA user_version');
  let currentDbVersion = result.user_version;
  console.log('InDevice: ',currentDbVersion,' Version: ',DATABASE_VERSION);
  
  
  console.log('Creating database on init');
  /* if (currentDbVersion >= DATABASE_VERSION) {
    console.log('Not creating tables');
    return;
  } */
  

  if (currentDbVersion === 0) {
    console.log("Creating Tables");
    let finalScript = "PRAGMA journal_mode = 'wal';" + 
                      PatientTableScript + 
                      UserTableScript +
                      FormTableScript +
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

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  
  console.log("Ended Initializing DB");

  
}

