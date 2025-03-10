import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';

import { cleanDB, fillDummyCohort, fillDummyForm, fillDummyPatients, fillDummyVariables, resetDB_user_version } from '@Utils/dbUtils/fillDummyData.js';
import { COLOR_DARK_GREEN, COLOR_RED, COLOR_WHITE } from '@Utils/constants';

//Expo Router
import { useRouter } from 'expo-router';

//Expo SQL Lite
import { useSQLiteContext } from 'expo-sqlite';

export default function homeScreen() {
    
    const db = useSQLiteContext();
    const router = useRouter();
    
    return (
          <View style={styles.container}> 
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {/* Lista de Pacientes */}
              <TouchableOpacity
                key={1}
                style={styles.button}
                onPress={() => router.push(buttonsInfo[0].screen)}
              >
                <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
                  {buttonsInfo[0].name}
                </Text>
              </TouchableOpacity>
              {/* Formularios */}
              <TouchableOpacity
                key={2}
                style={styles.button}
                onPress={() => router.push(buttonsInfo[1].screen)}
              >
                <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
                  {buttonsInfo[1].name}
                </Text>
              </TouchableOpacity>
              {/* Editar Encuentro */}
              <TouchableOpacity
                key={3}
                style={styles.button}
                onPress={() => router.push(buttonsInfo[2].screen)}
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
                  onPress={() => router.push(buttonsInfo[3].screen)}
                >
                  <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
                    {buttonsInfo[3].name}
                  </Text>
                </TouchableOpacity>
                {/* Información de visita */}
                <TouchableOpacity
                  key={5}
                  style={styles.button}
                  onPress={() => router.push(buttonsInfo[4].screen)}
                >
                  <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
                    {buttonsInfo[4].name}
                  </Text>
                </TouchableOpacity>
                {/* Configuración */}
                <TouchableOpacity
                  key={6}
                  style={styles.button}
                  onPress={() => router.push(buttonsInfo[5].screen)}
                >
                  <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
                    {buttonsInfo[5].name}
                  </Text>
                </TouchableOpacity>
                {/* Visor de Logs */}
                <TouchableOpacity
                  key={7}
                  style={styles.button}
                  onPress={() => router.push(buttonsInfo[6].screen)}
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
                  onPress={() => router.push(db)}
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
              {/* Show DB_Key */}
              <TouchableOpacity
                  key={7}
                  style={styles.buttonDev}
                  onPress={() => logDB_KEY()}
                >
                <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
                  SHOW DB_KEY
                </Text>
              </TouchableOpacity>
              {/* Erase DB_Key */}
              <TouchableOpacity
                  key={8}
                  style={styles.buttonDev}
                  onPress={() => eraseDB_KEY(db)}
                >
                <Text style={{ color: 'white', fontWeight: '300', textAlign: 'center' }}>
                  ERASE DB_KEY
                </Text>
              </TouchableOpacity>
            </View>
          </View>
      )
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
    { name: 'Lista de Pacientes',     screen: 'patientListScreen' },
    { name: 'Formularios',            screen: 'formsScreen' },
    { name: 'Editar Encuentro',       screen: 'editEncounterScreen' },
    { name: 'Ajuste de Visita',       screen: 'visitSettingsScreen' },
    { name: 'Información de visita',  screen: 'visitInfoScreen' },
    { name: 'Configuración',          screen: 'settingsScreen' },
    { name: 'Visor de Logs',          screen: 'logsScreen' },
  ];