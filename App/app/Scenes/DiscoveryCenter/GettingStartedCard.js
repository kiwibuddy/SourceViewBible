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
  StyleSheet,
} from '../../Common';

import Card from './Card';
import { DeleteButton } from './Buttons';

type Props = {
  card: Object,
  onPressDelete: Function,
};

const GettingStartedCard = (props: Props) => {
  const { card } = props;

  return (
    <Card key={card.key}>
      <Card.Header>
        <View style={styles.leftContainer}>
          <DeleteButton onPress={props.onPressDelete}/>
        </View>
      </Card.Header>
      <View style={styles.video}>
        <View style={styles.videoImage}>
          <Image source={require('../../Images/discoverycenter/video-header-dc.png')} />
        </View>
        <TouchableOpacity style={styles.videoPlay}>
          <Image source={require('../../Images/common/btn-play.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.gettingstartedContainer}>
        <Image style={styles.gettingstartedIcon} source={require('../../Images/discoverycenter/dc-icon.png')} />
        <Text style={styles.gettingstartedHeader}>Create & Share Discoveries</Text>
        <Text style={styles.gettingstartedBody}>Tap your way to new Biblical insights and share what your find.</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  gettingstartedContainer: {
    alignItems: 'center'
  },
  gettingstartedIcon: {
    marginTop: 30,
  },
  gettingstartedHeader: {
    fontSize: 28,
    fontWeight: '700',
    color: '#59626A',
    textAlign: 'center',
    marginTop: 15,
  },
  gettingstartedBody: {
    fontSize: 17,
    color: '#59626A',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
    marginHorizontal: 20,
  },
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
  video: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  videoImage: {
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 0.8,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  videoPlay: {
    flex: 1,
    position: 'absolute',
    right: 0,
    left: 0,
    top: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GettingStartedCard;
