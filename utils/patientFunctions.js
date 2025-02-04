//Patient Functions

// Assumes it uses cohort member endpoint with version full
export function getPatientFullName(patientInfo) {
    if(patientInfo == null) return "";
    const givenName = patientInfo.patient.person.preferredName.givenName || ""; 
    const middleName = patientInfo.patient.person.preferredName.middleName || ""
    return  givenName + " " +middleName ;
}

// Assumes it uses cohort member endpoint with version full
export function getPatientPaternalLastName(patientInfo) {
    if(patientInfo == null) return "-"
    if(patientInfo.patient.person.preferredName.familyName == null) return "-"
    return patientInfo.patient.person.preferredName.familyName;
}

// Assumes it uses cohort member endpoint with version full
export function getPatientMaternalLastName(patientInfo) {
    if(patientInfo == null) return "-"
    if(patientInfo.patient.person.preferredName.familyName2 == null) return "-"
    return patientInfo.patient.person.preferredName.familyName2;
}

// Assumes it uses cohort member endpoint with version full
export function getPatientSex(patientInfo) {
    if(patientInfo == null) return "-"
    if(patientInfo.patient.person.gender == null) return "-";
    const auxSex = patientInfo.patient.person.gender;
    switch (auxSex) {
        case "M":
            return "Hombre"
            break;
      
        case "F":
            return "Mujer"
            break;
      
        default:
            return "-"
            break;
    }
}



