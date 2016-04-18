/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
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

import Chart from './chart';
var dismissKeyboard = require('dismissKeyboard');

class QueryEmdros extends Component {
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
    DB.query(this.state.query).then((result) => {
      this.setState({loading: false, data: result});


    }).catch((error) => {
      console.log("Error executing query" + error);
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

    var chart = (this.state.data == null ? null : <Chart data={this.state.data}/>);

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
        <TextInput
          style={styles.input}
          multiline={true}
          autoCorrect={false}
          onChangeText={(query) => this.setState({query})}
          value={this.state.query}
        />
        <View style={styles.chart}>
        {chart}
        </View>
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
  },
  chart: {
    height: 200,
  }
});

AppRegistry.registerComponent('QueryEmdros', () => QueryEmdros);
