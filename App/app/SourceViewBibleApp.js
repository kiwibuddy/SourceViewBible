/* @flow */

'use strict';

import React, { Component } from 'react';

import {
  Animated,
  NavigationExperimental,
  View,
  Text,
  PropTypes
} from 'react-native';

import StyleSheet from './common/stylesheet'

import BackAndroid from 'BackAndroid';

import { navigatePush, navigatePop } from './actions';

import Discover from './components/discover';
import Books from './components/books';
import Book from './components/books/book';

import Emdros from 'react-native-emdros';
let DB = null;

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
  _handlers: (any);

  constructor(props: any) {
    super(props);

    this._renderCard = this._renderCard.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this._renderScene = this._renderScene.bind(this);
    this._renderTitleComponent = this._renderTitleComponent.bind(this);
    this._handlers = [];

    this.openDatabase();
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this._handleBackButton.bind(this));
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this._handleBackButton.bind(this));
  }

  getChildContext() {
    return {
      addBackButtonListener: this.addBackButtonListener,
      removeBackButtonListener: this.removeBackButtonListener,
    };
  }

  addBackButtonListener(listener) {
    this._handlers.push(listener);
  }

  removeBackButtonListener(listener) {
    this._handlers = this._handlers.filter((handler) => handler !== listener);
  }

  _handleBackButton() {
    for (let i = this._handlers.length - 1; i >= 0; i--) {
      if (this._handlers[i]()) {
        return true;
      }
    }

    const { navigationState, onNavigate } = this.props;

    if (navigationState && navigationState.children[navigationState.children.length - 1].key === 'discover') {
      return false;
    }

    onNavigate(NavigationRootContainer.getBackAction());
    return true;
  }

  openDatabase() {
    Emdros.open({name: "Datasets/en/NLT/sourceview.bpt"}).then((emdros) => {
      console.log("Database opened!" + emdros);
      DB = emdros;
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
      const { navigationState, onNavigate } = this.props;

      return (
        <NavigationAnimatedView
          navigationState={navigationState}
          style={styles.container}
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
          style={{elevation: 0}}
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
        case 'discover':
          return <Discover />;

        case 'books':
          return <Books />;

        case 'book':
          return <Book book={navigationState.book} />;

        default:
          return null;
      }
    }
}

SourceViewBibleApp.childContextTypes = {
  addBackButtonListener: React.PropTypes.func,
  removeBackButtonListener: React.PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default connect(
  state => ({
    navigationState: state.navigationState
  }),
  dispatch => ({
    onNavigate: (action) => {
      if (action.type && (action.type === NavigationRootContainer.getBackAction().type || action.type === NavigationCard.CardStackPanResponder.Actions.BACK.type)) {
        dispatch(navigatePop());
      } else {
        dispatch(navigatePush(action));
      }
    }
  })
)(SourceViewBibleApp);
