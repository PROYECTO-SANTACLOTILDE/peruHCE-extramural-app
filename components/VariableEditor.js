import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TextInput, Button, Modal, ScrollView} from "react-native";
import { fillCohortMembersDB, fillFormDB } from '../utils/cohortFunctions';
import { updateVariableDb } from '../utils/dbUtils/dbVariableFunctions';

import styles from './VariableEditorStyles.js';

import { useSQLiteContext } from 'expo-sqlite';



export const VariableEditor = ({variableList, refreshVariables}) => {    

    //Open Database
    const db = useSQLiteContext();


    const [editingVar, setEditingVar] = useState(null);
    const [editedValue, setEditedValue] = useState('');

    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = (variable) => {
        //if(variable !== null) console.log('var: ',variable);
        setEditingVar(variable ? variable : null);
        setEditedValue(variable ? variable.value : '');
        setModalVisible(!isModalVisible);
    }

    const handlePress = async (db) => {
        try{
            //console.log('variableList: ',variableList);

            const baseUrlVariable = variableList.find(item => item.key === "BASE_URL");
            //console.log('baseUrl: ',baseUrlVariable);
            if(baseUrlVariable === undefined){
                throw new Error("No BASE_URL variable found in database.");
            }            
            const baseUrl = baseUrlVariable.value;
            //console.log('baseUrl: ',baseUrl);
            
            const baseEndpointVariable = variableList.find(item => item.key === "BASE_ENDPOINT");
            //console.log('endPoint: ',baseEndpointVariable);
            if(baseEndpointVariable === undefined){
                throw new Error('No BASE_ENDPOINT variable found in database.');
            }   
            const endPoint = baseEndpointVariable.value;
            //console.log('endPoint: ',endPoint);

            const cohortVariable = variableList.find(item => item.key === "COHORT");
            //console.log('cohortUUID: ',cohortVariable);
            if(cohortVariable === undefined){
                throw new Error('No COHORT variable found in database.');
            }  
            const cohortUUID = cohortVariable.value;
            //console.log('cohortUUID: ',cohortUUID);

            let result = await fillCohortMembersDB(db, baseUrl, endPoint, cohortUUID);

        }catch (err) {
            throw new Error('Error getting variables to fetch cohort members: ', err);
        }    
        
             
    };

    const getForm = async (db) => {
        try{


            const baseUrlVariable = variableList.find(item => item.key === "BASE_URL");
            //console.log('baseUrl: ',baseUrlVariable);
            if(baseUrlVariable === undefined){
                throw new Error("No BASE_URL variable found in database.");
            }            
            const baseUrl = baseUrlVariable.value;
            //console.log('baseUrl: ',baseUrl);
            
            const baseEndpointVariable = variableList.find(item => item.key === "BASE_ENDPOINT");
            //console.log('endPoint: ',baseEndpointVariable);
            if(baseEndpointVariable === undefined){
                throw new Error('No BASE_ENDPOINT variable found in database.');
            }   
            const endPoint = baseEndpointVariable.value;
            //console.log('endPoint: ',endPoint);

            const formVariable = variableList.find(item => item.key === "FORM");
            //console.log('formUUID: ',formVariable);
            if(formVariable === undefined){
                throw new Error('No FORM variable found in database.');
            }  
            const formUUID = formVariable.value;
            //console.log('cohortUUID: ',cohortUUID);

            let result = await fillFormDB(db, baseUrl, endPoint, formUUID);

        }catch (err) {
            throw new Error('Error getting variables to fetch cohort members: ', err);
        }    
        
             
    };

    // Handle the "Save" button click
    const handleSave = async (variable, editedValue) => {
       
        const newVariable = { ...variable, value: editedValue };
        
        // Save in database
        try{
            const result = await updateVariableDb(newVariable, db);
        } catch (error) {
            console.error('Error in Save Button: ', error.message);
        }        

        refreshVariables();  
        toggleModal(null);
    };

    // Handle the "Cancel" button click
    const handleCancel = () => {
        toggleModal(null);
    };

    return (
      <View style={styles.container}>
        <ScrollView>
            {variableList.map((variable, index) => (
                <View key={index} style={styles.variableRow}>
                    {/* Key Label */}
                    <Text style={styles.variableLabel}>
                        {variable.key}: 
                    </Text>
                    <View style={styles.variableValueContainer} > 
                        <Text style={styles.variableValue} >
                            {variable.value} 
                        </Text>
                        <Button title="Editar" onPress={() => toggleModal(variable)} />
                    </View>                       
                </View>
            ))}

            {/* Modal for Editing */}
            <Modal
                transparent={true}
                visible={isModalVisible}
                backdropOpacity={0.5}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalEditorContainer}>
                    <View style={styles.modalEditorView}>
                        <Text>Editar variable : {editingVar ? editingVar.key : "" }</Text>
                        <TextInput
                            style={styles.inputEditor}
                            value={editedValue ? editedValue : ""}
                            onChangeText={setEditedValue}
                        />
                        <View style={styles.modalEditoButtonContainer} > 
                            <Button title="Save"  onPress={ () => handleSave(editingVar, editedValue) } />
                            <Button title="Cancel" onPress={() => handleCancel() } />
                        </View>
                    </View>
                </View>
            </Modal>

            <Button title="Cargar pacientes" style={ styles.button } onPress={() => handlePress(db) } />
            <Button title="Cargar formulario" style={ styles.button } onPress={() => getForm(db) } />
        
        
        </ScrollView>        
      </View>
    );
};




