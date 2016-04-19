'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicatorIOS,
  View,
} from 'react-native';

import Emdros from 'react-native-emdros';
var DB = null;
let dismissKeyboard = require('dismissKeyboard');
let STYLESHEET = require('./emdros.json');

class HarvestEmdros extends Component {
  constructor() {
    super();
    this.openDatabase();
    this.state = {
      loading: false,
      log: null,
      query: 'Amo'
    };
  }

  openDatabase() {
    Emdros.open({name: "sourceview.bpt"}).then((emdros) => {
      console.log("Database opened!" + emdros);
      DB = emdros;
    }).catch((error) => {
      console.log(error);
    });
  }

  queryDatabase() {
    dismissKeyboard();
    this.setState({loading: true});
    let options = {stylesheet: STYLESHEET};
    DB.string(1,107, options).then((result) => {
      console.log("String: " + result);
      this.setState({loading: false, data: result});
    }).catch((error) => {
      console.log("Error getting string " + error);
      this.setState({loading: false});
    });
  }

  handleTextChange(event) {
    const query = event.nativeEvent.text;
    this.setState({query})
  }

  render() {
    var activityIndicator = null;
    if (this.state.loading) {
      activityIndicator = <ActivityIndicatorIOS
          style={[{marginLeft: 20}]}
          color="white"
      />;
    }

    var text = (this.state.data ? <Text>{this.state.data}</Text> : null);

    return (
      <View style={styles.mainContainer}>
        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={(e) => this.queryDatabase()}
            hitSlop={{top: 30, bottom: 30, left: 60, right: 60}}>
            <Text style={styles.toolbarButton}>
              Query Database
            </Text>
          </TouchableOpacity>
          {activityIndicator}
        </View>
        {text}
      </View>
    );
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
  toolbar: {
      backgroundColor: '#51c04d',
      paddingTop: 30,
      paddingBottom: 10,
      flexDirection: 'row',
      justifyContent: 'center',
  },
  toolbarButton: {
      color: 'blue',
      textAlign: 'center',
      flex: 1
  },
  mainContainer: {
      flex: 1
  },
  input: {
    height: 40,
    margin: 10,
  }
});

AppRegistry.registerComponent('HarvestEmdros', () => HarvestEmdros);
