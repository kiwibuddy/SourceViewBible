'use strict'

import React, {
  Component,
} from 'react-native'

import Svg,{
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Text,
    Use,
    Defs,
    Stop
} from 'react-native-art-svg';

const barItemWidth = 20;
const chartHeight = 200;

const colors = {
  "Red": "#ff0000",
  "Black": "#000000",
  "Green": "#00fc00",
  "Blue": "#0000ff"
}

export default class Chart extends Component {
  renderBar(bin, x, pixelFactor) {

    const points = Object.keys(bin.bucket.bucket).map(function(key, index) {
      var feature = bin.bucket.bucket[key];
      return {feature: key, count: feature.recursiveCount};
    }).sort((a,b) => {
      return b.count - a.count;
    });

    var barHeight = 0.0;
    points.forEach((point) => {
      barHeight += (point.count * pixelFactor);
    });

    var y = chartHeight;
    return points.map((point) => {
      var height = point.count * pixelFactor;
      const color = colors[point.feature];
      y -= height;

      var item = <Rect
          x={x}
          y={y}
          width={barItemWidth}
          height={height}
          stroke={color}
          strokeWidth="2"
          fill={color}
      />;
      return item;
    });
  }
  render() {
    var x = 0;
    const data = this.props.data;
    var maxHeight = 0;
    data.forEach((bin) => {
      if (bin.bucket.recursiveCount > maxHeight) {
        maxHeight = bin.bucket.recursiveCount;
      }
    });

    const pixelFactor = chartHeight / maxHeight;

    const bars = data.map((bin) => {
      var bar = this.renderBar(bin, x, pixelFactor);
      x+= barItemWidth + 10;
      return bar;
    });
      return (
          <Svg
              height={chartHeight}
              width="1000"
          >
          {bars}
          </Svg>
      );
  }
}
