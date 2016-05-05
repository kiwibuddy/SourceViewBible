/* @flow */

'use strict';

import React, { Component } from 'react';

import {
  Animated,
  NavigationExperimental,
  View,
  Text,
  StyleSheet,
  PropTypes
} from 'react-native';

import { navigatePush, navigatePop } from './actions';

const {
  AnimatedView: NavigationAnimatedView,
  Card: NavigationCard,
  Header: NavigationHeader,
  RootContainer: NavigationRootContainer
} = NavigationExperimental;

import { connect } from 'react-redux';

type Props = {
  navigationState: Object,
  onNavigate: PropTypes.func.isRequired
}

class SourceViewBibleApp extends Component {
  props: Props;
  _renderCard: any;
  _renderHeader: any;
  _renderScene: any;
  _renderTitleComponent: any;

  constructor(props: any) {
    super(props);

    this._renderCard = this._renderCard.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this._renderScene = this._renderScene.bind(this);
    this._renderTitleComponent = this._renderTitleComponent.bind(this);
  }

  render() {
      const { navigationState, onNavigate } = this.props;

      return (
        <NavigationAnimatedView
          navigationState={navigationState}
          style={styles.outerContainer}
          onNavigate={onNavigate}
          renderOverlay={this._renderHeader}
          renderScene={this._renderCard}
        />
      );
    }

    _renderHeader(/*NavigationSceneRendererProps*/ props) {
      return (
        <NavigationHeader
          {...props}
          renderTitleComponent={this._renderTitleComponent}
        />
      );
    }

    _renderTitleComponent(/*NavigationSceneRendererProps*/ props) {
      const title = props.scene.navigationState.title;
      return (
        <NavigationHeader.Title>{title}</NavigationHeader.Title>
      );
    }

    _renderCard(/*NavigationSceneRendererProps*/ props) {
      return (
        <NavigationCard
          {...props}
          renderScene={this._renderScene}
          key={props.scene.navigationState.key}
        />
      );
    }

    _renderScene({scene}) {
      const { navigationState } = scene;

      switch (navigationState.key) {
        case 'First':
          return null;

        default:

      }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default connect(
  state => ({
    navigationState: state.navigationState
  }),
  dispatch => ({
    onNavigate: (action) => {
      if (action.type && (action.type === NavigationRootContainer.getBackAction().type || action.type === NavigationCard.CardStackResponder.Actions.BACK.type)) {
        dispatch(navigatePop());
      } else {
        dispatch(navigatePush(action));
      }
    }
  })
)(SourceViewBibleApp);
