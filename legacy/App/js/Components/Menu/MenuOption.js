/* @flow */
'use strict';

import React from 'react';

import { Text, TouchableOpacity } from 'react-native';

import { StyleSheet } from '../../Common';

const onSelect = props => {
  props.onSelect();
};

const MenuOption = props => {
  const disabled = props.onSelect === 'undefined' || props.disabled === true;

  const content = props.text ? <Text style={StyleSheet.styles.menu.optionsStyles.optionText}>{props.text}</Text> : props.children;

  return (
    <TouchableOpacity disabled={disabled} onPress={() => onSelect(props)} style={styles.container}>
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
});

export { MenuOption };
