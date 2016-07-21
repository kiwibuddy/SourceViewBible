/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Colors,
  StyleSheet,
} from '../../Common';

import Card from './Card';
import ChartBlankslate from './ChartBlankslate';
import FilterBlankslate from './FilterBlankslate';

import { DeleteButton, DuplicateButton, ShareButton } from './Buttons';

type Props = {
  card: Object,
  onPressDelete: Function,
};

const BlankslateCard = (props: Props) => {
  const { card } = props;
  return (
    <Card key={card.key}>
      <Card.Header>
        <View style={styles.leftContainer}>
          <DeleteButton onPress={props.onPressDelete}/>
        </View>
        <View style={[styles.rightContainer, {justifyContent: 'flex-end'}]}>
          <DuplicateButton />
          <ShareButton style={{paddingLeft: 10}} />
        </View>
      </Card.Header>
      <ChartBlankslate />
      <FilterBlankslate />
    </Card>
  );
};

const styles = StyleSheet.create({
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(255, 255, 255, 0.35)',
    paddingHorizontal: 10,
    height: 44,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 44,
  },
});

export default BlankslateCard;
