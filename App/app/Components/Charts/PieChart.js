/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import {
  ART,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ColorPropType from 'ColorPropType';

const {
  Group,
  Path,
  Shape,
  Surface,
} = ART;

const DEFAULT_SLICE_WIDTH = 4;
const STROKE_WIDTH = 1;


import StyleSheet from '../../Common/StyleSheet';
import Colors from '../../Common/Colors';

const PieChart = (props: Object) => {
  const { color, size, slices: data, titleStyle, subtitleStyle } = props;
  const chartStyle = [styles.chart, props.style, {width: size, height: size}];

  const sliceStyle = [styles.slice, {borderTopColor: color, borderLeftColor: color, borderBottomColor: color }];
  const title = props.title ? <Text numberOfLines={1} style={[styles.title, {color: color}, titleStyle]}>{props.title}</Text> : null;
  const subtitle = props.subtitle ? <Text style={[styles.subtitle, subtitleStyle]}>{props.subtitle}</Text> : null;

  const radius = (size / 2) - STROKE_WIDTH;

  const centerX = size / 2;
  const centerY = size / 2;

  const slices = data.filter(slice => slice.value > 0);
  // Gather sum of all data to determine angles
  const sum = slices.reduce((sum, slice) => sum += slice.value, 0);

  const sectors = slices.map(slice => Math.floor(360 * (slice.value/sum)));
  let startAngle = 0;

  const arcs = [];
  const colors = [];
  sectors.forEach((sectionPiece, i) => {
    let endAngle = startAngle + sectionPiece;
    if (endAngle > 360) {
      endAngle = 360;
    }
    if (endAngle - startAngle === 0) {
      startAngle += sectionPiece;
      return;
    }
    if ((i === sectors.length - 1) && endAngle < 360) {
      endAngle = 360;
    }
    arcs.push({ startAngle, endAngle, outerRadius: radius });
    colors.push(slices[i].color);
    startAngle += sectionPiece;
  });

  const wedges = arcs.map((arc, i) => {
		return (
			<Wedge
				stroke={colors[i]}
				strokeWidth={STROKE_WIDTH}
				fill={colors[i]}
				key={'wedge-' + i}
				originX={centerX}
				originY={centerY}
        innerRadius={(size/2) - props.sliceWidth}
				{...arc}
			/>
		);
	});

  return (
    <TouchableOpacity style={chartStyle} onPress={props.onPress}>
			<View style={StyleSheet.absoluteFill}>
				<Surface width={size} height={size}>
					<Group>
            {wedges}
					</Group>
				</Surface>
			</View>
      {title}
      {subtitle}
		</TouchableOpacity>
  );
};

class Wedge extends Component<void, any, any> {
	static propTypes = {
		outerRadius: PropTypes.number.isRequired,
		startAngle: PropTypes.number.isRequired,
		endAngle: PropTypes.number.isRequired,
		originX: PropTypes.number.isRequired,
		originY: PropTypes.number.isRequired,
		innerRadius: PropTypes.number,
	};

	constructor(props : any) {
		super(props);
		(this:any).circleRadians = Math.PI * 2;
		(this:any).radiansPerDegree = Math.PI / 180;
		(this:any)._degreesToRadians = this._degreesToRadians.bind(this);
	}

	_degreesToRadians(degrees : number) : number {
		if (degrees !== 0 && degrees % 360 === 0) { // 360, 720, etc.
			return (this:any).circleRadians;
		}
		return degrees * (this:any).radiansPerDegree % (this:any).circleRadians;
	}

 	_createCirclePath(or : number, ir : number) : Path {
		const path = new Path();

		path.move(1, 1 + or)
				.arc(or * 2, 0, or)
				.arc(-or * 2, 0, or);

		if (ir) {
			path.move(or - ir, 0)
					.counterArc(ir * 2, 0, ir)
					.counterArc(-ir * 2, 0, ir);
		}

		path.close();

		return path;
	}

	_createArcPath(originX : number, originY : number, startAngle : number, endAngle : number, or : number, ir : number) : Path {
		const path = new Path();

		// angles in radians
		const sa = this._degreesToRadians(startAngle);
		const ea = this._degreesToRadians(endAngle);

		// central arc angle in radians
		const ca = sa > ea ? (this:any).circleRadians - sa + ea : ea - sa;

		// cached sine and cosine values
		const ss = Math.sin(sa);
		const es = Math.sin(ea);
		const sc = Math.cos(sa);
		const ec = Math.cos(ea);

		// cached differences
		const ds = es - ss;
		const dc = ec - sc;
		const dr = ir - or;

		// if the angle is over pi radians (180 degrees)
		// we will need to let the drawing method know.
		const large = ca > Math.PI;

		// TODO (sema) Please improve theses comments to make the math
		// more understandable.
		//
		// Formula for a point on a circle at a specific angle with a center
		// at (0, 0):
		// x = radius * Math.sin(radians)
		// y = radius * Math.cos(radians)
		//
		// For our starting point, we offset the formula using the outer
		// radius because our origin is at (top, left).
		// In typical web layout fashion, we are drawing in quadrant IV
		// (a.k.a. Southeast) where x is positive and y is negative.
		//
		// The arguments for path.arc and path.counterArc used below are:
		// (endX, endY, radiusX, radiusY, largeAngle)

		path.move(1 + or + (or * ss), 1 + or - (or * sc)) // move to starting point
				.arc(or * ds, or * -dc, or, or, large) // outer arc
				.line(dr * es, dr * -ec);	// width of arc or wedge

		if (ir) {
			path.counterArc(ir * -ds, ir * dc, ir, ir, large); // inner arc
		}

		return path;
	}

	render() : any {
		// angles are provided in degrees
		const startAngle = this.props.startAngle;
		const endAngle = this.props.endAngle;
		// if (startAngle - endAngle === 0) {
		// 	return null;
		// }

		// radii are provided in pixels
		const innerRadius = this.props.innerRadius || 0;
		const outerRadius = this.props.outerRadius;

		const { originX, originY } = this.props;

		// sorted radii
		const ir = Math.min(innerRadius, outerRadius);
		const or = Math.max(innerRadius, outerRadius);

		let path;
		if (endAngle >= startAngle + 360) {
			path = this._createCirclePath(or, ir);
		} else {
			path = this._createArcPath(originX, originY, startAngle, endAngle, or, ir);
		}

		return <Shape {...this.props} d={path} />;
	}
}

PieChart.propTypes = {
  color: ColorPropType,
  onPress: PropTypes.func,
  slices: PropTypes.arrayOf(PropTypes.shape({
    color: ColorPropType.isRequired,
    value: PropTypes.number.isRequired,
  })).isRequired,
  sliceWidth: PropTypes.number,
  style: PropTypes.any,
  size: PropTypes.number.isRequired,
  subtitle: PropTypes.string,
  subtitleStyle: PropTypes.any,
  title: PropTypes.string,
  titleStyle: PropTypes.any,
};

PieChart.defaultProps = {
  sliceWidth: DEFAULT_SLICE_WIDTH,
};

const styles = StyleSheet.create({
  chart: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
  },
  subtitle: {
    fontSize: 14,
    color: '#59626A',
  },
});

export default PieChart;
