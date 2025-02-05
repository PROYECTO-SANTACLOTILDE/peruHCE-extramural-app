import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';


//SQL Lite
import { useSQLiteContext } from 'expo-sqlite';

//Dummy Data
import { VariableEditor } from '../components/VariableEditor';
import { LogVisor } from '../components/LogVisor';

export default function LogScreen() {

    //Open Database
    const db = useSQLiteContext();
    
    //Patient List Data
    const [logData, setlogData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const consultLogs = async () => {
        
        try {     

            setLoading(true);      

            let logsRows = await db.getAllAsync("SELECT * FROM Log WHERE active = '1';");

            setlogData(logsRows);
            //console.log('logRows: ',logsRows);
            
            setError(null);

        } catch (err) {
            throw new Error('Error consulting Log data from db.');
        } finally {
            setLoading(false);
        }
    }; 

   
    useEffect(() => {
        consultLogs();
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
                logData.length > 0 ? (
                    <LogVisor 
                        logData={logData} 
                    />                    
                ) : (
                    <View style={styles.alertContainer}>
                        <Text style={styles.alert} >
                            No se encontraron logs en el sistema.
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
