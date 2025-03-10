import { API_BASE_URL, USER, PASSWORD, DB_NAME, LOG_PATIENT, LOG_COHORT } from './constants.js';
import { getPatientPaternalLastName, getPatientMaternalLastName, getPatientSex } from '../utils/patientFunctions'; 
import { getLocalformatDate } from '../utils/dateFunctions';

import * as SQLite from 'expo-sqlite';
import { writeLog } from './logFunctions.js';

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
export async function fillCohortMembersDB(db, baseUrl, endpoint, cohortUUID){

    
    // Fetch Cohort Members
    try {

        //Auth
        let base64 = require("base-64");

        if(cohortUUID === null) return [];

        const authString = base64.encode(USER + ":" + PASSWORD);

        let patientsListRaw = [];
        let patientsListFormated = [];


        //console.log('Fetching: ', baseUrl+endpoint+'cohortm/cohortmember?limit=100&v=full&cohort='+cohortUUID);
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
        
        //console.log('fetch result: ',jsonData);

        patientsListRaw = jsonData.results;
        //console.log(patientsListRaw);
        
        //console.log('to log: ', 'COHORT '+ cohortUUID + ' in ' + baseUrl+endpoint+'cohortm/cohortmember?limit=100&v=full&cohort='+cohortUUID + ' consulted successfully. Received '+ patientsListRaw.length.toString() +' results.');
        let logResult = await writeLog(db,LOG_COHORT, 'COHORT '+ cohortUUID + ' in ' + baseUrl+endpoint+'cohortm/cohortmember?limit=100&v=full&cohort='+cohortUUID + ' consulted successfully. Received '+ patientsListRaw.length.toString() +' results.');

        //Reformat object
        patientsListFormated = patientsListRaw.map(member => ({            
            uuid:               member.patient.uuid,
            dni:                getDniOfCohortMember(member),
            givenName:          member.patient?.person?.preferredName?.givenName  || "",
            middleName:         member.patient?.person?.preferredName?.middleName || "",
            paternalLastName:   getPatientPaternalLastName(member),
            maternalLastName:   getPatientMaternalLastName(member),
            sex:                getPatientSex(member),
            birthDate:          member.patient?.person?.birthdate || "",
            ethnicity:          'test',
            active:             "1"            
        }));
        //console.log('formatedPatients: ',patientsListFormated);

        //Get uuid of patients that already are in the database
        let existingPatients = await db.getAllAsync(`SELECT uuid FROM Patient WHERE active = '1';`);
        console.log('existing patients: ',existingPatients);

        let patientsInserted = patientsListFormated.length;
        for(const patient of patientsListFormated){
            //Check if patient already exists, not check if there arent any patients in device            
            if( patientsInserted.length > 0 && existingPatients.some(item => item.uuid === patient.uuid) === true){
                //Log
                const logEx = await writeLog(db,LOG_PATIENT,`Patient already exists. DNI: ${patient.dni}, UUID: ${patient.uuid}, Full-Name: ${ patient.givenName + " " + patient.middleName + " " + patient.paternalLastName + " " + patient.maternalLastName}.`);
                patientsInserted--;
                continue;
            }        
            
            //Insert Patient
            //console.log(patient);
            const result = await db.runAsync('INSERT INTO Patient (uuid, dni,givenName,middleName,paternalLastName,maternalLastName,sex,birthDate,ethnicity,active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', patient.uuid, patient.dni, patient.givenName, patient.middleName, patient.paternalLastName, patient.maternalLastName, patient.sex, patient.birthDate, patient.ethnicity, patient.active);
            if(result.changes === 0) throw new Error(`Patient ${patient.givenName} ${patient.paternalLastName} from cohort couldn't get saved in Database.`);
            //console.log('result: ',result);
            //Log
            const log = await writeLog(db,LOG_PATIENT,`Patient inserted. DNI: ${patient.dni}, UUID: ${patient.uuid}, Full-Name: ${ patient.givenName + " " + patient.middleName + " " + patient.paternalLastName + " " + patient.maternalLastName}.`);
        }
        console.log('inserted ',patientsInserted,' of ',patientsListFormated.length,' fetched');

    } catch (err) {
        const logResult = await writeLog(db,LOG_COHORT, 'COHORT '+ cohortUUID + ' in ' + baseUrl+endpoint+'cohortm/cohortmember?limit=100&v=full&cohort='+cohortUUID + ' consulted un-successfully.');
        throw new Error('Error fetching data:', err);
    } 
    
    
    return patientsListFormated;    

}

