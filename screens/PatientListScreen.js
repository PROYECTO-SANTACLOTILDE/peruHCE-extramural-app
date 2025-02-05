import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';


//Dummy Data
import patientListDummy from "../utils/dummy/ListPatientsDummy.json"; 
import { PatientListTableDB } from '../components/PatientListTable';

//SQL Lite Screen
import { useSQLiteContext } from 'expo-sqlite';

export default function PatientListScreen() {

    const db = useSQLiteContext();
    
    //Patient List Data
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const consultPatients = async () => {
        
        try {          
            setLoading(true); 

            //Open Database
            //const db = await SQLite.openDatabaseAsync(DB_NAME);

            let patientList = await db.getAllAsync(`SELECT * FROM Patient WHERE active = '1';`);

            setPatients(patientList);
            
            setError(null);

        } catch (err) {
          setError(err.message || 'Failed to consult data');
          console.error('Error consulting data:', err);
        } finally {
          setLoading(false);
        }
    };

    const fetchPatientsDummy = () => {
        setLoading(true);
        setPatients(patientListDummy);
        console.log(patientListDummy);
        setLoading(false);        
    };

    const onRefresh = async () => {
        setLoading(true);
        await fetchPatients();
        setLoading(false);
    };
    
    useEffect(() => {
        consultPatients();
    }, []);

    return (
        <View style={styles.container}>            
            {loading ? (
                <Text style={styles.alert}>
                    Cargando ...
                </Text>
            ) : (          
                patients.length === 0 ? (
                    <View style={styles.alertContainer}>
                        <Text style={styles.alert}>
                            No hay pacientes cargados en el dispositivo
                        </Text> 
                    </View>                    
                ) :          
                <PatientListTableDB patientList={patients} /> 
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