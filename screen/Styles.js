import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dr_profile: {
        width: width * 0.25,
        height: height * 0.15,
        borderRadius: 100,
        borderColor: 'blue',
        borderWidth: 5,
    },
    drawerimg: {
        display: 'flex', flexDirection: 'column',
        width: width - 130,
        paddingTop: height * 0.05,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center', position: 'relative',
    },
    img: {
        width: width * 0.25,
        height: height * 0.15,
        borderRadius: 100,
        borderColor: 'blue',
        borderWidth: 5,
    },
    draweritem: {
        marginBottom: 2,
        backgroundColor: 'blue',
        display: 'flex',
        flexDirection: 'row',
        height: height * 0.07,
        alignItems: 'center',
        width: width - 120,
        paddingLeft: 5,
    },
    icon: {
        position: 'absolute',
        top: 10, right: 0
    },
    drawerStyle: {
        backgroundColor: 'yellow',
        borderTopRightRadius: 20,
        borderBottomEndRadius: 20,
        borderWidth: 5,
        width: width / 1.5,
    }
});