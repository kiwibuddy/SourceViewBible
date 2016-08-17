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

const RNFS = require('react-native-fs');

import Emdros from './app/API/Emdros';
import HTML from './app/API/HTML';

const Bible = {
  first: 1,
  last: 1887296
};

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

const Isaiah37_16_To_38_20 = {
  first: 1031400,
  last: 1032838
};

const Psalm72 = {
  first: 884954,
  last: 885806
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
      const options = {monadSet: Isaiah37_16_To_38_20};
       Emdros.scripture(options).then(scripture => {
         //  console.log(scripture);
         this._saveScripture(scripture);

         this.setState({scripture});
       }).catch(error => {
         console.log(error);
       });
    })
  }

  render() {
    if (this.state.scripture == null) return null;

    // return this._renderWebView();
    return this._renderPlainText();
  }

  _renderWebView() {
    const html =  HTML.replace('{{BODY}}', this.state.scripture);
    return <WebView
      decelerationRate="normal"
      style={styles.container}
      source={{html}}
    />
  };

  _renderPlainText() {
    return (
      <ScrollView style={styles.container}>
        <Text style={{fontSize: 10}}>{this.state.scripture}</Text>
      </ScrollView>
    );
  };

  _saveScripture(scripture) {
    const html = HTML.replace('{{BODY}}', scripture);
    RNFS.writeFile('/tmp/Scripture.html', html, 'utf8')
    .then((success) => {
      console.log('Scripture written to /tmp/Scripture.html');
    })
    .catch((err) => {
      console.log(err.message);
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});

AppRegistry.registerComponent('TextLayout', () => TextLayout);
