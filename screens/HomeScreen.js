import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

import get from 'lodash/get';
import Emoji from 'react-native-emoji';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { MapView } from 'expo';

import BikeMarker from '../components/BikeMarker';

const GET_BIKE_STATIONS = gql`
  {
    bikeRentalStations {
      id
      stationId
      name
      lat
      lon
      bikesAvailable
      spacesAvailable
      allowDropoff
      state
      realtime
    }
  }
`;

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  mapRef = React.createRef();

  state = {
    hideEmptyStations: false,
    autoRefetch: true,
    // lastRefetch: null,
    userPosition: null,
    region: {
      latitude: 60.167389,
      longitude: 24.93108,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  };

  componentDidMount() {
    // this.setUserPosition();
  }

  onRegionChange = region => {
    // this.setState({ region });
    // Vibration.cancel();
  };

  setUserPosition = async callback => {
    navigator.geolocation.getCurrentPosition(async e =>
      this.setState({
        userPosition: {
          latitude: e.coords.latitude,
          longitude: e.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
      })
    );
  };

  goToUserPosition = async userPosition => {
    await this.mapRef.current.animateToRegion(userPosition, 200);
  };

  handleRefetchClick = refetchFn => {};

  render() {
    return (
      <Query query={GET_BIKE_STATIONS} pollInterval={100}>
        {({ loading, error, data, startPolling, stopPolling }) => {
          if (error) return <Text>Error :(</Text>;

          if (this.state.autoRefetch) {
            startPolling(10000);
          } else {
            stopPolling();
          }

          return (
            <View style={{ flex: 1 }}>
              {loading && (
                <View
                  style={{
                    zIndex: 999999,
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator color="#F1C40F" size="large" />
                </View>
              )}

              <View
                style={{
                  zIndex: 999999,
                  position: 'absolute',
                  top: 40,
                  right: 20,
                  flexDirection: 'column',
                  alignItems: 'space-around',
                }}>
                <TouchableOpacity
                  setOpacityTo={0.4}
                  style={{
                    padding: 16,
                    marginBottom: 10,
                    borderRadius: 300,
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                  }}
                  onPress={() =>
                    this.setState(state => ({ hideEmptyStations: !state.hideEmptyStations }))
                  }>
                  <Emoji
                    name={this.state.hideEmptyStations ? 'see_no_evil' : 'hear_no_evil'}
                    style={{ fontSize: 20 }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  setOpacityTo={0.4}
                  style={{
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 300,
                    backgroundColor: '#fff',
                    borderWidth: 6,
                    borderColor: this.state.autoRefetch ? '#3498DB' : 'transparent',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                  }}
                  onPress={() => this.setState(state => ({ autoRefetch: !state.autoRefetch }))}>
                  <Emoji name="recycle" style={{ fontSize: 20 }} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={{
                  zIndex: 999999,
                  position: 'absolute',
                  bottom: 30,
                  right: 20,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,
                  padding: 16,
                  borderRadius: 300,
                  backgroundColor: '#fff',
                }}
                onPress={() => this.goToUserPosition(this.state.userPosition)}>
                <Emoji name="round_pushpin" style={{ fontSize: 20 }} />
              </TouchableOpacity>

              <MapView
                style={{ flex: 1 }}
                ref={this.mapRef}
                onRegionChange={this.onRegionChange}
                initialRegion={{
                  latitude: 60.168992,
                  longitude: 24.932366,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                showsUserLocation
                onMapReady={() => {
                  this.setUserPosition();
                }}
                showsCompass>
                {get(data, 'bikeRentalStations', [])
                  .filter(station => {
                    // console.log('station', station)
                    return this.state.hideEmptyStations ? station.bikesAvailable !== 0 : true;
                  })
                  .map(station => (
                    <BikeMarker
                      key={station.id}
                      tracksViewChanges={false}
                      coordinate={{ latitude: station.lat, longitude: station.lon }}
                      title={station.name}
                      description={`Free bikes: ${station.bikesAvailable} | Empty slots: ${
                        station.spacesAvailable
                      } `}
                      onPress={e => console.log('onPress', station.id)}
                      onSelect={e => console.log('onSelect', station.id)}
                      freeBikes={station.bikesAvailable}
                      emptySlots={station.spacesAvailable}
                    />
                  ))}
              </MapView>
            </View>
          );
        }}
      </Query>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
