/* @flow */
'use strict';

import React, { Component } from 'react';
import ReactNative, {
  View,
  Text,
  Image,
  ListView,
  ScrollView,
  TouchableOpacity,
  RecyclerViewBackedScrollView,
  NavigationExperimental,
  PropTypes,
  Dimensions
} from 'react-native';

const {
  AnimatedView: NavigationAnimatedView,
  Header: NavigationHeader,
  CardStack: NavigationCardStack
} = NavigationExperimental;

const NavigationHeaderBackButton = require('../Common/NavigationHeaderBackButton');

import { connect } from 'react-redux';

const { width } = Dimensions.get('window');

// import { navigatePush } from '../../Actions';

import Book from '../Books/Book';
import Books from '../Books';
import Reader from '../Reader';

import {
  Colors,
  StyleSheet,
} from '../../Common';

// $FlowBug: Can't find os module extension
import LinearGradient from 'react-native-linear-gradient';

import { SourcesBarChart, SpheresBarChart } from '../Charts';

import PageControl from '../Common/PageControl';

import { ReadingTime } from '../../Common/NumberHelper';

import Localizable from '../../Common/Localizable';

const Bible = require('../../Locale/en/NLT/SourceView.json');
const MAXIMUM_BOOK_COUNT = 9;

class Discover extends Component {
  state: {
    dataSource: any,
    currentPage: number
  };

