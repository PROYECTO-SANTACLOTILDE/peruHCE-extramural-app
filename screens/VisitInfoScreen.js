import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DB_NAME } from '../utils/constants';

//SQL Lite Screen
import * as SQLite from 'expo-sqlite';

export default function VisitInfoScreen() {

   
    //Data
    const [cohort, setCohort] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //Will consult the first form loaded in the system
    const consultCohort = async () => {
            setLoading(true);
            try {           
    
                //Open Database
                const db = await SQLite.openDatabaseAsync(DB_NAME);
    
                let cohortRow = await db.getFirstAsync('SELECT * FROM Cohort');
                setCohort(cohortRow);
                
                setError(null);
    
            } catch (err) {
              setError(err.message || 'Failed to consult data');
              console.error('Error consulting data:', err);
            } finally {
              setLoading(false);
            }
        }; 


    const onRefresh = async () => {
        setLoading(true);
        await consultCohort();
        setLoading(false);
    };
    
    useEffect(() => {
        consultCohort();
    }, []);

    //  Test String
    // <Text>{formString}</Text>

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>CARGANDO ...</Text>
            ) : (       
                cohort ? (
                    <View style={styles.container}>
                        {/* Cohort Name */}
                        <View style={styles.row}>
                            <Text style={styles.key}>Nombre Localidad: </Text>
                            <Text style={styles.value}>{cohort.name}</Text>
                        </View>
                        {/* Cohort Name */}
                        <View style={styles.row}>
                            <Text style={styles.key}>Descripción Localidad: </Text>
                            <Text style={styles.value}>{cohort.description}</Text>
                        </View>
                        {/* Location Assigned Description */}
                        <View style={styles.row}>
                            <Text style={styles.key}>Puesto designado: </Text>
                            <Text style={styles.value}>{cohort.location}</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.alertContainer}>
                        <Text style={styles.alert}> 
                            No hay Información cargada de visita
                        </Text>
                    </View>
                    
                )  
                
            ) }
        </View>

    );
}

//Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    alertContainer:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    key: {
        fontWeight: 'bold',
        marginRight: 8,
    },
    value: {
        color: 'gray',
    },
    alert: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
  });