/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

// $FlowFixMe: Can't find os module extension
import LinearGradient from 'react-native-linear-gradient';

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
        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.sourcesLeftContainer}>
                <TouchableOpacity>
                  <Image source={require('../../Images/discoverycenter/btn-delete.png')} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.video}>
              <Image source={require('../../Images/discoverycenter/video-header-dc.png')} />
              <TouchableOpacity style={styles.videoPlay}>
                <Image source={require('../../Images/common/btn-play.png')} />
              </TouchableOpacity>
            </View>
            <View style={styles.gettingstartedContainer}>
              <Image style={styles.gettingstartedIcon} source={require('../../Images/discoverycenter/dc-icon.png')} />
              <Text style={styles.gettingstartedHeader}>Create & Share Discoveries</Text>
              <Text style={styles.gettingstartedBody}>Tap your way to new Biblical insights and share what your find.</Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.sourcesLeftContainer}>
                <TouchableOpacity>
                  <Image source={require('../../Images/discoverycenter/btn-delete.png')} />
                </TouchableOpacity>
              </View>
              <View style={styles.sourcesRightContainer}>
                <TouchableOpacity>
                  <Image source={require('../../Images/discoverycenter/btn-duplicate.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.share}>
                  <Image source={require('../../Images/discoverycenter/btn-share.png')} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.chart}>
              <Image source={require('../../Images/discoverycenter/chart-blankslate.png')} />
              <View style={styles.chartHeader}>
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
                  <TouchableOpacity>
                    <Image source={require('../../Images/discoverycenter/btn-fullscreen.png')} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.message}>
              <View style={styles.filterItem}>
                <TouchableOpacity>
                  <Text style={[styles.chartButton, {color: Colors.tintColor}]}>+ ADD FILTER</Text>
                </TouchableOpacity>
                <View style={styles.filterBlankslate}>
                  <Image source={require('../../Images/discoverycenter/filter-blankslate.png')} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
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
  },
  card: {
    marginHorizontal: 4,
    marginVertical: 5,
    borderRadius: 2,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 0.8,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  header: {
    flex: 0,
    flexDirection: 'row',
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  sourcesLeftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sourcesRightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  share: {
    paddingLeft: 10,
  },
  video: {
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 0.8,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  chart: {
    height: 295,
    backgroundColor: '#5B6771',
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
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  chartButton: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingRight: 15,
  },
  chartFooter: {
    flex: 1,
    position: 'absolute',
    right: 5,
    left: 5,
    top: 245,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
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
  filterItem: {
    padding: 10,
  },
  filterBlankslate: {
    paddingVertical: 50,
    alignSelf: 'center',
  },
});
