import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { DB_NAME } from '../utils/constants';

//SQL Lite
import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';

//Dummy Data
import { VariableEditor } from '../components/VariableEditor';

export default function ConfigurationScreen() {

    //Open Database
    const db = useSQLiteContext();
    
    //Patient List Data
    const [configVariables, setConfigVariables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const consultConfigVariables = async () => {
        setLoading(true);
        try {           

            let variablesRows = await db.getAllAsync("SELECT * FROM Variable WHERE active = '1';");

            setConfigVariables(variablesRows);
            
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
        await consultConfigVariables();
        setLoading(false);
    };
    
    useEffect(() => {
        consultConfigVariables();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.alertContainer}>
                    <Text style={styles.alert} >
                        CARGANDO ...
                    </Text>
                </View>
            ) : (         
                configVariables ? (
                    <VariableEditor 
                        variableList={configVariables} 
                        refreshVariables={consultConfigVariables}
                    />                    
                ) : (
                    <View style={styles.alertContainer}>
                        <Text style={styles.alert} >
                            No hay variables configuradas. Recomendamos reinstalar la aplicación.
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
