/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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

  _hello = () => {
    console.log('World!!!');
  };

  _world = () => {
    console.log('Hello!!!');
  };
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
    fontSize: 16,
  },
});

AppRegistry.registerComponent('TextLayout', () => TextLayout);
