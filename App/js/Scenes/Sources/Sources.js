/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Image,
  LayoutAnimation,
  Platform,
  RecyclerViewBackedScrollView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ListView } from '../../Components/Common/DatabaseListView';

import {
  Analytics,
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

// $FlowFixMe: - Flow can't find os module extension
import SegmentedControl from '../../Components/Common/SegmentedControl';
import { SourcesBarChart, SpheresBarChart } from '../../Components/Charts';
import { ReadingTime } from '../../Common/NumberHelper';
import SourceIcon from '../../Components/Common/SourceIcon';

const LISTVIEW_REF = 'LISTVIEW_REF';

import { sourceURL, sourcesFilterURL } from '../../Navigation';
import { NavigationBarButton } from '../../Components/Navigation';

import { Preference } from '../../Preferences';
import { Actant, Gender, Nature, Role, Profession } from '../../Database';

type Props = {
  navigate: Function,
};

type State = {
  dataSource: any,
  search: ?string,
  filters: any,
};

export default class Sources extends Component {
  static NavigationHeaderStyle = {
    elevation: null
  };

  static renderNavigationHeaderRightComponent(props: Object) {
    return (
      <NavigationBarButton
        imageSource={require('../../Components/Navigation/Images/nav-filter.png')}
        onPress={() => props.navigate(sourcesFilterURL({title: Localizable.t('settings'), modal: true}))}
      />
    );
  }

  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});

    this.state = {
      dataSource: dataSource,
      search: null,
      filters: Preference.objectForKey(Preference.Keys.Sources.filters) || []
    };
  }

  render() {
    const sources = Actant.sources(this.state.search).sorted('firstInitial').sorted('name');
    const { rows, sections } = this._getRowsAndSections(sources);
    const dataSource = this.state.dataSource.cloneWithRowsAndSections(rows, sections);
    const filterBar = this._renderFilterBar();

    return (
      <View style={styles.container}>
        {filterBar}
        <View style={styles.textInputContainer}>
          <TextInput
            autoCapitalize="words"
            autoCorrect={false}
            autoFocus={false}
            clearButtonMode="always"
            onChangeText={(text) => this._onSearch(text)}
            placeholder={Localizable.t('search-name')}
            style={styles.textInput}
            value={this.state.search || ''}
          />
        </View>
        <ListView
          ref="LISTVIEW_REF"
          dataSource={dataSource}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSectionHeader={this._renderSectionHeader}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          keyboardShouldPersistTaps={true}
          keyboardDismissMode="on-drag"
          pageSize={10}
        />
      </View>
    );
  }

  _renderFilterBar = () => {
    const filters = Preference.objectForKey(Preference.Keys.Sources.filters) || [];
    if (filters.length == 0) return null;

    const filterLabels = filters.map(filter => {
      let title = null;
      switch (filter.type) {
        case 'role':
          title = Role.findByID(filter.roleID).name;
          break;

        case 'nature':
          title = Nature.findByID(filter.natureID).name;
          break;

        case 'gender':
          title = Gender.findByID(filter.genderID).name;
          break;

        case 'profession':
          title = Profession.findByID(filter.professionID).name;
          break;
      }
      
      return (
        <View key={'filter-' + filter.id} style={[styles.filterLabelContainer, {backgroundColor: Colors.tint}]}>
          <Text style={[styles.filterLabel]}>{title}</Text>
        </View>
      );
    });

    return (
      <View style={styles.filterBar}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {filterLabels}
        </ScrollView>
        <TouchableOpacity style={styles.filterClear} onPress={this._onPressClearFilter}>
          <Image source={require('../../Images/sources/clear-btn.png')} />
        </TouchableOpacity>
      </View>
    );
  };

  _renderSectionHeader = (sectionData: Object, sectionID: any) => {
    const title = sectionID;
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderTitle}>{title}</Text>
      </View>
    );
  };

  _renderRow = (source: Object, sectionID: any, rowID: any) => {
    const chartData = {};
    chartData[source.principalSourceType] = source.wordCount;

    const wordCount = source.wordCount;

    return (
      <TouchableOpacity style={styles.section} onPress={() => this.props.navigate(sourceURL({sourceID: source.id, title: source.name}))}>
        <View style={styles.sourcesCellContainer}>
          <View style={styles.sourcesAvatar}>
            <SourceIcon
              source={source}
              style={styles.sourceAvatar}
              size={20}
            />
          </View>
          <View style={styles.sourcesLeftContainer}>
            <Text style={StyleSheet.styles.cell.title}>{source.name}</Text>
            <Text style={StyleSheet.styles.cell.subtitle}>{Localizable.t('words.count', {count: wordCount, localizedCount: Localizable.toNumber(wordCount, {precision: 0})})}</Text>
          </View>
          <View style={styles.sourcesRightContainer}>
            <Text style={StyleSheet.styles.cell.subtitle}>{source.chronologyDescription}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _getRowsAndSections = (sources: any) => {
    const rows = {};
    const sections = [];
    if (sources.length == 0) return {rows, sections};

    sources.forEach((source) => {
      let section = source.firstInitial;
      if (parseInt(section) > 0) section = '#';
      if (sections.indexOf(section) === -1) {
        sections.push(section);
        rows[section] = [];
      }
      rows[section].push(source);
    });

    const numericSection = sections[0];
    sections.shift();
    sections.push(numericSection);

    return {rows, sections};
  };

  _onSearch = (text: string) => {
    this.setState({search: text});
    Analytics.logSearch(text, {type: 'Source'});
  };

  _onPressClearFilter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Preference.setObjectForKey([], Preference.Keys.Sources.filters);
    this.setState({filters: []});
  };
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  section: {
    marginLeft: 8,
  },
  sourcesCellContainer: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 6,
    flexDirection: 'row',
  },
  sourcesAvatar: {
    justifyContent: 'center',
    paddingRight: 5,
  },
  sourcesLeftContainer: {
    flex: 2,
    flexDirection: 'column',
  },
  sourcesRightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 8,
    paddingTop: 4,
  },
  sourceAvatar: {
    width: 20,
    height: 20,
    marginRight: 5
  },
  sourcesBarChart: {
    height: 4,
    flex: 0,
    marginBottom: 7,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 8,
  },
  listIndexContainer: {
    top: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 3,
  },
  listIndexTitle: {
    color: '#CF1E00',
    fontSize: 11,
    fontWeight: '500',
  },
  filterBar: {
    height: 30,
    backgroundColor: '#F9F9F9',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8c7cc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    elevation: 2,
    borderTopColor: Platform.OS === 'ios' ? 0 : 'rgba(0, 0, 0, .15)',
    borderTopWidth: Platform.OS === 'ios' ? 0 : 1,
  },
  filterLabelContainer: {
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 5,
    overflow: 'hidden',
    marginRight: 5,
  },
  filterLabel: {
    fontSize: 13,
    color: 'white',
  },
  filterClear: {
    position: 'absolute',
    right: 0,
  },
  ...Platform.select({
      ios: {
        sectionHeaderContainer: {
          paddingVertical: 4,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 15,
          backgroundColor: '#FAFAFA',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: '#c8c7cc',
        },
        sectionHeaderTitle: {
          color: '#59626a',
          fontSize: 15,
          fontWeight: 'bold',
          marginLeft: 8,
        },
        textInputContainer: {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: '#c8c7cc',
        },
        textInput: {
          fontSize: 14,
          backgroundColor: '#ececec',
          borderColor: '#ececec',
          borderRadius: 3,
          borderWidth: 1,
          paddingLeft: 8,
          marginHorizontal: 8,
          marginVertical: 8,
          height: 26,
          padding: 0, // Android workaround
        },
        segmentedControl: {
          marginTop: 8,
          marginHorizontal: 8,
          marginBottom: 10,
        },
      },
      android: {
        sectionHeaderContainer: {
          paddingVertical: 4,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 15,
        },
        sectionHeaderTitle: {
          color: '#59626a',
          fontSize: 15,
          fontWeight: 'bold',
          marginLeft: 10,
        },
        textInputContainer: {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: '#c8c7cc',
          backgroundColor: '#FAFAFA',
          elevation: 1,
        },
        textInput: {
          fontSize: 16,
          backgroundColor: '#FAFAFA',
          paddingLeft: 8,
          marginHorizontal: 8,
          marginVertical: 8,
          height: 30,
          padding: 0, // Android workaround
        },
        segmentedControl: {
          shadowColor: 'red',
          elevation: 2,
        },
      },
  })
});
