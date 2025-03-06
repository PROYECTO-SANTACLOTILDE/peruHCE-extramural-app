import { COLOR_BLACK, COLOR_DARK_GREEN } from '../utils/constants';
import { StyleSheet} from "react-native";

//Styles
export const styles = StyleSheet.create({
    button:{
        margin: 20
    },
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
    variableRow: {
        borderWidth: 3,
        borderColor: COLOR_DARK_GREEN,
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    variableLabel: {
        fontWeight: 'bold',
        fontSize: 18,
        color: COLOR_BLACK,
        marginRight: 10,
        width: '30%',
    },
    variableValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    variableValue: {
        fontSize: 18,
        color: COLOR_BLACK,
        marginRight: 10,
        width: '70%',
    },
    input:{
        width: '72%',
        borderWidth: 1,
        borderColor: COLOR_BLACK,

    },
    inputEditor:{
        width: 500,
        borderWidth: 1,
        borderColor: COLOR_BLACK,

    },
    variableButtonContainer: {        
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    modalEditorContainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalEditorView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.75,
        shadowRadius: 4,
        elevation: 5,
    },
    modalEditoButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default styles;