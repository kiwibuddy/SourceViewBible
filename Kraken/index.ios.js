/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

const Kraken = require('./app/Kraken');

class KrakenApp extends Component {
  state = {
    loading: true
  };

  componentDidMount() {
    this.kracken();
  }

  render() {
    const { loading } = this.state;
    const style = (loading ? {backgroundColor: '#F5FCFF'} : {backgroundColor: 'yellowgreen'});
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }

  async kracken() {
    await Kraken.release();
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
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Kraken', () => KrakenApp);
