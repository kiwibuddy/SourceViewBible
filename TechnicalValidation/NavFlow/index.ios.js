/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  AppRegistry,
  Image,
  Easing,
  NavigationExperimental,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
import NavigationExampleRow from './NavigationExampleRow';

import type  {
  NavigationSceneRendererProps,
  NavigationState,
  NavigationTransitionProps,
  NavigationTransitionSpec,
} from 'NavigationTypeDefinition';

const {
  PropTypes: NavigationPropTypes,
  StateUtils: NavigationStateUtils,
  Transitioner: NavigationTransitioner,
} = NavigationExperimental;

/**
 * Sets the focused route to the previous route.
 */
function back(state: NavigationState): NavigationState {
  const index = state.index - 1;
  const route = state.routes[index];
  return route ? NavigationStateUtils.jumpToIndex(state, index) : state;
}

/**
 * Sets the focused route to the next route.
 */
function forward(state: NavigationState): NavigationState {
  const index = state.index + 1;
  const route = state.routes[index];
  return route ? NavigationStateUtils.jumpToIndex(state, index) : state;
}

function reducer(state: ?NavigationState, action: any): NavigationState {
  if (!state) {
    return {
      index: 0,
      routes: [{key: 'route-1'}],
    };
  }

  switch (action) {
    case 'push':
      const route = {key: 'route-' + (state.routes.length + 1)};
      return NavigationStateUtils.push(state, route);
    case 'pop':
      return NavigationStateUtils.pop(state);
    case 'back':
      return back(state);
    case 'forward':
      return forward(state);
  }
  return state;
}

type State = {
  navigationState: NavigationState,
};

class NavFlow extends Component {
  state: State;

  constructor(props, context) {
    super(props, context);

    this.state = {
      navigationState: reducer(),
    };
  }

  render(): ReactElement<any> {
    return (
      <Navigator
        navigationState={this.state.navigationState}
        navigate={action => this._navigate(action)}
      />
    );
  }

  _navigate(action: any): boolean {
    if (action === 'exit') {
      // Exits the example. `this.props.onExampleExit` is provided
      // by the UI Explorer.
      this.props.onExampleExit && this.props.onExampleExit();
      return false;
    }

    const navigationState = reducer(this.state.navigationState, action);
    if (navigationState === this.state.navigationState) {
      return false;
    }

    console.log('navigate', navigationState);

    this.setState({navigationState});
    return true;
  }

  // This public method is optional. If exists, the UI explorer will call it
  // the "back button" is pressed. Normally this is the cases for Android only.
  handleBackAction(): boolean {
    return this._navigate('pop');
  }
}

class Navigator extends Component {
  props: {
    navigate: Function,
    navigationState: NavigationState,
  };

  static propTypes: {
    navigationState: NavigationPropTypes.navigationState.isRequired,
    navigate: PropTypes.func.isRequired,
  };

  render(): ReactElement<any> {
    return (
      <NavigationTransitioner
        navigationState={this.props.navigationState}
        render={this._render}
        configureTransition={this._configureTransition}
      />
    );
  }

  _render = (props: NavigationTransitionProps): ReactElement<any> => {
    const scenes = props.scenes.map((scene) => {
      const sceneProps = {
        ...props,
        scene,
      };
      return this._renderScene(sceneProps);
    });

    const navigationBar = this._renderNavigationBar(props);
    const toolbar = this._renderToolbar(props);

    return (
      <View
        style={styles.container}>
        <View
          style={styles.scenes}>
          {scenes}
        </View>
        {navigationBar}
        {toolbar}
      </View>
    );
  }

  _renderNavigationBar = (props: NavigationTransitionProps) => {
    return (
      <View style={styles.navigationBar}>
        <View style={styles.title}>
          <Text style={styles.titleText}>{props.scene.route.key}</Text>
        </View>
      </View>
    )
  };

