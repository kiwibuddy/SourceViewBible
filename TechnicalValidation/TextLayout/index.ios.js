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
 } = ReactNative;

import Emdros from './app/API/Emdros';

const Paragraph = (props: Object) => (
  <Text>
    {"\n"}
    <View style={styles.paragraph} />
    {props.children}
  </Text>
);

const VerseNumber = (props: Object) => (
  <Text style={styles.verseNumber}>{props.children}</Text>
);

const Verse = (props: Object) => (
  <Text style={[styles.scripture, styles.verse, props.style]}>{props.children}</Text>
);

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
      const options = {monadSet: {first: 1, last: 1005}};
       Emdros.scripture(options).then(scripture => {
         this.setState({scripture});
       }).catch(error => {
         console.log(error);
       });
    })
  }

  render() {
    if (!this.state.scripture) return null;
    const scripture = eval(this.state.scripture);

    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scriptureContainer}
        >
          {scripture}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scriptureContainer: {
    marginVertical: 20,
    marginHorizontal: 25,
    paddingBottom: 25,
  },
  scripture: {
    fontFamily: 'Hoefler Text',
    fontSize: 18,
    lineHeight: 30,
  },
  sourceColorRed: {
    color: 'red',
  },
  sourceColorBlack: {
    color: 'black',
  },
  sourceColorGreen: {
    color: 'green',
  },
  sourceColorBlue: {
    color: 'blue'
  },
  paragraph: {
    width: 30,
    height: 1,
    // backgroundColor: 'red',
  },
  chapterNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  verse: {

  },
  verseNumber: {
    color: 'gray',
    fontSize: 14,
  },
});

AppRegistry.registerComponent('TextLayout', () => TextLayout);
