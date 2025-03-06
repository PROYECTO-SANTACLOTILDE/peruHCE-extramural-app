import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList, ScrollView } from "react-native";

//SQL Lite
import { useSQLiteContext } from 'expo-sqlite';

import { useNavigation } from '@react-navigation/native';

export const Login = () => {
    
    const [loading, setLoading] = useState(true);
    const [usersData, setUsersData] = useState([]);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    //Open Database
    const db = useSQLiteContext();

    const navigation = useNavigation();

    const consultUsers = async () => {
        
        try {     
            setLoading(true);      

            let usersRows = await db.getAllAsync("SELECT * FROM User WHERE active = '1';");

            usersRows !== undefined ? setUsersData(usersRows) : setUsersData([]);

            console.log("Users: ",usersRows);
            
            setError(null);

        } catch (err) {
            throw new Error('Error consulting Log data from db.');
        } finally {
            setLoading(false);
        }
    }; 

    useEffect(() => {
        consultUsers();
    }, []);

    const onSubmit = () => {
        if (!username || !password) {
            Alert.alert("Error", "Please enter both username and password");
            return;
        }
        Alert.alert("Login Successful", `Welcome, ${username}!`);
        navigation.navigate("Inicio");
    };
 
    return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
        

    );
};

  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    input: {
      width: "100%",
      padding: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      marginBottom: 10,
    },
    button: {
      backgroundColor: "blue",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      width: "100%",
    },
    buttonText: {
      color: "white",
      fontSize: 16,
    },
  });





