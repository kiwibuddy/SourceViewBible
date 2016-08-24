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
   Slider,
   StyleSheet,
   TouchableOpacity,
   TextInput,
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
  scripture: any,
  monadSet: ?Object,
};

export default class TextLayout extends Component {
  state: State;

  constructor(props) {
    super(props);

    this.state = {
      scripture: null,
      monadSet: Genesis
    };
  }

  componentDidMount() {
    Emdros.openDatabase().then(emdros => {
      this._fetchScripture();
    });
  }

  render() {
    if (this.state.scripture == null) return null;

    return this._renderWebView();
    // return this._renderPlainText();
  }

  _renderWebView() {
    const html = this.state.scripture;
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => {
            const { monadSet } = this.state;
            monadSet.first = parseInt(text);
            this.setState({monadSet});
          }}
          onSubmitEditing={() => this._fetchScripture()}
          value={this.state.monadSet.first.toString()}
        />
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => {
            const { monadSet } = this.state;
            monadSet.last = parseInt(text);
            this.setState({monadSet});
          }}
          onSubmitEditing={() => this._fetchScripture()}
          value={this.state.monadSet.last.toString()}
        />
        <WebView
          decelerationRate="normal"
          source={{html}}
        />
      </View>
    )
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

  _fetchScripture = () => {
    const { monadSet } = this.state;

    console.log('Fetching', monadSet);
    const options = {monadSet, spheres:[]};
      Emdros.scripture(options).then(content => {
        const scripture = this._renderScripture(content);
        this._saveScripture(scripture);

        this.setState({scripture});
      }).catch(error => {
        console.log(error);
      });
   }

   _renderScripture = (content: string) => {
      const isPsalms = false;

      let html = HTML.replace('{{BODY}}', content);
      html = html.replace(new RegExp('{{BOOK_NAME}}', 'g'), 'BOOK');
      html = html.replace('{{IS_PSALMS}}', (isPsalms ? 'true' : 'false'));

      // const fontStepSize = Preference.numberForKey(Preference.Keys.Reader.fontStepSize) || 0;
      const fontSize = 13;//Math.ceil((ReaderBaseFontSize + (fontStepSize * ReaderFontStepSize)) * ReaderWebFontConversion);
      const lineHeight = 24;//Math.ceil((ReaderBaseLineHeight + (fontStepSize * ReaderFontStepSize)) * ReaderWebFontConversion);

      html = html.replace('{{FONT_SIZE}}', fontSize.toString());
      html = html.replace('{{LINE_HEIGHT}}', lineHeight.toString());

      let showNumbers = true;//Preference.booleanForKey(Preference.Keys.Reader.showNumbers);
      if (showNumbers == null) showNumbers = true;
      html = html.replace(new RegExp('{{NUMBER_DISPLAY}}', 'g'), showNumbers ? '' : 'display: none;');

      return html;
    };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  textInput: {
    fontSize: 14,
    backgroundColor: '#ececec',
    borderColor: '#ececec',
    borderRadius: 3,
    borderWidth: 1,
    paddingLeft: 8,
    marginHorizontal: 8,
    marginVertical: 8,
    height: 26,
    padding: 0,
  },
});
