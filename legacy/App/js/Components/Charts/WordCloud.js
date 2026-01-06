/* @flow */
'use strict';

import React from 'react';

import { View } from 'react-native';

import { StyleSheet } from '../../Common';

import LinearGradient from 'react-native-linear-gradient';

const WordCloud = (props: Object) => {
  const style = props.style;
  const words = props.children;

  if (props.backgroundColors) {
    return (
      <View style={style}>
        <LinearGradient colors={props.backgroundColors} start={{ x: 0, y: 0.25 }} end={{ x: 0.5, y: 1 }} style={styles.container}>
          {words}
        </LinearGradient>
      </View>
    );
  } else {
    return <View style={[styles.container, style]}>{words}</View>;
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
});

export default WordCloud;
