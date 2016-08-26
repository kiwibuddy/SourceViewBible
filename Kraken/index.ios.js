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

const moment = require('moment');
require('moment-duration-format');

const now = require('performance-now');

const Kraken = require('./app/Kraken');

class KrakenApp extends Component {
  state = {
    loading: true,
    elapsedTime: 0,
  };

  componentDidMount() {
    this.kracken();
  }

  render() {
    const { loading, elapsedTime } = this.state;
    const style = (loading ? {backgroundColor: '#F5FCFF'} : {backgroundColor: 'yellowgreen'});
    const title = moment.duration(elapsedTime, 'minutes').format('h:mm:ss');
    const activityIndicator = (loading ? <ActivityIndicator size='large' color='gray' /> : null);

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
    this.interval = setInterval(() => {
      this.setState({
        elapsedTime: (now() - startTime) / 1000,
        loading: true,
      });
    }, 30);

    await Kraken.release();

    clearInterval(this.interval);
    this.setState({loading: false});
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
    fontSize: 36,
    fontFamily: 'Courier New',
    textAlign: 'center',
    margin: 10,
  },
});

AppRegistry.registerComponent('Kraken', () => KrakenApp);
