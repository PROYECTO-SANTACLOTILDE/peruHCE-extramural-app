//Date functions

// Assumes it uses the ISO 8601 extended format (YYYY-MM-DDTHH:mm:ss.sss±HH:mm)
export function getLocalformatDate(patientInfo){
    if(patientInfo == null) return "";

    const dateString = patientInfo.patient.person.birthdate;

    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1)
    const year = date.getFullYear(); // Get year
  
    return `${day}-${month}-${year}`;
};

export function getLocalformatDateDB(dateString){
    if(dateString == null) return "";

    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1)
    const year = date.getFullYear(); // Get year
  
    return `${day}-${month}-${year}`;
};


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