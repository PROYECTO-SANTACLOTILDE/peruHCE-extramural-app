//Form functions

import { SQUOTE } from "./constants";

import { btoa } from 'react-native-quick-base64'

// Build empty structure to save answers
export function replaceQuoteInForm(formString){
    if(formString === undefined) return "";
    if(formString === null) return "";
    return formString.replace(/'/g, SQUOTE);
};

// Use
export function restoreQuouteInFrom(formString){
    if(formString === undefined) return "";
    if(formString === null) return "";
    return formString.replace(new RegExp(SQUOTE, 'g'), "'");
}


// Assumes it uses the ISO 8601 extended format (YYYY-MM-DDTHH:mm:ss.sss±HH:mm)
export function getAgeDB(birthDateString){
    if(birthDateString == null) return 0;

    // Parse the birth date string into a Date object
    const birthDate = new Date(birthDateString);

    // Get the current date
    const today = new Date();

    console.log(birthDateString);
    console.log(birthDate, ' vs ', today);
    
    // Calculate the age
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Adjust the age if the birthday hasn't occurred yet this year
    const hasHadBirthdayThisYear = 
        today.getMonth() > birthDate.getMonth() || 
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    
    if (!hasHadBirthdayThisYear) {
        age--;
    }
  
  return age;
};

export async function fillFormDB(db, baseUrl, endpoint, formUUID){

    // Fetch Form
    try {
        //Auth
        //let base64 = require("base-64");

        if(formUUID === null) return null;

        // Change to saved in database
        const authString = base64.encode(USER + ":" + PASSWORD);

        let formInfo = null;
        let formBody = null;        

        console.log(baseUrl+endpoint+'o3/forms/'+formUUID);

        const response = await fetch(baseUrl+endpoint+'o3/forms/'+formUUID, {
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
        
        console.log('fetch form: ',jsonData);

        console.log(jsonData);
        
        return;

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