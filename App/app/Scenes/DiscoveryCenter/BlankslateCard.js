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

import { DeleteButton, DuplicateButton, ShareButton } from './Buttons';

type Props = {
  card: Object,
};

const BlankslateCard = (props: Props) => {
  const { card } = props;
  return (
    <Card key={card.key}>
      <Card.Header>
        <View style={styles.leftContainer}>
          <DeleteButton />
        </View>
        <View style={[styles.rightContainer, {justifyContent: 'flex-end'}]}>
          <DuplicateButton />
          <ShareButton style={styles.share} />
        </View>
      </Card.Header>
      <View style={styles.chart}>
        <Image source={require('../../Images/discoverycenter/chart-blankslate.png')} />
        <View style={[styles.chartHeader, {paddingLeft: 10}]}>
          <TouchableOpacity>
            <Text style={[styles.chartButton, {color: '#FFFFFF'}]}>BAR CHART</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.chartButton, {color: '#FFFFFF'}]}>PIE CHART</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.chartButton, {color: '#FFFFFF'}]}>CLOUD</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chartFooter}>
          <View style={styles.sourcesRightContainer}>
          </View>
        </View>
      </View>
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
  chart: {
    alignItems: 'center',
    backgroundColor: '#5B6771',
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 0.8,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  chartHeader: {
    flex: 1,
    position: 'absolute',
    right: 5,
    left: 5,
    top: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
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
  chartFooter: {
    flex: 1,
    position: 'absolute',
    right: 5,
    left: 5,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
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
