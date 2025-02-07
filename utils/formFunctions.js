//Form functions

import { SQUOTE } from "./constants";

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
    return formString.replace(new RegExp(placeholder, "g"), "'");
}

// Assumes it uses the ISO 8601 extended format (YYYY-MM-DDTHH:mm:ss.sss±HH:mm)
export function getAge(patientInfo){
    if(patientInfo == null) return 0;

    // Parse the birth date string into a Date object
    const birthDate = new Date(patientInfo.patient.person.birthdate);
    
    // Get the current date
    const today = new Date();
    
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