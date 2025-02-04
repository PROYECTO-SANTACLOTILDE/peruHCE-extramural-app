import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TextInput, Button, Modal, ScrollView} from "react-native";
import { fillCohortMembersDB } from '../utils/cohortFunctions';
import { COLOR_BLACK, COLOR_DARK_GREEN } from '../utils/constants';
import { updateVariableDb } from '../utils/dbUtils/dbVariableFunctions';


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

    const handlePress = async () => {
        const baseUrlVariable = variableList.find(item => item.key === "BASE_URL");
        if(baseUrlVariable === undefined){
            console.error('No BASE_URL variable found in database.');
            return;
        }
        const baseUrl = baseUrlVariable ? baseUrlVariable.value : "";
        
        const baseEndpointVariable = variableList.find(item => item.key === "BASE_ENDPOINT");
        if(baseUrlVariable === undefined){
            console.error('No BASE_ENDPOINT variable found in database.');
            return;
        }        
        const endPoint = baseEndpointVariable ? baseEndpointVariable.value : "";

        const cohortVariable = variableList.find(item => item.key === "COHORT");
        if(baseUrlVariable === undefined){
            console.error('No COHORT variable found in database.');
            return;
        }  
        const cohortUUID = cohortVariable ? cohortVariable.value : null;
        
        try	{
            const result = await fillCohortMembersDB(baseUrl, endPoint, cohortUUID);  
        } catch (err) {
            console.error('Error getting data from server:', err);
        } finally {
            console.log('Cohort Members: ',result);
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

            <Button title="Cargar pacientes" onPress={handlePress} />
        
        </ScrollView>        
      </View>
    );
};


//Styles
const styles = StyleSheet.create({
    container: {
        padding: 16,
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
    variableLabel: {
        fontWeight: 'bold',
        fontSize: 18,
        color: COLOR_BLACK,
        marginRight: 10,
        width: 210,
    },
    variableValue: {
        fontSize: 18,
        color: COLOR_BLACK,
        marginRight: 10,
        width: '82%',
    },
    input:{
        width: '72%',
        borderWidth: 1,
        borderColor: COLOR_BLACK,

    },
    inputEditor:{
        width: 500,
        borderWidth: 1,
        borderColor: COLOR_BLACK,

    },
    variableRow: {
        borderWidth: 3,
        borderColor: COLOR_DARK_GREEN,
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    variableValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    variableButtonContainer: {        
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    modalEditorContainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalEditorView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.75,
        shadowRadius: 4,
        elevation: 5,
    },
    modalEditoButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
