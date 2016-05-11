/* @flow */
'use strict';

import React, { Component } from 'react';
import ReactNative, { View, Text, NavigationExperimental } from 'react-native';
const { Header: NavigationHeader } = NavigationExperimental;
import { connect } from 'react-redux';

import StyleSheet from '../../common/stylesheet';
import Colors from '../../common/colors';
import Platform from '../../common/platform';

class Book extends Component {
  render() {
    return(
      <View style={styles.container}>
        <View style={styles.sourcefilter}>
          <View style={styles.sourceButtonContainer}>
          <Text style={[styles.sourceButtonTitle, styles.tintBlack]}>37%</Text>
            <View style={[styles.roundButton, styles.borderBlack]}>
            <Text style={[styles.roundButtonTitle, styles.tintBlack]}>NARRATOR</Text>
            </View>
          </View>
          <View style={styles.sourceButtonContainer}>
          <Text style={[styles.sourceButtonTitle, styles.tintRed]}>37%</Text>
            <View style={[styles.roundButton, styles.borderRed]}>
            <Text style={[styles.roundButtonTitle, styles.tintRed]}>GOD</Text>
            </View>
          </View>
          <View style={styles.sourceButtonContainer}>
            <Text style={[styles.sourceButtonTitle, styles.tintGreen]}>37%</Text>
            <View style={[styles.roundButton, styles.borderGreen]}>
            <Text style={[styles.roundButtonTitle, styles.tintGreen]}>LEAD</Text>
            </View>
          </View>
          <View style={styles.sourceButtonContainer}>
            <Text style={[styles.sourceButtonTitle, styles.tintBlue]}>37%</Text>
            <View style={[styles.roundButton, styles.borderBlue]}>
              <Text style={[styles.roundButtonTitle, styles.tintBlue]}>SUPPORT</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: NavigationHeader.HEIGHT,
  },
  sourcefilter: {
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 10,
  },
  sourceButtonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  sourceButtonTitle: {
    fontSize: 25,
    fontWeight: '300',
    marginBottom: 5,
    alignSelf: 'center',
  },
  roundButton: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  tintBlack: {
    color: 'black',
  },
  borderBlack: {
    borderColor: 'black',
  },
  tintRed: {
    color: '#fc3d39',
  },
  borderRed: {
    borderColor: '#fc3d39',
  },
  tintGreen: {
    color: '#4cda65',
  },
  borderGreen: {
    borderColor: '#4cda65',
  },
  tintBlue: {
    color: '#017bff',
  },
  borderBlue: {
    borderColor: '#017bff',
  },
  roundButtonTitle: {
    fontSize: 11,
  },
  ...Platform.select({
      ios: {
      },
      android: {
      },
  })
});

const mapStateToProps = (state) => {
  return {

  };
}

const mapDispatchToProps = (dispatch) => {
  return {

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Book);
