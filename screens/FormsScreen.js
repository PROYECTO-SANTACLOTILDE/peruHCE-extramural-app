import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { API_BASE_URL, USER, PASSWORD, FORM_TEST_UUID, DB_NAME } from '../utils/constants';

//SQL Lite Screen
import * as SQLite from 'expo-sqlite';

//Dummy Data
import formDummy from "../utils/dummy/FormDummy.json"; 
import PatientListTable from '../components/PatientListTable';
import { FormBuilder } from '../components/FormBuilder';

export default function FormsScreen() {

    //Auth
    let base64 = require("base-64");
    
    //Patient List Data
    const [form, setForm] = useState(null);
    const [formString, setFormString] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchForm = async () => {
        const authString = base64.encode(USER + ":" + PASSWORD);
        try {
            setLoading(true);
            const response = await fetch(API_BASE_URL+'/o3/forms/'+FORM_TEST_UUID, {
                method: 'GET',
                headers: {
                'Authorization': `Basic ${authString}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
            });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        
        

        const jsonData = await response.json();   
        setFormString(JSON.stringify(jsonData, null, 2));
                
        setError(null);
        } catch (err) {
          setError(err.message || 'Failed to fetch data');
          console.error('Error fetching data:', err);
        } finally {
          setLoading(false);
        }
    };

    //Will consult the first form loaded in the system
    const consultFormTest = async () => {
            setLoading(true);
            try {           
    
                //Open Database
                const db = await SQLite.openDatabaseAsync(DB_NAME);
    
                let formRow = await db.getFirstAsync(`SELECT * FROM Form WHERE active = '1';`);

                //console.log('formRow: ',formRow);

                setForm(formRow);
                
                setError(null);
    
            } catch (err) {
              setError(err.message || 'Failed to consult data');
              console.error('Error consulting data:', err);
            } finally {
              setLoading(false);
            }
        }; 

    const fetchFormDummy = () => {
        setLoading(true);
        setForm(formDummy);
        setLoading(false);        
    };

    const onRefresh = async () => {
        setLoading(true);
        await fetchPatients();
        setLoading(false);
    };
    
    useEffect(() => {
        consultFormTest();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.alert} >
                    CARGANDO ...
                </Text>
            ) : (         
                form ? (
                    <FormBuilder formObject={form} />
                ) : (
                    <View style={styles.alertContainer}>
                        <Text style={styles.alert} >
                            No hay formularios cargados
                        </Text>
                    </View>                    
                )                
            ) }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    alertContainer:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    alert: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
    },
  });
