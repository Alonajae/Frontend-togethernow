import { useEffect, useState } from 'react';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import {RNCamera} from 'react-native-camera';

export default function IdScreen() {

 const [hasPermission, setHasPermission] = useState(false);
 const isFocused = useIsFocused();

 useEffect(() => {
   (async () => {
     const { status } = await Camera.requestCameraPermissionsAsync();
     setHasPermission(status === 'granted');
   })();
 }, []);


 if (!hasPermission || !isFocused) {
   return <View></View>;
 }

 return (
   <Camera></Camera>
 );
}