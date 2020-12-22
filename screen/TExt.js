import React from 'react'
import { Text, Image } from 'react-native';
const text = ({ marginTop, pressed, borderBottomColor, text, borderbottomwidth, fontFamily, marginLeft, time, color, date, padding, img, fontSize, align, margin, fontStyle }) => {
    return <Text onPress={pressed} style={{
        fontStyle: fontStyle || 'normal',
        color: color || '#ADABAB',
        margin: margin,
        textShadowColor: '#adadab',
        marginTop: marginTop,
        fontFamily: fontFamily,
        fontSize: fontSize,
        borderBottomWidth: borderbottomwidth,
        borderBottomColor: borderBottomColor,
        marginTop: marginTop,
        marginLeft: marginLeft,
        alignSelf: align || 'center',
        padding: padding
    }} >
        {time || date || text}
        <Image style={{ borderWidth: 100, borderColor: 'black' }} source={img} />
    </Text>
}
export default text;