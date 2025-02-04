import { API_BASE_URL, USER, PASSWORD, DB_NAME } from './constants.js';
import { getPatientPaternalLastName, getPatientMaternalLastName, getPatientSex } from '../utils/patientFunctions'; 
import { getLocalformatDate } from '../utils/dateFunctions';

import * as SQLite from 'expo-sqlite';

function getDniOfCohortMember(member){

    if(member === null) return "";
    if(member.patient === null) return "";
    if(member.patient.identifiers === null) return "";
    if(member.patient.identifiers.length === 0) return "";

    //Search for DNI identifier
    let identifierList = member.patient.identifiers;

    let dniIdentifier = identifierList.find( ident => ident.identifierType.display === "DNI");

    if(dniIdentifier === undefined ) return "";

    return dniIdentifier.identifier;
}

function getEthnicityOfCohortMember(member){
    if(member === null) return "";
    if(member.patient === null) return "";
    if(member.patient.person === null) return "";
    if(member.patient.person.attributes === null) return "";
    if(member.patient.person.attributes.length === 0) return "";

    //Search for Ethnicity Attribute
    let attributesList = member.patient.person.attributes;

    let ethnicityIdent = attributesList.find( attr => attr.attributeType.display === "Ethnicity");

    if(ethnicityIdent === undefined ) return "";

    return ethnicityIdent.display;

}

//Receives a cohort UUID and fills the patient members in the database and returns them
export async function fillCohortMembersDB(baseUrl, endpoint, cohortUUID){

    //Auth
    let base64 = require("base-64");

    if(cohortUUID === null) return [];

    const db = await SQLite.openDatabaseAsync(DB_NAME);
    
    const authString = base64.encode(USER + ":" + PASSWORD);

    let patientsListRaw = [];
    let patientsListFormated = [];

    // Fetch Cohort Members
    try {
        const response = await fetch(baseUrl+endpoint+'cohortm/cohortmember?limit=100&v=full&cohort='+cohortUUID, {
            method: 'GET',
            headers: {
            'Authorization': `Basic ${authString}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        
        
        patientsListRaw = jsonData.results;
        
    } catch (err) {
        console.error('Error fetching data:', err);
        return [];
    } 
    
    //Reformat object
    patientsListFormated = patientsListRaw.map(member => {
        return {
            uuid:               member.patient.uuid,
            dni:                getDniOfCohortMember(member),
            givenName:          member.patient.person.preferredName.givenName || "",
            middleName:         member.patient.person.preferredName.middleName || "",
            paternalLastName:   getPatientPaternalLastName(member),
            maternalLastName:   getPatientMaternalLastName(member),
            sex:                getPatientSex(member),
            birthDate:          getLocalformatDate(member),
            ethnicity:          'test',
            active:             "1"
        };
    });
    
    //Enter cohort members to database
    const formattedArray = await Promise.all(patientsListFormated.map(async (member) => {
        const result = await db.runAsync('INSERT INTO Patient (uuid, dni,givenName,middleName,paternalLastName,maternalLastName,sex,birthDate,ethnicity,active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', member.uuid, member.dni, member.givenName, member.middleName, member.paternalLastName, member.maternalLastName, member.sex, member.birthDate, member.ethnicity, member.active);
    }));

    return patientsListFormated;
    

}