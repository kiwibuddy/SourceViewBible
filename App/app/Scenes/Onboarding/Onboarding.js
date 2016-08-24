/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  Dimensions,
  Image,
  LayoutAnimation,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

// $FlowFixMe: Can't find os module extension
import LinearGradient from 'react-native-linear-gradient';
import PageControl from '../../Components/Common/PageControl';
import { BACK, discoverURL } from '../../Navigation';
import { Preference } from '../../Preferences';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const SCROLLVIEW_REF = 'SCROLLVIEW_REF';
const NUMBER_OF_PAGES = 4;

console.log('height', HEIGHT);

type Props = {
  title: string,
  navigate: Function,
};

type State = {
  currentPage: number,
};

export default class Onboarding extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {currentPage: 0};
  }

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#E1E9EE', '#FFFFFF']}
          start={[0.5, 0.25]} end={[0.5, 1.0]}
          style={styles.onboardingContainer}
        >
          <ScrollView
            ref={SCROLLVIEW_REF}
            horizontal={true}
            onMomentumScrollEnd={this._onScrollEnd}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
          >
            <View style={styles.onboardingContainer}>
              <View style={styles.onboardingContent}>
                <Image source={require('./Images/onboarding-1.png')} />
                <Text style={styles.contentHeader}>Welcome to the SourceView Bible</Text>
                <Text style={styles.contentBody}>Introducing a fresh way to discover God's Word</Text>
              </View>
            </View>
            <View style={styles.onboardingContainer}>
              <View style={styles.onboardingContent}>
                <Image source={require('./Images/onboarding-2.png')} />
                <Text style={styles.contentHeader}>What's inside</Text>
                <Text style={styles.contentBody}>Discovery begins when we look deeper into God's story: what's written, who said it, and how it can impact society.</Text>
              </View>
            </View>
            <View style={styles.onboardingContainer}>
              <View style={styles.onboardingContent}>
                <Image source={require('./Images/onboarding-3.png')} />
                <Text style={styles.contentHeader}>What you'll see</Text>
                <Text style={styles.contentBody}>A new Scripture layout and dynamic visualisations enabling you to encounter the Bible like never before.</Text>
              </View>
            </View>
            <View style={[styles.onboardingContainer, {overflow: 'hidden'}]}>
              <View style={styles.onboardingContent}>
                <Image source={require('./Images/onboarding-4.png')} />
                <Text style={styles.contentHeader}>Words matter</Text>
                <Text style={styles.contentBody}>Every word is enriched by layers of information, enabling you to explore and gain new insights.</Text>
              </View>
            </View>
            {/* <View style={styles.onboardingContainer}>
              <View style={styles.onboardingContent}>
                <Image source={require('./Images/onboarding-5.png')} />
                <Text style={styles.contentHeader}>Share discoveries</Text>
                <Text style={styles.contentBody}>Create insightful visualizations of Scripture and share them
  with friends.</Text>
              </View>
            </View> */}
          </ScrollView>
          {this._renderControls()}
          <PageControl
            numberOfPages={NUMBER_OF_PAGES}
            currentPage={this.state.currentPage}
          />
        </LinearGradient>
      </View>
    );
  }

  _renderControls = () => {
    const { currentPage } = this.state;
    if (currentPage < NUMBER_OF_PAGES - 1) {
      return (
        <View style={styles.onboardingControls}>
          <TouchableOpacity key="next" style={styles.nextButton} onPress={this._onPressNext}>
            <Text style={styles.nextButtonTitle}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressDone}>
            <Text style={styles.skipButton}>Skip Intro</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.onboardingControls}>
          <TouchableOpacity key="next" style={styles.nextButton} onPress={this._onPressDone}>
            <Text style={styles.nextButtonTitle}>Get Started</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  _onPressNext = () => {
    const { currentPage } = this.state;
    const offset = (currentPage + 1) * WIDTH;

    console.log('currentPage', currentPage);
    console.log('width', WIDTH);
    console.log('offset', offset);

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({currentPage: currentPage + 1}, () => {
      this.refs[SCROLLVIEW_REF].scrollTo({x: offset, animated: true});
    });
  };

  _onScrollEnd = (e: Object) => {
    const { currentPage } = this.state;
    // making our events coming from android compatible to updateIndex logic
    if (!e.nativeEvent.contentOffset) {
      e.nativeEvent.contentOffset = {x: e.nativeEvent.position * WIDTH}
    }

    const page = Math.floor((e.nativeEvent.contentOffset.x - WIDTH / 2) / WIDTH) + 1;
    if (currentPage != page) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({currentPage: page});
    }
  };

  _onPressDone = () => {
    Preference.setBooleanForKey(true, Preference.Keys.Launch.Onboarded)
    this.props.navigate(discoverURL({title: Localizable.t('discover')}), {replace: true});
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 15,
  },
  onboardingContainer: {
    flex: 1,
    width: WIDTH,
  },
  scrollView: {
    backgroundColor: 'transparent'
  },
  onboardingContent: {
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: (WIDTH <= 320 ? 30 : 50),
  },
  contentHeader: {
    fontSize: 27,
    lineHeight: 33,
    fontWeight: 'bold',
    color: '#59626A',
    marginBottom: 5,
    textAlign: 'center',
  },
  contentBody: {
    fontSize: (WIDTH <= 320 || HEIGHT <= 600 ? 18 : 21),
    lineHeight: 25,
    color: '#59626A',
    textAlign: 'center',
  },
  onboardingControls: {
    paddingVertical: 10,
    marginBottom: (HEIGHT > 600 ? 50 : 0),
  },
  nextButton: {
    backgroundColor: Colors.tint,
    borderColor: Colors.tint,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    overflow:'hidden',
    alignSelf: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    minWidth: 200,
    alignItems: 'center',
  },
  nextButtonTitle: {
    color: 'white',
    fontSize: 17,
  },
  skipButton: {
    color: Colors.tint,
    fontSize: 17,
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
});
