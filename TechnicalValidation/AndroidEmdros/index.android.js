/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

 let React = require('react-native');

 let {
   AppRegistry,
   Component,
   StyleSheet,
   Text,
   ScrollView,
   TextInput,
   TouchableOpacity,
   View,
 } = React;

 import Emdros from 'react-native-emdros';
 var DB = null;
 let dismissKeyboard = require('dismissKeyboard');
 let STYLESHEET = require('./emdros.json');


class AndroidEmdros extends Component {
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
      let options = {stylesheet: JSON.stringify(STYLESHEET)};
      DB.string(1,10500, options).then((result) => {
        let foo = 'React.createElement(ScrollView, {}, ' + result.slice(0, -1) + ')';
        // console.log("String:" + foo);
        this.setState({loading: false, data: foo});
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


      let scripture =  (this.state.data ? eval(this.state.data) : null);
      var text = (scripture ? <View style={styles.container}>{scripture}</View> : null);

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
      margin: 10,
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
    scripture: {
      fontSize: 20
    },
    Red: {
      color: "#ff0000",
    },
    Black: {
      color: "#000000",
    },
    Green: {
      color: "#00fc00",
    },
    Blue: {
      "color": "#0000ff"
    }
  });

AppRegistry.registerComponent('AndroidEmdros', () => AndroidEmdros);
