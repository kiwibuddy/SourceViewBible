/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  BackAndroid,
  Image,
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import { FilterType } from './Constants';

import Card from './Card';
import GettingStartedCard from './GettingStartedCard';
import Popover from '../../Components/Common/Popover';
import { DeleteButton, DuplicateButton, ShareButton } from './Buttons';

import LinearGradient from 'react-native-linear-gradient';

import { NavigationHeader, NavigationBarButton, Toolbar, ToolbarButton } from '../../Components/Navigation';

import { 
  Menu,
  MenuContext,
  MenuOption,
  MenuOptions
} from '../../Components/Menu';

import { BACK, discoveryCenterURL, discoveryCenterHelpURL, occurrencesURL } from '../../Navigation';

import { Discovery } from '../../Preferences';
import Query from './Query';

const SCROLLVIEW_REF = 'scrollview';

type Props = {
  navigate: Function,
};

type State = {
  cards: any,
  popover: any,
};

export default class DiscoveryCenter extends Component {
  props: Props;
  state: State;
  _menu: any;
  _shouldScrollToBottom: boolean;

  contentHeight: number;

  constructor(props: Object) {
    super(props);

    this.contentHeight = 0;

    const discoveries = Discovery.all();
    const cards = discoveries.length == 0 ? [{id: 'getting-started', occurrenceCount: 0, filters: []}] : discoveries.map(discovery => discovery.card);
    this.state = {
      cards,
      popover: null
    };
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this._onHardwareBackPress);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this._onHardwareBackPress);
  }

  render() {
    const popover = this._renderPopover();
    const header = popover && Platform.OS === 'android' ? null : this._renderNavigationHeader();
    const toolbar = popover && Platform.OS === 'android' ? null : this._renderToolbar();
    const cards = this.state.cards.map(card => this._renderCard(card));
    const menu = this._renderMenu(this);

    return (
      <View style={styles.container}>
        {header}
        <ScrollView ref={SCROLLVIEW_REF}
          style={styles.content}
          onContentSizeChange={(w, h) => {
            this.contentHeight = h;
            if (this._shouldScrollToBottom) {
              this._shouldScrollToBottom = false;
              this._scrollToBottom();
            }
          }}
        >{cards}</ScrollView>
        {toolbar}
        {popover}
        {menu}
      </View>
    );
  }

  _renderNavigationHeader = () => {
    return (
      <NavigationHeader
        navigate={this.props.navigate}
        title={Localizable.t('discovery-center')}
        renderLeftComponent={(props: Object) => <NavigationBarButton
          title={Localizable.t('done')}
          titleStyle={StyleSheet.styles.navigationBar.doneButtonTitle}
          onPress={() => this.props.navigate(BACK)}
        />}
        renderRightComponent={this._renderRightComponent.bind(this)}
      />
    );
  }

  _renderRightComponent(props: Object) {
    if (Platform.OS === 'android') {
      return (
        <View>
          <NavigationBarButton
            imageSource={require('../../Components/Navigation/Images/nav-more.png')}
            onPress={() => this._menu.openMenu('menu')}
            style={{height: NavigationHeader.HEIGHT}}
          />
        </View>
      );
    }

    return (
      <NavigationBarButton
       imageSource={require('../../Components/Navigation/Images/nav-help.png')}
       onPress={() => this.props.navigate(discoveryCenterHelpURL({title: Localizable.t('help'), modal: true}))}
     />
   );
  }

  _renderMenu = (props: Object) => {
    if (Platform.OS !== 'android') return null;

    return (
      <MenuContext ref={component => this._menu = component} style={{flex: 1}}>
        <Menu>
          <MenuOptions customStyles={StyleSheet.styles.menu.optionsStyles}>
            <MenuOption key="help" text={Localizable.t('help')} onSelect={() => this.props.navigate(discoveryCenterHelpURL({title: Localizable.t('help'), modal: true}))} />
          </MenuOptions>
        </Menu>
      </MenuContext>
    );
  }

  _renderToolbar = (props: any) => {
    if (Platform.OS === 'android') {
      return (
        <View style={styles.addButton}>
          <TouchableOpacity onPress={this._onPressAdd}>
            <Text style={{flex: 1, fontSize: 30, color: '#FFF', alignSelf: 'center', textAlign: 'center', paddingTop: 6}}>+</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Toolbar>
        <ToolbarButton
          imageSource={require('./Images/btn-add-card.png')}
          onPress={this._onPressAdd}
        />
      </Toolbar>
    );
  };

  _renderCard = (card: Object) => {
    if (card.id === 'getting-started') {
      return <GettingStartedCard
        key={card.id}
        card={card}
        onPressDelete={() => this._deleteCard(card)}
      />;
    } else {
      return <Card
        ref={card.id}
        key={card.id}
        card={card}
        onPressDelete={() => this._deleteCard(card)}
        onPressDuplicate={(card) => this._duplicateCard(card)}
        onPressOccurrences={(card) => this._onPressOccurrences(card)}
        onShowPopover={(props, onComplete) => this._showPopover(props, onComplete)}
      />;
    }
  };

  _renderPopover = () => {
    const { popover } = this.state;
    if (popover == null) return null;
    const route = popover.props.route;
    if (route == null) return null;
    const { card } = popover.props;

    return (
      <Popover
        {...popover.props}
        initialRoute={route}
        onDone={(card) => {
          popover.onComplete(card);
          this._hidePopover();
        }}
        onPressCancel={this._hidePopover}
      />
    );
  }

  _defaultCard = () => {
    return {
      chartType: null,
      filters: [],
      occurrenceCount: 0,
      yAxis: {
        type: 'words'
      },
    }
  }

  _addCard = (props: Object) => {
    const card = {
      ...props,
      id: 'card-' + Date.now()
    };

    Discovery.record(card);

    const cards = [
      ...this.state.cards,
      card
    ];

    this._shouldScrollToBottom = true;
    this.setState({
      cards
    }, () => {
      this._scrollToBottom();
    });
  };

  _deleteCard = (card: Object) => {
    const cardIndex = this.state.cards.indexOf(card);
    const cards = this.state.cards.slice();
    cards.splice(cardIndex, 1);

    Discovery.delete(card);

    this._animateLayout();
    this.setState({cards}, () => {
      if (cards.length == 1) {
        const scrollView = this.refs[SCROLLVIEW_REF];
        scrollView.scrollTo({y: 0, animated: false});
      }
    });
  };

  _duplicateCard = (props: Object) => {
    const card = {
      ...props,
      filters: props.filters.slice(),
    };

    this._addCard(card);
  };

  async _onPressOccurrences(card: Object) {
    const query = new Query(card);
    const occurrences = await query.occurrences();
    const onPressBack = () => {
      this.props.navigate(discoveryCenterURL({title: Localizable.t('discovery-center'), modal: true}), {replace: true});
    }

    this.props.navigate(occurrencesURL({title: Localizable.t('passages'), occurrences, modal: true, onPressBack, backTitle: Localizable.t('back')}), {replace: true});
  };

  _onPressAdd = () => {
    this._addCard(this._defaultCard());
  };

  _onHardwareBackPress = () => {
    this.props.navigate(BACK)
    return true;
  };

  _showPopover = (props: Object, onComplete: Function) => {
    this._animateLayout();
    this.setState({
      popover: {props, onComplete}
    });
  };

  _hidePopover = () => {
    this._animateLayout();
    this.setState({
      popover: null
    });
  };

  _scrollToBottom = (animated: boolean = true) => {
    const scrollHeight = this.contentHeight;
    if (scrollHeight > 0) {
      if (Platform.OS === 'ios') {
        this._shouldScrollToBottom = false;
      }
      const scrollView = this.refs[SCROLLVIEW_REF];
      scrollView.scrollTo({y: scrollHeight, animated: animated});
    }
  };

  _animateLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8D8D8'
  },
  content: {
    flex: 1,
    marginBottom: Toolbar.HEIGHT,
    ...Platform.select({
      android: {
        marginBottom: null
      },
    }),
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: Colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  }
});
