/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  TouchableWithoutFeedback,
  View
} from 'react-native';

import {
  StyleSheet
} from '../../Common';

type State = {
  opened: boolean
};

class MenuContext extends Component {
  state: State;

  constructor(props) {
    super(props);

    this.state = {
      opened: false
    };
  }

  openMenu() {
    this.setState({opened: true});
  }

  closeMenu() {
    this.setState({opened: false});
  }

  render() {
    const { opened } = this.state;
    if (!opened) return null;

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => this.closeMenu()} >
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'flex-end'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});

export { MenuContext };
