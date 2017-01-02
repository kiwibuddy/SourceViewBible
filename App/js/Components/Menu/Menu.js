/* @flow */
'use strict';

import React from 'react';

import {
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import {
  StyleSheet
} from '../../Common';

const Menu = (props) => {
  return (
    <View style={styles.container}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    paddingBottom: 8,
    borderRadius: 2,
    backgroundColor: 'white',
    width: 200,
    elevation: 5,
  }
});

export { Menu };
