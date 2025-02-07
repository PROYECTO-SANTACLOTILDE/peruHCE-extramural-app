import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { restoreQuouteInFrom } from '../utils/formFunctions';

export const FormBuilder = ({formObject}) => {

    const [formBody, setFormBody] = useState(null);
    const [observations, setObservation] = useState([]);
    
    useEffect(() => {
        console.log(formObject.body);
        setFormBody(JSON.parse( restoreQuouteInFrom( formObject.body )));
        setObservation( );
    }, []);

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Form Name */}
        <View style={styles.row}>
          <Text style={styles.key}>Nombre: </Text>
          <Text style={styles.value}>{formObject.name}</Text>
        </View>
        {/* Form Description */}
        <View style={styles.row}>
          <Text style={styles.key}>Descripción: </Text>
          <Text style={styles.value}>{formObject.description}</Text>
        </View>
        {/* Encounter Type */}
        <View style={styles.row}>
          <Text style={styles.key}>Tipo de encuentro: </Text>
          <Text style={styles.value}>{formObject.encounterType}</Text>
        </View>
        
        {/* Form Builder (AMPATH ENGINE ADAPTATION) */}
        <FormPager formBody={JSON.parse(formObject.body)}/>
      </ScrollView>
    );
};

const FormPager = ({formBody}) => {

    if(formBody.pages.length === 0) return ( <Text>No hay páginas</Text> );

    return(
        <View>
            {formBody.pages.map((page, index) => (
                <View key={index} style={styles.page}>
                    <Text style={styles.pageText}>Página {index + 1}: {page.label}</Text>
                    {/* Sections */}
                    <FormSectioner formSections={page.sections} />
                </View>
            ))}
        </View>
    );
};

const FormSectioner = ({formSections}) => {

    if(formSections.length === 0) return ( <Text>No hay secciones</Text> );

    return(
        <View>
            {formSections.map((section, index) => (
                <View key={index} style={styles.page}>
                    <Text style={styles.pageText}>{section.label}</Text>
                    {/* Section Content */}
                    <FormQuestioner formQuestions={section.questions} />
                </View>                
            ))}
        </View>
    );
};

const FormQuestioner = ({formQuestions}) => {

    if(formQuestions.length === 0) return ( <Text>No hay secciones</Text> );

    return(
        <View>
            {formQuestions.map((question, index) => (
                <View key={index} style={styles.page}>
                    {/* Question Label */}
                    <Text style={styles.questionLabel}>{question.label}:</Text>
                    {/* Question Answer Field */}
                    <TextInput
                        style={styles.questionTextArea}
                        placeholder={'Ingrese el valor'}
                    />
                </View>                
            ))}
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
    page: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    questionTextArea: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        fontSize: 14,
    },
    questionLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
  });
