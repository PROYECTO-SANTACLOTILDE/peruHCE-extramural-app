import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, FlatList } from "react-native";

import { getPatientFullName, getPatientPaternalLastName, getPatientMaternalLastName, getPatientSex } from '../utils/patientFunctions'; 
import { getLocalformatDateDB, getAgeDB } from '../utils/dateFunctions';

export const PatientListTable = ({patientList}) => {
 
    // Table Header component
    const TableHeader = () => (
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>DNI</Text>
        <Text style={styles.headerText}>Nombres</Text>
        <Text style={styles.headerText}>Apellido Paterno</Text>
        <Text style={styles.headerText}>Apellido Materno</Text>
        <Text style={styles.headerText}>Sexo</Text>
        <Text style={styles.headerText}>Nacimiento</Text>
        <Text style={styles.headerText}>Edad</Text>
        <Text style={styles.headerText}>Etnia</Text>
      </View>
    );
  
    // Render Row component
    const renderRow = ({ item }) => (
      <View style={styles.tableRow}>
        <Text style={styles.cell}>12345678</Text>                
        <Text style={styles.cell}>{getPatientFullName(item)}</Text>         
        <Text style={styles.cell}>{getPatientPaternalLastName(item)}</Text> 
        <Text style={styles.cell}>{getPatientMaternalLastName(item)}</Text> 
        <Text style={styles.cell}>{getPatientSex(item)}</Text>       
        <Text style={styles.cell}>{getLocalformatDate(item)}</Text>         
        <Text style={styles.cell}>{getAgeDB(item)}</Text>                               
        <Text style={styles.cell}>Test</Text>                                    
      </View>
    );
  
    return (
      <View style={styles.container}>
        <TableHeader />
        <FlatList
          data={patientList}
          renderItem={renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
};

export const PatientListTableDB = ({patientList}) => {

  // Table Header component
  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerText}>DNI</Text>
      <Text style={styles.headerText}>Nombres</Text>
      <Text style={styles.headerText}>Apellido Paterno</Text>
      <Text style={styles.headerText}>Apellido Materno</Text>
      <Text style={styles.headerText}>Sexo</Text>
      <Text style={styles.headerText}>Nacimiento</Text>
      <Text style={styles.headerText}>Edad</Text>
      <Text style={styles.headerText}>Etnia</Text>
    </View>
  );

  // Render Row component
  const renderRow = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.cell}>{item.dni || "-" }</Text>                
      <Text style={styles.cell}>{ (item.givenName || "")  + ( item.middleName ? (" " + item.middleName) : "" ) }</Text>         
      <Text style={styles.cell}>{item.paternalLastName || "-"}</Text> 
      <Text style={styles.cell}>{item.maternalLastName || "-"}</Text> 
      <Text style={styles.cell}>{item.sex || "-"}</Text>         
      <Text style={styles.cell}>{item.birthDate ? getLocalformatDateDB(item.birthDate) : "-"}</Text>                               
      <Text style={styles.cell}>{item.birthDate ? getAgeDB(item.birthDate) : "-"}</Text>
      <Text style={styles.cell}>{item.ethnicity || "-"}</Text>                                    
    </View>
  );

  return (
    <View style={styles.container}>
      <TableHeader />
      <FlatList
        data={patientList}
        renderItem={renderRow}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};


  
  const styles = StyleSheet.create({
    container: {
      width: '600px',
      padding: 16,
      backgroundColor: "#f4f4f4",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#ddd",
      padding: 10,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: "#ccc",
    },
    headerText: {
      flex: 1,
      fontWeight: "bold",
      textAlign: "center",
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: "#ccc",
    },
    cell: {
      flex: 1,
      textAlign: "center",
    },
  });





