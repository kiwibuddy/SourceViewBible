'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Component,
  View,
  Text,
  TouchableHighlight // eslint-disable-line no-unused-vars
} = React;

class EvalSpike extends Component {
  render() {
    let content = eval(string); // eslint-disable-line no-eval
    return (
      <View style={styles.container}>
        <Text>Hello!</Text>
        {content}
      </View>
    );
  }

  onPress() {
    console.log('Woot!');
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 30
  }
});

var string = `
React.createElement(
  TouchableHighlight,
  { underlayColor: 'gray', onPress: this.onPress },
  React.createElement(
    Text,
    { style: styles.text },
    ' World'
  )
);
`;

AppRegistry.registerComponent('EvalSpike', () => EvalSpike);
