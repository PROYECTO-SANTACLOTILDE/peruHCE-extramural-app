import * as SQLite from 'expo-sqlite';
import { DB_NAME } from '../constants';


//JSON dummy
import dummyForm from '../dummy/FormDummy.json';
import dummyForm2 from '../dummy/FormDummy2.json';
import { EraseRowsTablesScript, ResetTablesScript } from './dbInitializationScripts';
import { replaceQuoteInForm } from '../formFunctions';

export async function fillDummyPatients(db) {

    await db.execAsync(`
        INSERT INTO Patient (uuid, dni, givenName, middleName, paternalLastName, maternalLastName, sex, birthDate, ethnicity, active) VALUES
        ('abc', '12345678', 'John',     'Doe',      'Doe',      'Smith',    'Hombre',   '2020-09-25T00:00:00.000+0000',     'test', '1'),
        ('abc', '87654321', 'Jane',     'Doe',      'Brown',    'Taylor',   'Mujer',    '2020-09-25T00:00:00.000+0000',     'test', '1'),
        ('abc', '56789012', 'Alice',    'Johnson',  'Johnson',  'Lee',      'Mujer',    '2020-09-25T00:00:00.000+0000',     'test', '1'),
        ('abc', '34567890', 'Bob',      'White',    'White',    'Garcia',   'Hombre',   '2020-09-25T00:00:00.000+0000',     'test', '1');
    `);
    
}

export async function fillDummyForm(db) {
    const test = { hideWhenExpression: "emergencia !== '1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'"};
    /* console.log(test);
    console.log(test.hideWhenExpression);
    console.log(JSON.stringify(test)); */
    const result = await db.execAsync(`
        INSERT INTO Form 
        ( uuid,  name,                 description,          body,    encounterType, encounterTypeUUID,                      active) VALUES 
        ( 'abc', 'SOAP Note Template', 'SOAP Note Template', '${replaceQuoteInForm(JSON.stringify(dummyForm))}', 'Visit Note',  'd7151f82-c1f3-4152-a605-2f9ea7414a79', '1')
    ;`);

    
}

export async function fillDummyCohort(db) {
   
    await db.execAsync(`
        INSERT INTO Cohort (uuid, location, locationUUID, name, description, startDate, endDate, active) VALUES
        ('abc', 'Santa Clotilde test', 'abc', 'Localidad test', 'Localidad de prueba', '2020-09-25T00:00:00.000+0000', '2020-09-25T00:00:00.000+0000',  '1');        
    `);
}

export const baseVariables = `
    INSERT INTO Variable (key, value, active) VALUES
    ('BASE_URL',        '${process.env.EXPO_PUBLIC_BASE_URL}',     '1'),
    ('BASE_ENDPOINT',   '${process.env.EXPO_PUBLIC_BASE_ENDPOINT}','1'),
    ('COHORT',          '646e0f6c-4ba9-4bd7-a1de-d4425af3a01b',   '1'),   
    ('FORM',          '---',   '1');    
`;

export async function fillDummyVariables(db) {

    await db.execAsync(baseVariables);
}

export async function resetDB_user_version(db) {

    let result = await db.getFirstAsync('PRAGMA user_version;');
    await db.execAsync("PRAGMA user_version = 0;");
    await db.execAsync(ResetTablesScript);
    console.log('User version to 0');
}

export async function cleanDB(db) {
    const result = await db.execAsync(EraseRowsTablesScript);

    console.log("Database cleaned.");
}

