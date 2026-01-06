/* @flow */
'use strict';

import React, { Component } from 'react';
import { Platform, Switch, Text, View, TextInput } from 'react-native';

import { Colors, Localizable, StyleSheet } from '../../Common';

import { NavigationHeader, NavigationBarButton } from '../../Components/Navigation';
import { BACK } from '../../Navigation';

import Emdros from '../../API/Emdros';
import { Bookmark, ReferenceDescription } from '../../Preferences';
import { Book } from '../../Database';

type Props = {
  bookID: string,
  bookmarkID: string,
  navigate: Function,
  references: Array<Object>,
};

type State = {
  highlight: boolean,
  note: ?string,
  references: Array<Object>,
  scripture: ?string,
};

export default class BookmarkScene extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const bookmark = Bookmark.findByID(props.bookmarkID);
    if (bookmark) {
      const references = Object.keys(bookmark.references).map(key => bookmark.references[key]);

      this.state = {
        highlight: bookmark.highlight,
        note: bookmark.note,
        references,
        scripture: null,
      };
    } else {
      this.state = {
        highlight: true,
        note: null,
        references: props.references,
        scripture: null,
      };
    }
  }

  componentDidMount() {
    this._getReferences();
  }

  render() {
    const { highlight, note, scripture } = this.state;
    const doneImage = Platform.OS === 'android' ? require('../../Components/Navigation/Images/checkmark-icon.png') : null;

    return (
      <View style={styles.container}>
        <NavigationHeader
          navigate={this.props.navigate}
          title={Localizable.t('bookmark')}
          renderLeftComponent={() => <NavigationBarButton title={Localizable.t('cancel')} onPress={() => this.props.navigate(BACK)} />}
          renderRightComponent={() => (
            <NavigationBarButton
              imageSource={doneImage}
              title={Localizable.t('done')}
              onPress={this._onDone}
              titleStyle={StyleSheet.styles.navigationBar.doneButtonTitle}
            />
          )}
        />
        <View style={[styles.cellContainer, { paddingVertical: 8, paddingLeft: 15 }]}>
          <View style={styles.cellLeftContainer}>
            <Text style={[StyleSheet.styles.cell.title, { flex: 3 }]}>{Localizable.t('highlight-text')}</Text>
          </View>
          <View style={[styles.cellRightContainer, { width: 50 }]}>
            <Switch onValueChange={value => this.setState({ highlight: value })} style={styles.switch} value={highlight} />
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.referenceContainer}>
          <Text numberOfLines={2} style={styles.body}>
            {scripture}
          </Text>
          <Text style={[StyleSheet.styles.cell.subtitle, { paddingRight: 8 }]}>{this._referenceDescription()}</Text>
        </View>
        <TextInput
          autoFocus={true}
          clearButtonMode="always"
          multiline={true}
          onChangeText={text => this.setState({ note: text })}
          placeholder={Localizable.t('optional-note')}
          style={styles.textInput}
          value={note}
        />
      </View>
    );
  }

  _onDone = () => {
    const { bookmarkID } = this.props;
    const { references, highlight, note } = this.state;

    const bookmark = Bookmark.findByID(bookmarkID);
    const id = bookmark ? bookmark.id : null;
    Bookmark.bookmark({ id, references, note, highlight });
    this.props.navigate(BACK);
  };

  async _getReferences() {
    const { references } = this.state;

    let scripture = '';
    for (let reference of references) {
      const monadSet = {
        first: reference.firstMonad,
        last: reference.lastMonad,
      };
      const content = await Emdros.scripture({ monadSet, stylesheet: 'occurrence' });
      scripture += content;
    }

    this.setState({ scripture });
  }

  _referenceDescription = () => {
    const book = Book.findByID(this.props.bookID);
    return ReferenceDescription(book, this.state.references);
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Platform.OS === 'ios' ? '#FFF' : '#FFF',
  },
  cellLeftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellRightContainer: {
    flex: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  referenceContainer: {
    marginHorizontal: 15,
    marginVertical: 15,
    borderLeftColor: '#FAE8E5',
    borderLeftWidth: 4,
    paddingLeft: 8,
  },
  body: {
    fontFamily: 'Georgia',
    paddingBottom: 5,
    color: '#59626A',
    fontSize: 15,
    lineHeight: 24,
  },
  textInput: {
    fontSize: 17,
    paddingLeft: 8,
    marginHorizontal: 8,
    marginVertical: 8,
    textAlignVertical: 'top', // Android workaround
    height: 200,
    padding: 0, // Android workaround
  },
  ...Platform.select({
    ios: {
      separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.separator,
        marginLeft: 15,
      },
      cellContainer: {
        flex: 1,
        marginRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 44,
      },
    },
    android: {
      separator: {
        height: 0,
        backgroundColor: Colors.separator,
      },
      cellContainer: {
        flex: 1,
        marginRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 55,
      },
    },
  }),
});
