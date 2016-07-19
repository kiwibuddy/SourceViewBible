/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import { NavigationBar, Toolbar, ToolbarButton } from '../../Components/Navigation';

type Props = {
  onPressDone: Function,
};

export default class DiscoveryCenter extends Component {
  props: Props;

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar title={Localizable.t('discovery-center')}>
          <TouchableOpacity
            onPress={this.props.onPressDone}
            style={{position: 'absolute', right: 0}}
          >
            <Text style={StyleSheet.styles.navigationBar.doneButtonTitle}>{Localizable.t('done')}</Text>
          </TouchableOpacity>
        </NavigationBar>
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.video}>
              <TouchableOpacity style={styles.videoPlay}>
                <Image source={require('../../Images/common/btn-play.png')} />
              </TouchableOpacity>
              <Image source={require('../../Images/discoverycenter/video-header-dc.png')} />
            </View>
            <View style={styles.message}></View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8D8D8'
  },
  content: {
    flex: 1,
    marginTop: NavigationBar.HEIGHT,
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 5,
    borderRadius: 2,
    backgroundColor: '#fff',
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 0.8,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  video: {
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 0.8,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  }
});
