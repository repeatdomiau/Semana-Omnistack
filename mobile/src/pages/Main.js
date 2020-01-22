import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';
import colors from '../utils/Colors';

function Main({ navigation }) {
  const [devs, setDevs] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [techs, setTechs] = useState('');

  Main.propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();
      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        });
      }
    }
    if (!currentRegion) loadInitialPosition();
  });

  async function loadDevs() {

    const { latitude, longitude } = currentRegion;
    api.get('/search', {
      params: {
        latitude,
        longitude,
        techs
      }
    })
      .then((response) => {
        setDevs(response.data);
      });
  }

  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  if (!currentRegion) return null;
  return (
    <>
      <MapView onRegionChangeComplete={handleRegionChanged} initialRegion={currentRegion} style={styles.map}>
        {devs.map(dev => (
          <Marker key={dev.github_username} coordinate={{
            longitude: dev.location.coordinates[0],
            latitude: dev.location.coordinates[1]
          }}>
            <Image style={styles.avatar} source={{uri : dev.avatar_url}} />
            <Callout onPress={() => {
              navigation.navigate('Profile', { github_username: dev.github_username });
            }}>
              <View style={styles.callout} >
                <Text style={styles.devName}>{dev.name || dev.github_username}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
              </View>
            </Callout>
          </Marker>
        ))}

      </MapView>
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por tecnologias..."
          placeholderTextColor={colors.color999}
          autoCapitalize="words"
          autoCorrect={false}
          onChangeText={setTechs}
        />

        <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
          <MaterialIcons name="my-location" size={20} color={colors.white} />
        </TouchableOpacity>

      </View>
    </>
  );
}



const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderRadius: 2,
    borderWidth:0, 
    height: 54,
    overflow:'hidden',
    width: 54,
  },
  callout: {
    borderRadius: 2,
    width: 260,
  },
  devBio: {
    color: colors.color666,
    marginTop: 5
  },
  devName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  devTechs: {
    marginTop: 5,
  },
  loadButton: {
    alignItems: 'center',
    backgroundColor: colors.bgPurple,
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    marginLeft: 15,
    width: 50,
  },
  map: { flex: 1 },
  searchForm: {
    flexDirection: 'row',
    left: 20,
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 5,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderRadius: 25,
    color: colors.color333,
    elevation: 2,
    flex: 1,
    fontSize: 16,
    height: 50,
    paddingHorizontal: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
  },
});

export default Main;