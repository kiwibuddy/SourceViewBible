/* @flow */
"use strict";

import React, { Component } from "react";
import { View } from "react-native";

import {
  Colors,
  StyleSheet
} from "../../Common";

const PageControl = (props: Object) => {
  const currentPage = props.currentPage || 0;
  const indicators = [];
  for (let page = 0; page < props.numberOfPages; page++) {
    const indicatorStyle = (page == currentPage ? styles.currentIndicator : styles.indicator);
    const indicator = <View key={'indicator-' + page} style={indicatorStyle}/>;
    indicators.push(indicator);
  }

  return (
    <View style={styles.container}>
      {indicators}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 24,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  currentIndicator: {
    backgroundColor: "rgba(0,0,0,.2)",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  indicator: {
    backgroundColor: "rgba(0,0,0,.05)",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  }
});

export default PageControl;
