import React, {useState, useEffect} from 'react';
import { View, Text } from 'react-native';
import { API_BASE_URL, USER, PASSWORD } from '../utils/constants';

//Dummy Data
import patientListDummy from "../utils/dummy/ListPatientsDummy.json"; 
import PatientListTable from '../components/PatientListTable';


export default function ListPatients() {

    //Auth
    let base64 = require("base-64");
    
    //Patient List Data
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPatients = async () => {
        const authString = base64.encode(USER + ":" + PASSWORD);
        try {
            setLoading(true);
            const response = await fetch(API_BASE_URL+'cohortm/cohortmember?limit=100&v=full&cohort=902e4e79-a328-4f61-9683-316ed61fe8c9', {
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
            
            setPatients(jsonData.results);
            
            setError(null);
        } catch (err) {
          setError(err.message || 'Failed to fetch data');
          console.error('Error fetching data:', err);
        } finally {
          setLoading(false);
        }
    };

    const fetchPatientsDummy = () => {
        setLoading(true);
        setPatients(patientListDummy);
        setLoading(false);        
    };

    const onRefresh = async () => {
        setLoading(true);
        await fetchPatients();
        setLoading(false);
    };
    
    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <View>
            <View>
                {loading ? (
                    <Text>LOADING ...</Text>
                ) : (                    
                    <PatientListTable patientList={patients} /> 
                ) }
            </View>
        </View>
    );
}