/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Navigator,
  Platform,
  View,
} from 'react-native';

import Modal from './Modal';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

const NavigatorNavigationBarStyles = {
  ...Navigator.NavigationBar.Styles,
  General: {
    ...Navigator.NavigationBar.Styles.General,
    TotalNavHeight: Navigator.NavigationBar.Styles.General.NavBarHeight
  },
  Stages: {
    ...Navigator.NavigationBar.Styles.Stages,
    Left: {
      ...Navigator.NavigationBar.Styles.Stages.Left,
      Title: {
        ...Navigator.NavigationBar.Styles.Stages.Left.Title,
        top: 0,
      },
      LeftButton: {
        ...Navigator.NavigationBar.Styles.Stages.Left.LeftButton,
        top: 0,
      },
      RightButton: {
        ...Navigator.NavigationBar.Styles.Stages.Left.RightButton,
        top: 0,
      }
    },
    Center: {
      ...Navigator.NavigationBar.Styles.Stages.Center,
      Title: {
        ...Navigator.NavigationBar.Styles.Stages.Center.Title,
        top: 0,
      },
      LeftButton: {
        ...Navigator.NavigationBar.Styles.Stages.Center.LeftButton,
        top: 0,
      },
      RightButton: {
        ...Navigator.NavigationBar.Styles.Stages.Center.RightButton,
        top: 0,
      }
    },
    Right: {
      ...Navigator.NavigationBar.Styles.Stages.Right,
      Title: {
        ...Navigator.NavigationBar.Styles.Stages.Right.Title,
        top: 0,
      },
      LeftButton: {
        ...Navigator.NavigationBar.Styles.Stages.Right.LeftButton,
        top: 0,
      },
      RightButton: {
        ...Navigator.NavigationBar.Styles.Stages.Right.RightButton,
        top: 0,
      }
    }
  }
};


type Props = {
  initialRoute: Object,
  popoverStyle: any,
  onPressCancel: Function,
  onDone: Function,
};

export default class Popover extends Component {
  props: Props;

  render() {
    return (
      <View style={styles.overlayContainer}>
        <Modal
          {...this.props}
          initialRoute={this.props.initialRoute}
          modalStyle={styles.popover}
          navigationBarStyles={NavigatorNavigationBarStyles}
          onPressCancel={this.props.onPressCancel}
          onPressDone={this.props.onDone}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
  },
  popover: {
    backgroundColor: 'rgba(255, 255, 255, 0.99)',
    borderRadius: 4,
    position: 'absolute',
    top: 24,
    bottom: 4,
    right: 4,
    left: 4,
    ...Platform.select({
      android: {
        top: 4,
      },
    })
  },
});
