/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';

 const React = require('react');
 import { Component } from 'react';

 import ReactNative from 'react-native';

 const {
   AppRegistry,
   View,
   Text,
   Image,
   ScrollView,
   StyleSheet,
   TouchableOpacity,
   WebView,
 } = ReactNative;

// import Emdros from './app/API/Emdros';

class TextLayout extends Component {
  render() {
    return (
      <WebView
        style={styles.container}
        source={require('./scripture.html')}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: 'red',
  },
});

AppRegistry.registerComponent('TextLayout', () => TextLayout);
