/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  View,
  TouchableOpacity,
  NavigationExperimental
} from 'react-native';

const {
  Header: NavigationHeader,
  CardStack: NavigationCardStack
} = NavigationExperimental;

import { connect } from 'react-redux';

const NavigationHeaderBackButton = require('../Common/NavigationHeaderBackButton');

import ScriptureView from './ScriptureView';
import Discover from '../Discover';

import {
  Colors,
  StyleSheet
} from '../../Common';

class Reader extends Component {
  state: {
    book: any
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      book: null
    };
  }

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
    if (props.scene.navigationState.key !== 'scripture') return null;

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
      <TouchableOpacity style={{flex: 1}} onPress={this._onPressDiscover}>
        <NavigationHeader.Title textStyle={{color: Colors.tintColor}}>
            {this.state.book.name}
        </NavigationHeader.Title>
      </TouchableOpacity>
    );
  };

  _renderLeftComponent = (props: Object) => {
    return (props.scene.index > 0 ?  <NavigationHeaderBackButton /> : null);
  };

  _renderScene = (props: Object) => {
    if (props.scene.navigationState.key === 'scripture') {
      return (
        <ScriptureView book={this.state.book} />
      );
    }

    if (props.scene.navigationState.key === 'discover') {
      return (
        <Discover onPressScripture={this._onPressScripture} />
      );
    }
  };

  _onPressScripture = (book: Object) => {
    this.props.onNavigate({
			type: 'BackAction'
		});

    this.setState({
      book
    });
  };

  _onPressDiscover = () => {
    this.props.onNavigate({
      type: 'push',
      route: {
        key: 'discover'
      }
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
