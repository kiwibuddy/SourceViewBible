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

import Card from './Card';
import GettingStartedCard from './GettingStartedCard';
import Popover from './Popover';
import { DeleteButton, DuplicateButton, ShareButton } from './Buttons';

// $FlowFixMe: Can't find os module extension
import LinearGradient from 'react-native-linear-gradient';

import { NavigationBar, Toolbar, ToolbarButton } from '../../Components/Navigation';

import { BACK } from '../../Navigation';

import { Actant, Book, Statement } from '../../Database';

const SCROLLVIEW_REF = 'scrollview';

async function query() {
  const values = {};

  // Statement.all().filtered('firstMonad >= $0 AND lastMonad <= $1', 1, 50638).forEach(statement => {
  //   const actant = statement.source;
  //   if (actant) {
  //     actant.professions.forEach(profession => {
  //       const wordCount = values[profession.name] || 0;
  //       values[profession.name] = wordCount + statement.wordCount;
  //     });
  //   }
  // });

  const statements = Statement.all().filtered('firstMonad >= $0 AND lastMonad <= $1 AND source.professionValues CONTAINS $2 AND recipient.professionValues CONTAINS $2', 1, 50638, ' 36 ');
  for (let statement of statements) {
    const words = await statement.words();
    words.forEach(wordCount => {
      const count = values[wordCount.string] || 0;
      values[wordCount.string] = count + wordCount.count;
    });
  }
//
//   Statement.filtered('firstMonad >= $0 AND lastMonad <= $1 AND source.professionValues CONTAINS $2', 1, 50638, '|Shepherd|').reduce((words, statement) => {
// statement.words.forEach(wordCount => words[wordCount.string] += wordCount.count);
// }, {});


  const data = Object.keys(values).sort((a,b) => values[a] > values[b] ? -1 : 1).slice(0, 20).map(key => ({key, count:values[key]}));

  console.log(data);
}

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

    const cards = [{key: 'getting-started'}];
    this.state = {
      cards,
      popover: null
    };
  }

  render() {
    query();

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
    if (card.key === 'getting-started') {
      return <GettingStartedCard
        key={card.key}
        card={card}
        onPressDelete={() => this._deleteCard(card)}
      />;
    } else {
      return <Card
        ref={card.key}
        key={card.key}
        card={card}
        onPressDelete={() => this._deleteCard(card)}
        onPressDuplicate={(card) => this._duplicateCard(card)}
        onShowPopover={(props, onComplete) => this._showPopover(props, onComplete)}
      />;
    }
  };

  _renderPopover = () => {
    const { popover } = this.state;
    if (popover == null) return null;

    return (
      <Popover
        onDone={(filter) => {
          const { card } = popover.props;
          const filters = [
            ...card.filters,
            filter
          ];

          popover.onComplete({
            ...card,
            filters
          });
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
      occurrences: [],
    }
  }

  _addCard = (card: Object) => {
    const cards = [
      ...this.state.cards,
      {
        ...card,
        key: 'card-' + Date.now()
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
      key: 'card-'
    });
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
