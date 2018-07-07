/* @flow */
'use strict';

import React, { Component } from 'react';
import { ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';

import { Colors, Localizable, StyleSheet } from '../../../Common';

import Icon from '../../../Components/Common/Icon';

import { cardWithFilter } from './FilterUtils';
import { Sphere } from '../../../Database';

type Props = {
  card: Object,
  events: any,
  filter: Object,
  navigate: Function,
  onDone: Function,
};

type State = {
  spheres: Array<string>,
};

export default class SpheresFilter extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const spheres = (props.filter && props.filter.spheres) || [];
    this.state = { spheres };
  }

  componentDidMount() {
    this.props.events.addListener('onPressDone', this._onPressDone);
  }

  componentWillUnmount() {
    this.props.events.removeListener('onPressDone', this._onPressDone);
  }

  render() {
    const spheres = Sphere.all().map(sphere => this._renderSphere(sphere));

    return <ScrollView style={styles.container}>{spheres}</ScrollView>;
  }

  _renderSphere = (sphere: Sphere) => {
    const { spheres } = this.state;

    const selected = spheres.indexOf(sphere.id) != -1;
    const iconName = `${sphere.id}-filled`;
    const statusStyle = selected ? styles.statusSelected : {};
    const statusLabelStyle = selected ? { color: 'white' } : {};
    const status = selected ? Localizable.t('added') : Localizable.t('add');
    return (
      <TouchableWithoutFeedback key={sphere.id} onPress={() => this._onPressSphere(sphere)}>
        <View style={styles.row}>
          <View style={[styles.cellContainer, { paddingVertical: 8 }]}>
            <View style={styles.cellLeftContainer}>
              <Icon name={iconName} size={30} style={{ color: Colors.spheres[sphere.id].tint, paddingRight: 8 }} />
              <Text style={[StyleSheet.styles.cell.title]}>{Localizable.t(sphere.id)}</Text>
            </View>
            <View style={[styles.cellRightContainer, statusStyle]}>
              <Text style={[styles.statusLabel, statusLabelStyle]}>{status}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  _onPressSphere = (sphere: Sphere) => {
    const { spheres } = this.state;

    const sphereIndex = spheres.indexOf(sphere.id);
    if (sphereIndex == -1) {
      this.setState({
        spheres: [...spheres, sphere.id],
      });
    } else {
      spheres.splice(sphereIndex, 1);
      this.setState({
        spheres,
      });
    }
  };

  _onPressDone = () => {
    const { spheres } = this.state;

    let card = this.props.card;
    if (spheres.length == 0) {
      const filters = this.props.card.filters;
      const filterIndex = filters.indexOf(this.props.filter);
      if (filterIndex != -1) {
        filters.splice(filterIndex, 1);
      }
    } else {
      const filter = {
        id: 'filter-' + Date.now(),
        type: 'sphere',
        ...this.props.filter,
        spheres,
      };

      card = cardWithFilter(this.props.card, filter);
    }

    this.props.onDone(card);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 17,
    color: Colors.tint,
  },
  statusSelected: {
    backgroundColor: Colors.tint,
    borderRadius: 4,
    padding: 4,
    overflow: 'hidden',
  },
  row: {
    flex: 1,
    marginLeft: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  cellContainer: {
    flex: 1,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
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
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
  },
});
