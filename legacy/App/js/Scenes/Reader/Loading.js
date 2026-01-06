/* @flow */
'use strict';

import React from 'react';
import { View } from 'react-native';

import { StyleSheet } from '../../Common';

type Props = {
  toolbar: ReactElement<any>,
};

const Loading = (props: Props) => {
  return (
    <View style={styles.container}>
      <View style={[styles.container, { flex: 1, flexDirection: 'column', padding: 20 }]}>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.05 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.08 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
        </View>
        <View style={[styles.textPlaceholderContainer, { marginBottom: 20 }]}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.8 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.05 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
        </View>
        <View style={[styles.textPlaceholderContainer, { marginBottom: 20 }]}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.2 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.05 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.08 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.1 }]} />
        </View>
        <View style={[styles.textPlaceholderContainer, { marginBottom: 20 }]}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.2 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.05 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.08 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.05 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.08 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.1 }]} />
        </View>
        <View style={[styles.textPlaceholderContainer, { marginBottom: 20 }]}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.2 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.05 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.08 }]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 0.1 }]} />
        </View>
        <View style={[styles.textPlaceholderContainer, { marginBottom: 20 }]}>
          <View style={[styles.textPlaceholder, { flex: 1 }]} />
          <View style={[styles.whiteSpace, { flex: 1 }]} />
        </View>
      </View>
      {props.toolbar}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  textPlaceholderContainer: {
    height: 10,
    marginVertical: 5,
    flexDirection: 'row',
  },
  textPlaceholder: {
    backgroundColor: '#EDEDED',
    height: 10,
  },
  whiteSpace: {
    backgroundColor: '#FFF',
    height: 10,
  },
});

export default Loading;
