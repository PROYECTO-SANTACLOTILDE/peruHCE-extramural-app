import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";

import { getPatientFullName, getPatientPaternalLastName, getPatientMaternalLastName, getPatientSex } from '../utils/patientFunctions'; 
import { getLocalformatDateDB, getAgeDB } from '../utils/dateFunctions';

export const LogVisor = ({logData}) => {
 
    // Table Header component
    const TableHeader = () => (
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>ID</Text>
        <Text style={styles.headerText}>Tipo</Text>
        <Text style={styles.headerText}>Fecha</Text>
        <Text style={styles.headerText}>Contenido</Text>
      </View>
    );
  
    // Render Row component
    const renderRow = ({ item }) => (
      <View style={styles.tableRow}>
        <Text style={styles.cell}>{item.id}</Text>                
        <Text style={styles.cell}>{item.type || "-" }</Text>         
        <Text style={styles.cell}>{item.dateTime || "-"}</Text> 
        <Text style={styles.cell}>{item.content || "-"}</Text>                                  
      </View>
    );
  
    return (
      <ScrollView style={styles.container} horizontal>
        
          <View>
            <TableHeader />
            <FlatList
              data={logData}
              renderItem={renderRow}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>          
        
      </ScrollView>
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
      minWidth: 120,
      textAlign: "center",
    },
  });





