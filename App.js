import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';


export default function App() {

  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({
    latitude: 0, 
    longitude: 0, 
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221});
  
  

  useEffect(() => {
      (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location')
        return;
      }
      let locate = await Location.getCurrentPositionAsync({});
      setCoordinates({
        latitude: parseFloat(locate.coords.latitude), 
        longitude: parseFloat(locate.coords.longitude), 
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221});
      console.log('Location:', coordinates);
      
  })();
    }, []);



    const getPosition = async () => {
      console.log({address})
      try{
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=API_KEY`)
      const data = await response.json();
  
      console.log(data);
      setCoordinates(
        {latitude: data.results[0].geometry.location.lat,
        longitude: data.results[0].geometry.location.lng,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221})
      
      }
      
    catch (e){
      Alert.alert('Error fetching data');
    }
    

      console.log({coordinates})
      
  }
  


  return (
    <View style={styles.container}>
      
      <MapView
        style={styles.map}
        region={coordinates}
        
      >
        <Marker
          coordinate={coordinates}
          //title= {address}
        />
        <Marker
          coordinate={coordinates}
          title= {address}
        />
        
      </MapView>
      
      <TextInput style={{height: 40, width:200 }}  
      placeholder='insert address'
      onChangeText={text => setAddress(text) } 
      value={address}/>
      <Button title="Show" onPress= {getPosition} />
      <StatusBar style="hidden" />
    </View>
  );

  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "75%"
  }
});

