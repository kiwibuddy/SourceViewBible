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

const Paragraph = (props: Object) => {
  const { paragraphType } = props;
  const lineFeed = paragraphType === 'FlushLeft' ? null : <Text>{"\n"}</Text>;
  const indent = paragraphType === 'FlushLeft' ? null : <View style={[styles.textIndent]} />;
  return (
    <Text>
      {lineFeed}
      {indent}
      {props.children}
    </Text>
  );
};

const ChapterNumber = (props: Object) => (
  <Text style={[styles.scripture, styles.chapterNumber, props.style]}>{props.children}</Text>
);

const VerseNumber = (props: Object) => (
  <Text style={[styles.scripture, styles.verseNumber, props.style]}>{props.children}</Text>
);

const Verse = (props: Object) => (
  <Text style={[styles.scripture, styles.verse, props.style]}>{props.children}</Text>
);

const SourceText = (props: Object) => (
  <Text style={[styles.scripture, props.style]}>{props.children}</Text>
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
        //  console.log(scripture);
         this.setState({scripture});
       }).catch(error => {
         console.log(error);
       });
    })
  }

  render() {
    if (!this.state.scripture) return null;
    return (
      <View style={styles.container}>
        <WebView
          source={{html: this.state.scripture}}
          scalesPageToFit={true}
        />
      </View>
    );
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
  textIndent: {
    width: 30,
    height: 0,
  },
  chapterNumber: {
    color: '#59626A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  verseNumber: {
    fontSize: 14,
  },
});

AppRegistry.registerComponent('TextLayout', () => TextLayout);
