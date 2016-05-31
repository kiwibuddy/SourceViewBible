/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  View,
  NavigationExperimental
} from 'react-native';

const {
  Header: NavigationHeader,
  CardStack: NavigationCardStack
} = NavigationExperimental;

import { connect } from 'react-redux';

const NavigationHeaderBackButton = require('../Common/NavigationHeaderBackButton');

import Discover from '../Discover';

import { StyleSheet } from '../../Common';

class Reader extends Component {
  render() {
    return (
      <NavigationCardStack
				direction={'vertical'}
				navigationState={this.props.navigation}
				onNavigate={this.props.onNavigate}
				renderScene={this._renderScene}
				renderOverlay={this._renderHeader}
				style={styles.container}
			/>
    );
  }

  _renderHeader = (props: Object) => {
    return null;
    return (
      <NavigationHeader
        {...props}
        style={{elevation: 0}}
        renderTitleComponent={this._renderTitleComponent}
        renderLeftComponent={this._renderLeftComponent}
      />
    );
  };

  _renderTitleComponent = (props: Object) => {
    const title = props.scene.navigationState.title;
    return (
      <NavigationHeader.Title>{title}</NavigationHeader.Title>
    );
  };

  _renderLeftComponent = (props: Object) => {
    if (!props.scene.navigationState.showBackButton) return null;

    return (
      <NavigationHeaderBackButton />
    );
  };

  _renderScene = (props: Object) => {
    if (props.scene.navigationState.key === 'scripture') {
      return (
        <View style={{flex: 1, backgroundColor: 'orange'}}></View>
      );
    }

    if (props.scene.navigationState.key === 'discover') {
      return (
        <Discover />
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green'
  }
});


function mapDispatchToProps(dispatch) {
	return {
		dispatch
	};
}

function mapStateToProps(state) {
  console.log(state);

	return {
		navigation: state.get('reader')
	};
}

export default connect(mapStateToProps, mapDispatchToProps, (stateProps, dispatchProps, ownProps) => {
	return Object.assign({}, dispatchProps, stateProps, {
		onNavigate: (action) => {
			dispatchProps.dispatch(
				Object.assign(action, {
					scope: stateProps.navigation.key
				})
			);
		}
	});
})(Reader);
