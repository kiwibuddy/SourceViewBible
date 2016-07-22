/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
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
  cardIncrement: number,
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
      cardIncrement: cards.length,
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
        >
          {cards}
          <Card>
            <Card.Header>
              <View style={styles.leftContainer}>
                <DeleteButton />
              </View>
              <View style={[styles.rightContainer, {justifyContent: 'flex-end'}]}>
                <DuplicateButton />
                <ShareButton style={styles.share} />
              </View>
            </Card.Header>
            <View style={styles.chart}>
              <Image source={require('../../Images/discoverycenter/chart-blankslate.png')} />
              <View style={styles.chartHeader}>
                <TouchableOpacity style={styles.leftContainer}>
                  <Image style={styles.chartDropdown} source={require('../../Images/discoverycenter/chart-icn-dropdown.png')} />
                  <Image source={require('../../Images/discoverycenter/chart-icn-bar-yaxis.png')} />
                  <Text style={styles.chartProperty}>Choose Y Axis</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightContainer}>
                  <Image style={styles.chartDropdown} source={require('../../Images/discoverycenter/chart-icn-dropdown.png')} />
                  <Image style={styles.chartIcon} source={require('../../Images/discoverycenter/chart-icn-bar-xaxis.png')} />
                  <Text style={styles.chartProperty}>Choose X Axis</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.chartFooter}>
              <View style={[styles.rightContainer, {justifyContent: 'flex-end', paddingRight: -10}]}>
                  <TouchableOpacity>
                    <Image source={require('../../Images/discoverycenter/btn-fullscreen.png')} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.message}>
              <View style={styles.filterItem}>
                <View style={styles.topContainer}>
                  <View style={styles.leftContainer}>
                    <TouchableOpacity>
                    <Text style={[styles.chartButton, {color: Colors.tint}]}>+ ADD FILTER</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.filterBlankslate}>
                <Image source={require('../../Images/discoverycenter/filter-blankslate.png')} />
              </View>
            </View>
          </Card>
          <Card>
            <Card.Header>
              <View style={styles.leftContainer}>
                <DeleteButton />
              </View>
              <View style={[styles.rightContainer, {justifyContent: 'flex-end'}]}>
                <DuplicateButton />
                <ShareButton style={styles.share} />
              </View>
            </Card.Header>
            <View style={styles.chart}>
              <Image source={require('../../Images/discoverycenter/chart-placeholder.png')} />
              <View style={styles.chartHeader}>
                <TouchableOpacity style={styles.leftContainer}>
                  <Image style={styles.chartDropdown} source={require('../../Images/discoverycenter/chart-icn-dropdown.png')} />
                  <Image source={require('../../Images/discoverycenter/chart-icn-bar-yaxis.png')} />
                  <Text style={styles.chartProperty}>Source Word</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightContainer}>
                  <Image style={styles.chartDropdown} source={require('../../Images/discoverycenter/chart-icn-dropdown.png')} />
                  <Image style={styles.chartIcon} source={require('../../Images/discoverycenter/chart-icn-bar-xaxis.png')} />
                  <Text style={styles.chartProperty}>Source Vocation</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.chartFooter}>
                <View style={[styles.rightContainer, {justifyContent: 'flex-end', paddingRight: -10}]}>
                    <TouchableOpacity>
                      <Image source={require('../../Images/discoverycenter/btn-fullscreen.png')} />
                    </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.message}>
              <View style={styles.filterItem}>
                <View style={styles.topContainer}>
                  <View style={styles.leftContainer}>
                    <TouchableOpacity>
                      <Text style={[styles.chartButton, {color: '#9B9B9B'}]}>+ ADD FILTER</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.rightContainer, {justifyContent: 'flex-end', paddingRight: -10}]}>
                    <TouchableOpacity>
                      <Text style={[styles.chartButton, {color: Colors.tint}]}>BOOKS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text style={[styles.chartButton, {color: Colors.tint}]}>WORDS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text style={[styles.chartButton, {color: Colors.tint}]}>SOURCES</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text style={[styles.chartButton, {color: Colors.tint}]}>SPHERES</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.readButton}>
                <Text style={styles.readButtonTitle}>Explore 423 occurrences</Text>
              </TouchableOpacity>
            </View>
          </Card>
          <Card>
            <Card.Header>
              <View style={styles.leftContainer}>
                <DeleteButton />
              </View>
              <View style={[styles.rightContainer, {justifyContent: 'flex-end'}]}>
                <DuplicateButton />
                <ShareButton style={styles.share} />
              </View>
            </Card.Header>
            <View style={styles.chart}>
              <Image source={require('../../Images/discoverycenter/chart-placeholder.png')} />
              <View style={styles.chartHeader}>
                <TouchableOpacity style={styles.leftContainer}>
                  <Image style={styles.chartDropdown} source={require('../../Images/discoverycenter/chart-icn-dropdown.png')} />
                  <Image source={require('../../Images/discoverycenter/chart-icn-bar-yaxis.png')} />
                  <Text style={styles.chartProperty}>Source Word</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightContainer}>
                  <Image style={styles.chartDropdown} source={require('../../Images/discoverycenter/chart-icn-dropdown.png')} />
                  <Image style={styles.chartIcon} source={require('../../Images/discoverycenter/chart-icn-bar-xaxis.png')} />
                  <Text style={styles.chartProperty}>Source Vocation</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.chartFooter}>
                <View style={[styles.rightContainer, {justifyContent: 'flex-end', paddingRight: -10}]}>
                    <TouchableOpacity>
                      <Image source={require('../../Images/discoverycenter/btn-fullscreen.png')} />
                    </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.message}>
              <View style={styles.filterItem}>
                <View style={styles.topContainer}>
                  <View style={styles.leftContainer}>
                    <TouchableOpacity>
                      <Text style={[styles.chartButton, {color: '#9B9B9B'}]}>BOOKS</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.rightContainer, {justifyContent: 'flex-end', paddingRight: -10}]}>
                  </View>
                </View>
                <View style={styles.bottomContainer}>
                  <Text>In</Text>
                  <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterButtonTitle}>Genesis</Text>
                    <Image source={require('../../Images/discoverycenter/chart-icn-dropdown-filter.png')} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterDelete}>
                    <Image source={require('../../Images/discoverycenter/chart-icn-filter-delete.png')} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.filterItem}>
                <View style={styles.topContainer}>
                  <View style={styles.leftContainer}>
                    <TouchableOpacity>
                      <Text style={[styles.chartButton, {color: '#9B9B9B'}]}>SOURCE</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.rightContainer, {justifyContent: 'flex-end', paddingRight: -10}]}>
                  </View>
                </View>
                <View style={styles.bottomContainer}>
                  <Text>Role is</Text>
                  <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterButtonTitle}>Narrator</Text>
                    <Image source={require('../../Images/discoverycenter/chart-icn-dropdown-filter.png')} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterDelete}>
                    <Image source={require('../../Images/discoverycenter/chart-icn-filter-delete.png')} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.filterItem}>
                <View style={styles.topContainer}>
                  <View style={styles.leftContainer}>
                    <TouchableOpacity>
                    <Text style={[styles.chartButton, {color: Colors.tint}]}>+ ADD FILTER</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.readButton}>
                <Text style={styles.readButtonTitle}>Explore 423 occurrences</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
        {toolbar}
        {/*
          ----PopOver
          <View style={styles.overlayContainer}>
          <View style={styles.popover}>
            <View style={styles.tableHeader}>
              <TouchableOpacity style={styles.leftContainer}>
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
          imageSource={require('../../Images/discoverycenter/btn-add-card.png')}
          onPress={this._addCard}
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
      />;
    }
  };

  _addCard = () => {
    const cardIncrement = this.state.cardIncrement + 1;
    const card = {key: 'card-' + cardIncrement};
    const cards = [
      ...this.state.cards,
      card
    ];

    this.setState({
      cards,
      cardIncrement
    }, () => {
      this._scrollToBottom();
    });
  };

  _deleteCard = (card: Object) => {
    const cardIndex = this.state.cards.indexOf(card);
    const cards = this.state.cards.slice();
    cards.splice(cardIndex, 1);

    this.setState({cards}, () => {
      if (cards.length == 1) {
        const scrollView = this.refs[SCROLLVIEW_REF];
        scrollView.scrollTo({y: 0, animated: false});
      }
    });
  };

  _scrollToBottom = (animated: boolean = true) => {
    const scrollHeight = this.contentHeight;
    if (scrollHeight > 0) {
      const scrollView = this.refs[SCROLLVIEW_REF];
      scrollView.scrollTo({y: scrollHeight, animated: animated});
    }
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
  topContainer: {
    flex: 0,
    flexDirection: 'row',
  },
  bottomContainer: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C8C7CC',
    marginHorizontal: 10,
    paddingBottom: 10,
    marginTop: -8,
  },
  filterButton: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.tint,
    paddingHorizontal: 2,
    marginHorizontal: 8,
  },
  filterButtonTitle: {
    color: Colors.tint,
  },
  filterDelete: {
    position: 'absolute',
    right: 5,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(255, 255, 255, 0.35)',
    paddingHorizontal: 10,
    height: 44,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 44,
  },
  share: {
    paddingLeft: 10,
  },
  chart: {
    alignItems: 'center',
    backgroundColor: '#5B6771',
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 0.8,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  chartHeader: {
    flex: 1,
    position: 'absolute',
    right: 5,
    left: 5,
    top: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  chartButton: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingRight: 15,
  },
  chartProperty: {
    fontSize: 11,
    paddingLeft: 5,
    color: '#FFFFFF'
  },
  chartDropdown: {
    position: 'absolute',
    right: 8,
    top: 12,
  },
  chartFooter: {
    flex: 1,
    position: 'absolute',
    right: 5,
    left: 5,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterBlankslate: {
    paddingVertical: 50,
    alignSelf: 'center',
  },
  readButton: {
    borderColor: Colors.tint,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    overflow:'hidden',
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
    justifyContent: 'center',
  },
  readButtonTitle: {
    color: Colors.tint,
    fontSize: 18,
    marginVertical: 20,
    marginHorizontal: 40,
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
