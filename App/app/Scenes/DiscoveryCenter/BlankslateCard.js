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
          <ShareButton style={styles.share} />
        </View>
      </Card.Header>
      <ChartBlankslate />
      <View style={styles.message}>
        <View style={styles.filterItem}>
          <View style={styles.leftContainer}>
            <TouchableOpacity>
            <Text style={[styles.chartButton, {color: Colors.tint}]}>+ ADD FILTER</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.filterBlankslate}>
          <Image source={require('../../Images/discoverycenter/filter-blankslate.png')} />
        </View>
      </View>
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
  share: {
    paddingLeft: 10,
  },
  chartButton: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingRight: 15,
  },
  chartProperty: {
    fontSize: 11,
    paddingLeft: 5,
    color: '#FFFFFF'
  },
  chartDropdown: {
    position: 'absolute',
    right: 8,
    top: 12,
  },
  filterItem: {
    flex: 0,
    flexDirection: 'row',
    height: 44,
  },
  filterBlankslate: {
    paddingVertical: 50,
    alignSelf: 'center',
  },
});

export default BlankslateCard;
