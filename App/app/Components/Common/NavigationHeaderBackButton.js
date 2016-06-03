/* @flow */
'use strict';

const React = require('react');
const ReactNative = require('react-native');
const NavigationContainer = require('NavigationContainer');
const NavigationRootContainer = require('NavigationRootContainer');

const {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} = ReactNative;

import Colors from '../../Common/Colors';

type Props = {
  onNavigate: Function,
  children: [any]
}

const NavigationHeaderBackButton = (props: Props) => (
  <TouchableOpacity style={styles.buttonContainer} onPress={() => props.onNavigate(NavigationRootContainer.getBackAction())}>
    <Image
      style={styles.button}
      source={require('../../Images/common/back.png')}
    />
    {props.children}
  </TouchableOpacity>
);

NavigationHeaderBackButton.propTypes = {
  onNavigate: React.PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 24,
    width: 24,
    margin: Platform.OS === 'ios' ? 10 : 16,
    resizeMode: 'contain',
    tintColor: Colors.tintColor,
  }
});

module.exports = NavigationContainer.create(NavigationHeaderBackButton);
