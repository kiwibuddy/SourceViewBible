/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

const now = require('performance-now');

const Kraken = require('./app/Kraken');

class KrakenApp extends Component {
  state = {
    loading: true,
    elapsedTime: null,
  };

  componentDidMount() {
    this.kracken();
  }

  render() {
    const { loading, elapsedTime } = this.state;
    const style = (loading ? {backgroundColor: '#F5FCFF'} : {backgroundColor: 'yellowgreen'});
    const title = (loading ? 'Releasing...' : `Released in ${elapsedTime}s`);
    const activityIndicator = (loading ? <ActivityIndicator size="large" color="gray" /> : null);

    return (
      <View style={[styles.container, style]}>
        <Text style={styles.welcome}>
          {title}
        </Text>
        {activityIndicator}
      </View>
    );
  }

  async kracken() {
    const startTime = now();

    await Kraken.release();

    const endTime = now();
    const elapsedTime = ((endTime - startTime) / 1000).toFixed(3);

    this.setState({loading: false, elapsedTime});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
});

AppRegistry.registerComponent('Kraken', () => KrakenApp);
