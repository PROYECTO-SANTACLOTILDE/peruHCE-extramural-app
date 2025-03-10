import React, {useState, useEffect, createContext, useContext} from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList, ScrollView } from "react-native";

import * as Crypto from 'expo-crypto';

//SQL Lite
import { useSQLiteContext } from 'expo-sqlite';

import { useRouter  } from 'expo-router';

import { writeUserDB } from '@Utils/userFunctions';

const AuthContext = createContext();

export const Login = () => {
    
    const [loading, setLoading] = useState(true);
    const [usersData, setUsersData] = useState([]);
    const [userFound, setUserFound] = useState(null);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    //Open Database
    const db = useSQLiteContext();

    const router = useRouter();

    const consultUsers = async () => {        
      try {     
          setLoading(true);     
          console.log("GETTING USERS");
          let usersRows = await db.getAllAsync("SELECT * FROM User WHERE active = '1';");
          console.log("Users: ", usersRows);
          if( usersRows.length === 0 ){
            setUserFound(false);
            setLoading(false);            
          }else{
            setUserFound(true);
            setUsersData(usersRows);
            setLoading(false);          
          }          
      } catch (err) {
        throw new Error('Error consulting Log data from db.');
      } finally {
        setError(null);
        setLoading(false);
      }
    }; 

    useEffect(() => {
      consultUsers();
    }, []);

    const onSubmit = async () => {
      if (!username || !password) {
        Alert.alert("Error", "Ingrese un usuario y contraseña");
        return;
      }
      try{
        //Check if the user and password is correct
        let hashPassword = await Crypto.digestStringAsync( Crypto.CryptoDigestAlgorithm.SHA256, password );
        console.log(username," vs ",usersData[0].username);
        console.log(hashPassword," vs ",usersData[0].password);
        if( username === usersData[0].username && hashPassword === usersData[0].password ){
          router.push("homeScreen");
          Alert.alert("Login Successful", `Welcome, ${username}!`);          
        }else{
          Alert.alert("Error", "Usuario y/o contraseña incorrecto");
          return;
        }        
      }catch(error){
        throw new Error("Error checking the password: ",error);
      }
      
    };

    const onNewUser = async () => {
      try {
        console.log("Registering new user");
        if (!username || !password) {
          Alert.alert("Error", "Ingrese un usuario y contraseña");
          return;
        }      
        const result = await writeUserDB(db, username, password);
        router.push("homeScreen");
        Alert.alert("Inicio se sesión correcto", `Bienvenido, ${username}!`);        
      }catch(error){
        throw new Error('Error saving new user in db.');
      }    
    };

    return (
      <AuthContext.Provider value={{ username, password }}>
        <View style={styles.container}>
          { (!loading && userFound === true) && (
            <>
              <Text style={styles.title}>Inicio de Sesión</Text>      
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
              <TouchableOpacity style={styles.button} onPress={() => onSubmit()}>
                <Text style={styles.buttonText}>Ingresar</Text>
              </TouchableOpacity>
            </>
          )}

          { (!loading && userFound === false) && (
            <>
              <Text style={styles.title}>Registro de Usuario</Text> 
              <Text>Ingrese las credenciales del ususario del dispositivo</Text>     
              <TextInput
                style={styles.input}
                placeholder="Usuario"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.button} onPress={() => onNewUser() }>
                <Text style={styles.buttonText}>Registar</Text>
              </TouchableOpacity>
            </>
          ) }

          {loading && (
            <Text>CARGANDO ...</Text>
          )}
          
        </View>
      </AuthContext.Provider>
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