  _renderScene = (sceneProps: NavigationSceneRendererProps): ReactElement<any> => {
    return (
      <ExampleScene
        {...sceneProps}
        key={sceneProps.scene.key}
        navigate={this.props.navigate}
      />
    );
  };

  _renderToolbar = (props: NavigationTransitionProps) => {
    const { navigate } = this.props;

    const canGoBack = props.navigationState.index > 0;
    const backButtonStyle = {
      tintColor: canGoBack ? 'red' : 'gray'
    };

    const canGoForward = props.navigationState.index < props.navigationState.routes.length - 1;
    const forwardButtonStyle = {
      tintColor: canGoForward ? 'red' : 'gray'
    };

    return (
      <View style={styles.toolbar}>
        <TouchableHighlight
          disabled={!canGoBack}
          onPress={() => navigate('back')}
          style={styles.toolbarButton}
          underlayColor="rgba(0,0,0,.2)"
        >
          <Image style={[styles.toolbarButtonIcon, backButtonStyle]} source={require('./back.png')} />
        </TouchableHighlight>

        <TouchableHighlight
          disabled={!canGoForward}
          onPress={() => navigate('forward')}
          style={styles.toolbarButton}
          underlayColor="rgba(0,0,0,.2)"
        >
          <Image style={[styles.toolbarButtonIcon, forwardButtonStyle]} source={require('./forward.png')} />
        </TouchableHighlight>
      </View>
    )
  };

  _configureTransition = (): NavigationTransitionSpec => {
    const easing: any = Easing.inOut(Easing.ease);
    return {
      duration: 400,
      easing,
    };
  }
}

class ExampleScene extends Component {
  props: NavigationSceneRendererProps & {
    navigate: Function,
  };

  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    navigate: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps: Object, nextState: void): boolean {
    return ReactComponentWithPureRenderMixin.shouldComponentUpdate.call(
      this,
      nextProps,
      nextState
    );
  }

  render(): ReactElement<any> {
    const {scene, navigate} = this.props;
    return (
      <Animated.View
        style={[styles.scene, this._getAnimatedStyle()]}>
        <ScrollView style={styles.scrollView}>
          <NavigationExampleRow
            text={scene.route.key}
          />
          <NavigationExampleRow
            text="Push Route"
            onPress={() => navigate('push')}
          />
        </ScrollView>
      </Animated.View>
    );
  }

  _getAnimatedStyle(): Object {
    const {
      layout,
      position,
      scene,
    } = this.props;

    const {
      index,
    } = scene;

    const inputRange = [index - 1, index, index + 1];
    const width = layout.initWidth;
    const translateX = position.interpolate({
      inputRange,
      outputRange: [width, 0, -width],
    });

    return {
      transform: [
        { translateX },
      ],
    };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scenes: {
    flex: 1,
  },
  scene: {
    backgroundColor: '#E9E9EF',
    bottom: 0,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    // shadowColor: 'black',
    // shadowOffset: {width: 0, height: 0},
    // shadowOpacity: 0.4,
    // shadowRadius: 10,
    top: 0,
  },
  scrollView: {
    flex: 1,
    marginTop: 44 + 20,
  },
  navigationBar: {
    alignItems: 'center',
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
    borderBottomColor: 'rgba(0, 0, 0, .15)',
    borderBottomWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
    elevation: 4,
    flexDirection: 'row',
    height: 44 + 20,
    justifyContent: 'flex-start',
    left: 0,
    marginBottom: 16, // This is needed for elevation shadow
    position: 'absolute',
    right: 0,
    top: 0,
  },
  toolbar: {
    position: 'absolute',
    height: 44,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
    borderTopColor: 'rgba(0, 0, 0, .15)',
    borderTopWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  toolbarButton: {
    width: 30,
    height: 30,
  },
  toolbarButtonIcon: {
    width: 30,
    height: 30,
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left'
  }
});

AppRegistry.registerComponent('NavFlow', () => NavFlow);
