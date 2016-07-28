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

import Emdros from './app/API/Emdros';

const Genesis = {
  first: 1,
  last: 50638,
};

const Genesis1 = {
  first: 1,
  last: 1005,
};

const Genesis1_1 = {
  first: 1,
  last: 100,
};

type State = {
  scripture: any;
};

class TextLayout extends Component {
  state: State;

  constructor(props) {
    super(props);

    this.state = {
      scripture: null
    };
  }

  componentDidMount() {
    Emdros.openDatabase().then(() => {
      const options = {monadSet: Genesis};
       Emdros.scripture(options).then(scripture => {
        //  console.log(scripture);
         this.setState({scripture});
       }).catch(error => {
         console.log(error);
       });
    })
  }

  render() {
    if (this.state.scripture == null) return null;

    return this._renderWebView();
    // return this._renderPlainText();
  }

  _renderWebView() {
    return <WebView
      decelerationRate="normal"
      style={styles.container}
      source={{html: this.state.scripture}}
    />
  };

  _renderPlainText() {
    return (
      <ScrollView style={styles.container}>
        <Text>{this.state.scripture}</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});

AppRegistry.registerComponent('TextLayout', () => TextLayout);
