/* @flow */
'use strict';

import React from 'react';

import { ScrollView, Text, View } from 'react-native';

import { Localizable, StyleSheet } from '../../Common';

import { NavigationHeader, NavigationBarButton } from '../../Components/Navigation';
import { BACK } from '../../Navigation';

type Props = {
  title: string,
  navigate: Function,
};

const Terms = (props: Props) => {
  return (
    <View style={styles.container}>
      <NavigationHeader
        navigate={props.navigate}
        title={props.title}
        renderLeftComponent={(props: Object) => <NavigationBarButton title={Localizable.t('back')} onPress={() => props.navigate(BACK)} />}
      />
      <ScrollView style={styles.scrollView}>
        <Text>Terms</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
});

export default Terms;
