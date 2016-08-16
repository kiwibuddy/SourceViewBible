/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  LayoutAnimation,
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

import { FilterType } from './Constants';

import Card from './Card';
import GettingStartedCard from './GettingStartedCard';
import Popover from './Popover';
import { DeleteButton, DuplicateButton, ShareButton } from './Buttons';

// $FlowFixMe: Can't find os module extension
import LinearGradient from 'react-native-linear-gradient';

import { NavigationBar, Toolbar, ToolbarButton } from '../../Components/Navigation';

import { BACK, discoveryCenterOccurrencesURL } from '../../Navigation';

import { Discovery } from '../../Preferences';

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

  contentHeight: number;

  constructor(props: Object) {
    super(props);

    this.contentHeight = 0;

    const cards = [{id: 'getting-started'}];
    this.state = {
      cards,
      popover: null
    };
  }

  render() {
    const toolbar = this._renderToolbar();
    const cards = this.state.cards.map(card => this._renderCard(card));
    const popover = this._renderPopover();
    return (
      <View style={styles.container}>
        <NavigationBar title={Localizable.t('discovery-center')}>
          <TouchableOpacity
            onPress={() => this.props.navigate(BACK)}
            style={{position: 'absolute', left: 16}}
          >
            <Text style={StyleSheet.styles.navigationBar.doneButtonTitle}>{Localizable.t('done')}</Text>
          </TouchableOpacity>
        </NavigationBar>
        <ScrollView ref={SCROLLVIEW_REF}
          style={styles.content}
          onContentSizeChange={(w, h) => this.contentHeight = h}
        >{cards}</ScrollView>
        {toolbar}
        {popover}
      </View>
    );
  }

  _renderToolbar = (props: any) => {
    return (
      <Toolbar>
        <ToolbarButton
          imageSource={require('./Images/btn-add-card.png')}
          onPress={() => this._addCard(this._defaultCard())}
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
        onPressOccurrences={this._onPressOccurrences}
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
        type: 'words',
        name: Localizable.t('words.text')
      },
    }
  }

  _addCard = (card: Object) => {
    const cards = [
      ...this.state.cards,
      {
        ...card,
        id: 'card-' + Date.now()
      }
    ];

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

    this._animateLayout();
    this.setState({cards}, () => {
      if (cards.length == 1) {
        const scrollView = this.refs[SCROLLVIEW_REF];
        scrollView.scrollTo({y: 0, animated: false});
      }
    });
  };

  _duplicateCard = (card: Object) => {
    this._addCard({
      ...card,
      filters: card.filters.slice(),
    });
  };

  _onPressOccurrences = (card: Object) => {
      // FIXME
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
    marginTop: NavigationBar.HEIGHT,
    marginBottom: Toolbar.HEIGHT,
  },
});
