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
    // Emdros.openDatabase().then(() => {
    //   const options = {monadSet: {first: 1, last: 1005}};
    //    Emdros.scripture(options).then(scripture => {
    //     //  console.log(scripture);
    //      this.setState({scripture});
    //    }).catch(error => {
    //      console.log(error);
    //    });
    // })
  }

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
