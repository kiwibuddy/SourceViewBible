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

import { DeleteButton, DuplicateButton, ShareButton } from './Buttons';

// $FlowFixMe: Can't find os module extension
import LinearGradient from 'react-native-linear-gradient';

import { NavigationBar, Toolbar, ToolbarButton } from '../../Components/Navigation';

const SCROLLVIEW_REF = 'scrollview';

type Props = {
  onPressDone: Function,
};

type State = {
  cards: any,
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
      cards
    };
  }

  render() {
    const toolbar = this._renderToolbar();

    const cards = this.state.cards.map(card => this._renderCard(card));
    return (
      <View style={styles.container}>
        <NavigationBar title={Localizable.t('discovery-center')}>
          <TouchableOpacity
            onPress={this.props.onPressDone}
            style={{position: 'absolute', left: 0}}
          >
            <Text style={StyleSheet.styles.navigationBar.doneButtonTitle}>{Localizable.t('done')}</Text>
          </TouchableOpacity>
        </NavigationBar>
        <ScrollView ref={SCROLLVIEW_REF}
          style={styles.content}
          onContentSizeChange={(w, h) => this.contentHeight = h}
        >{cards}</ScrollView>
        {toolbar}
        {/*
          ----PopOver
          <View style={styles.overlayContainer}>
          <View style={styles.popover}>
            <View style={styles.tableHeader}>
              <TouchableOpacity style={StyleSheet.styles.discoveryCenter.leftContainer}>
                <Text style={styles.back}>Back</Text>
              </TouchableOpacity>
              <View style={styles.separator} />
            </View>
            <ScrollView>
              <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
                <Text style={StyleSheet.styles.cell.title}>Whole Bible</Text>
                <Image source={require('../../Images/common/disclosure.png')}  style={styles.disclosure} />
              </TouchableOpacity>
              <View style={styles.separator} />
              <TouchableOpacity style={StyleSheet.styles.listItem} onPress={() => {}}>
                <Text style={StyleSheet.styles.cell.title}>Whole Bible</Text>
                <Image source={require('../../Images/common/disclosure.png')}  style={styles.disclosure} />
              </TouchableOpacity>
              <View style={styles.separator} />
            </ScrollView>
          </View>
        </View>
       */}
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
        key={card.key}
        card={card}
        onPressDelete={() => this._deleteCard(card)}
        onPressDuplicate={() => this._duplicateCard(card)}
      />;
    }
  };

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
  overlayContainer: {
    flex: 1,
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
    top: 400,
    bottom: 0,
    right: 0,
    left: 0,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
  },
  back: {
    color: Colors.tint,
    fontSize: 17,
    paddingLeft: 5,
  }
});
