/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  View,
  Text
} from 'react-native';

import {
  Colors,
  StyleSheet
} from '../../Common';

import LinearGradient from 'react-native-linear-gradient';

const WordCloud = (props: Object) => {
  const style = props.style;
  return (
    <View style={style}>
      <LinearGradient
        colors={props.backgroundColors}
        start={[0.0, 0.25]} end={[0.5, 1.0]}
        style={styles.gradient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  }
});

export default WordCloud;
