import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';


//SQL Lite
import { useSQLiteContext } from 'expo-sqlite';

export default function LoginScreen() {

    //Open Database
    const db = useSQLiteContext();
    
    //Patient List Data
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);


  
    useEffect(() => {

    }, []);

    return (
        <View style={styles.container}>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
