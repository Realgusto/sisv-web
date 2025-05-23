import { StyleSheet, Font } from '@react-pdf/renderer'

Font.register({
    family: 'Rubik',
    fontWeight: 'normal',
    fontStyle: 'normal',
    src: 'https://fonts.gstatic.com/s/rubik/v4/2AfMVb-218AAzRWsLqegwg.ttf',
})

export default StyleSheet.create({
    page: {
        backgroundColor: '#FFFFFF',
        padding: 12,
    },
    counter: {
        marginTop: 20,
        textAlign: 'right',
        width: '100%',
        fontSize: 10,
        fontFamily: 'Rubik',
    },
    border: {
        borderBottomWidth: 1,
        borderColor: '#c2c2c2',
        marginTop: 10,
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'Rubik',
    },
    headerCompany: {
        fontSize: 18,
        color: '#000000',
        fontFamily: 'Rubik',
    },
    headerAddress: {
        fontSize: 14,
        color: '#444444',
        fontFamily: 'Rubik',
    },
    headerPhone: {
        fontSize: 14,
        color: '#444444',
        fontFamily: 'Rubik',
    },
    headerTitle: {
        fontSize: 12,
        color: '#444444',
        fontFamily: 'Rubik',
    },
    headerText: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Rubik',
    },
    content: {
        paddingVertical: 20,
    },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    contentHeaderTitle: {
        fontSize: 12,
        color: '#444444',
        fontFamily: 'Rubik',
    },
    contentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contentItemText: {
        fontSize: 16,
        color: '#444444',
        fontFamily: 'Rubik',
    },
    contentFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contentFooterText: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Rubik',
    },
})