  constructor(props: Object) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    const books = Bible.sort((a, b) => a.sourceCount > b.sourceCount ? -1 : 1).slice(0, MAXIMUM_BOOK_COUNT);
    this.state = {
      dataSource: dataSource.cloneWithRows(books),
      currentPage: 0
    };
  }

  // componentDidMount() {
  //   const books = Bible.sort((a, b) => a.sourceCount > b.sourceCount ? -1 : 1).slice(0, MAXIMUM_BOOK_COUNT);
  //
  //   this.setState({
  //     dataSource: this.state.dataSource.cloneWithRows(books)
  //   });
  // }

  render() {
    // return (
    //   <NavigationAnimatedView
    //     style={styles.container}
    //     navigationState={this.props.navigation}
    //     onNavigate={this.props.onNavigate}
    //     renderOverlay={this._renderHeader}
    //     renderScene={this._renderScene}
    //   />
    // );

    return (
      <NavigationCardStack
        direction={'horizontal'}
        navigationState={this.props.navigation}
        onNavigate={this.props.onNavigate}
        renderScene={this._renderScene}
        renderOverlay={this._renderHeader}
        style={styles.main}
      />
    );
  }

  _renderHeader = (props: Object) => {
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
      <NavigationHeader.Title>{title}</NavigationHeader.Title>
    );
  };

  _renderLeftComponent = (props: Object) => {
    return (props.scene.index > 0 ? <NavigationHeaderBackButton /> : null);
  };

  _renderScene = (props: Object) => {
    if (props.scene.navigationState.key === 'discover') {
      return this._renderDiscover();
    }

    if (props.scene.navigationState.key === 'book') {
      const book = props.scene.navigationState.book;
      return <Book book={book} onPressScripture={() => this._onPressScripture(book)} />
    }

    if (props.scene.navigationState.key === 'books') {
      return <Books onBookPress={this._onBookPress}/>
    }

    if (props.scene.navigationState.key === 'reader') {
      const book = props.scene.navigationState.book;
      return <Reader book={book} />
    }
  }

  _renderDiscover = () => {
    return (
      <ScrollView style={styles.container}>

        <TouchableOpacity onPress={this._onBooksPress}>
          <View style={styles.sectionHeaderContainer}>
            <Text style={StyleSheet.styles.sectionHeaderTitle}>BOOKS</Text>
            <View style={styles.sectionHeaderDetail}>
              <Text style={[StyleSheet.styles.sectionHeaderTitle, {color: Colors.tintColor}]}>View All</Text>
              <Image source={require('../../Images/common/disclosure.png')}  style={styles.disclosure} />
            </View>
            </View>
        </TouchableOpacity>

        <View style={[styles.sectionContainer, {flexDirection: 'column'}]}>
          <ListView
            style={{marginHorizontal: 4}}
            contentContainerStyle={styles.list}
            dataSource={this.state.dataSource}
            initialListSize={3}
            pageSize={3}
            enableEmptySections={true}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            renderRow={this._renderBook}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            onMomentumScrollEnd={this._onScrollEnd}
          />
          <PageControl
            numberOfPages={3}
            currentPage={this.state.currentPage}
          />
        </View>

        <View style={styles.separator}></View>

        {this._renderBlankSection("Sources")}

        <View style={styles.separator}></View>

        {this._renderBlankSection("Spheres")}

        <View style={styles.separator}></View>

        {this._renderBlankSection("Words")}

      </ScrollView>
    );
  }

  _renderBook = (book: Object) => {
    return (
      <TouchableOpacity key={'book-' + book.key} style={styles.itemContainer} onPress={ () => this._onBookPress(book) }>
        <View style={styles.item}>
          <LinearGradient
            colors={Colors.spheres[book.principalSphere].gradient.tiny}
            start={[0.0, 0.25]} end={[0.5, 1.0]}
            style={styles.gradient}
          />
          <Image source={require('../../Images/discover/icon-books.png')}  style={[styles.icon, {tintColor: Colors.spheres[book.principalSphere].tint}]} />
          <Text style={styles.bookTitle}>{book.name}</Text>
          <Text style={styles.bookReadTime}>{ReadingTime(book.wordCount)}</Text>
          <View style={styles.keyline} />
          <View style={styles.statisticsContainer}>
            <View style={styles.statisticContainer} >
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.statisticTitle}>{book.sourceCount}</Text>
                <Text style={styles.statisticSubtitle}>Sources</Text>
                <SourcesBarChart
                  style={{flex: 0, marginLeft: 4}}
                  barStyle={{width: 2, height: 12, marginHorizontal: 1}}
                  horizontal={false}
                  data={[{narrator: book.sourceTypeCounts.narrator}, {god: book.sourceTypeCounts.god}, {lead: book.sourceTypeCounts.lead}, {support: book.sourceTypeCounts.support}]}
                />
              </View>
            </View>
            <View style={styles.statisticContainer} >
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.statisticTitle}>0</Text>
                <Text style={styles.statisticSubtitle}>Spheres</Text>
                <SpheresBarChart
                  style={{flex: 0, marginLeft: 4}}
                  barStyle={{width: 2, height: 12, marginHorizontal: 1}}
                  horizontal={false}
                  data={[{family: 1}, {economics: 1}, {government: 1}, {religion: 1}, {education: 1}, {communication: 1}, {celebration: 1}]}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderBlankSection = (title: string) => {
    return (
      <View>
        <View style={styles.sectionHeaderContainer}>
          <Text style={StyleSheet.styles.sectionHeaderTitle}>{title.toLocaleUpperCase()}</Text>
        </View>

        <View style={[styles.sectionContainer, {paddingBottom: 15, marginHorizontal: 4}]}>
          <View style={styles.itemContainerBlank}></View>
          <View style={styles.itemContainerBlank}></View>
          <View style={styles.itemContainerBlank}></View>
        </View>
      </View>
    );
  };

  _onBookPress = (book: Object) => {
    this.props.onNavigate({
      type: 'push',
      route: {
        key: 'book',
        title: book.name,
        book
      }
    });
  }

  _onBooksPress = () => {
    this.props.onNavigate({
      type: 'push',
      route: {
        key: 'books',
        title: Localizable.t('books'),
      }
    });
  };

  _onPressScripture = (book: Object) => {
    this.props.onNavigate({
      type: 'push',
      route: {
        key: 'reader',
        title: book.name,
        book
      }
    });
  };

  _onScrollEnd = (e: Object) => {
    // making our events coming from android compatible to updateIndex logic
    if (!e.nativeEvent.contentOffset) {
      e.nativeEvent.contentOffset = {x: e.nativeEvent.position * width}
    }

    const currentPage = Math.floor((e.nativeEvent.contentOffset.x - width / 2) / width) + 1;

    this.setState({
      currentPage: currentPage
    });
  };

}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: NavigationHeader.HEIGHT
  },
  sectionHeaderContainer: {
    ...StyleSheet.styles.sectionHeaderContainer,
    borderBottomWidth: 0,
    marginLeft: 8,
  },
  sectionContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  sectionHeaderDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  disclosure: {
    width: 15,
    height: 15,
    marginTop: 8,
    marginLeft: 5,
    marginRight: -10,
  },
  list: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginHorizontal: 4,
  },
  itemContainer: {
    width: ((width - 8) / 3),
  },
  item: {
    marginHorizontal: 4,
    marginBottom: 8,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    backgroundColor: '#fff',
    height: 138,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowRadius: 0.4,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  itemContainerBlank: {
    borderRadius: 4,
    backgroundColor: '#F9F9F9',
    margin: 0,
    marginHorizontal: 4,
    flex: 1,
    height: 127,
  },
  gradient: {
    flex: 0,
    height: 3,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden'
  },
  icon: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    marginTop: 7,
    tintColor: Colors.tintColor
  },
  bookTitle: {
    flex: 0,
    fontSize: (width <= 320 ? 11 : 13),
    color: '#59626a',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 1,
  },
  bookReadTime: {
    flex: 0,
    fontSize: 11,
    color: '#9b9b9b',
    textAlign: 'center',
    marginTop: 1,
    marginBottom: 7,
  },
  statisticsContainer: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: (width <= 320 ? 4 : 8),
  },
  statisticContainer: {
    marginTop: 7,
  },
  statisticTitle: {
    fontSize: 11,
    color: Colors.tintColor,
    marginRight: 3,
  },
  statisticSubtitle: {
    flex: 1,
    color: Colors.subtitle,
    fontSize: 11,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 8,
  },
  sourcesContainer: {
    flexDirection: 'row',
    margin: 4,
  },
  sourceImage: {
    width: 10,
    height: 10,
    margin: 4,
  },
  readTitle: {
    color: Colors.subtitle,
    fontSize: 12,
    alignSelf: 'center',
    paddingBottom: 8,
  },
  keyline: {
    flex:0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 2,
  },
  horizontalContainer: {
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 1.2,
  },
  rightContainer: {
    flex: 1.8,
  },
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch
	};
}

function mapStateToProps(state) {
	return {
		navigation: state.get('discover')
	};
}

export default connect(mapStateToProps, mapDispatchToProps, (stateProps, dispatchProps, ownProps) => {
	return Object.assign({}, ownProps, stateProps, dispatchProps, {
		onNavigate: (action) => {
			dispatchProps.dispatch(Object.assign(action, {
				scope: stateProps.navigation.key
			}));
		}
	});
})(Discover);
