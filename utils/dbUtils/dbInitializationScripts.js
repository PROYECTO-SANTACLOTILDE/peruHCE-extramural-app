export const ResetTablesScript = `
    DROP TABLE IF EXISTS Patient;
    DROP TABLE IF EXISTS User;
    DROP TABLE IF EXISTS Form;
    DROP TABLE IF EXISTS Cohort;
    DROP TABLE IF EXISTS Visit;
    DROP TABLE IF EXISTS VisitAttribute;
    DROP TABLE IF EXISTS Encounter;
    DROP TABLE IF EXISTS Variable;
    DROP TABLE IF EXISTS Log;
`; 

export const EraseRowsTablesScript = `
    DELETE FROM Patient;
    DELETE FROM User;
    DELETE FROM Form;
    DELETE FROM Cohort;
    DELETE FROM Visit;
    DELETE FROM VisitAttribute;
    DELETE FROM Encounter;
    DELETE FROM Variable;
    DELETE FROM Log;
`; 

export const PatientTableScript = `  
CREATE TABLE IF NOT EXISTS Patient (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    dni TEXT,
    givenName TEXT,
    middleName TEXT,
    paternalLastName TEXT,
    maternalLastName TEXT,
    sex TEXT NOT NULL,
    birthDate TEXT,
    ethnicity TEXT,
    active TEXT
);`;

export const UserTableScript = `  
CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    displayNameName TEXT,
    role TEXT NOT NULL,
    roleDescription TEXT NOT NULL,
    active TEXT
);`;

//Pending to complete
export const FormTableScript = `  
CREATE TABLE IF NOT EXISTS Form (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    body TEXT,
    encounterType TEXT,
    encounterTypeUUID TEXT,
    active TEXT    
);`;

export const CohortTableScript = `  
CREATE TABLE IF NOT EXISTS Cohort (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    location TEXT,
    locationUUID TEXT,
    name TEXT NOT NULL,
    description TEXT,
    startDate TEXT,
    endDate TEXT,
    active TEXT    
);`;

export const VisitTableScript = `  
CREATE TABLE IF NOT EXISTS Visit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitType TEXT,
    visitTypeUUID TEXT,
    startDatetime TEXT,
    stopDatetime TEXT,
    indication TEXT,
    active TEXT    
);`;

export const VisitAttributesTableScript = `  
CREATE TABLE IF NOT EXISTS VisitAttribute (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitType TEXT,
    visitTypeUUID TEXT,
    startDatetime TEXT,
    stopDatetime TEXT,
    indication TEXT,
    active TEXT    
);`;

export const EncounterAttributesTableScript = `  
CREATE TABLE IF NOT EXISTS Encounter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitType TEXT,
    visitTypeUUID TEXT,
    startDatetime TEXT,
    stopDatetime TEXT,
    indication TEXT,
    active TEXT    
);`;

export const VariablesTableScript = `  
CREATE TABLE IF NOT EXISTS Variable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL,
    value TEXT,
    active TEXT    
);`;

export const LogTableScript = `  
CREATE TABLE IF NOT EXISTS Variable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    content TEXT,
    dateTime TEXT,
    active TEXT    
);`;



