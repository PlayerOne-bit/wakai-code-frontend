import {Image, StyleSheet, View} from "react-native";

export default function Avatar(){
    return <View style={styles.container}>
        <Image
        style={styles.image}
        source={require('../../assets/images/icon.png')}
        />
    </View>
}
const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center'
    },
    image:{
        width:80,
        height:80,
        borderRadius:40
    }
});