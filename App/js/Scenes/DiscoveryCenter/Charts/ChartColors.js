/* @flow */
'use static'

const Colors = [
  '#FF3F49',
  '#DC30D6',
  '#B73FFF',
  '#7C60FF',
  '#408BFE',
  '#6FECFF',
  '#80FF77',
  '#F8FF7C',
  '#FFD877',
  '#FFAA7C',
];

const DeltaColor = '#323B43';

const MINIMUM_ALPHA_VALUE = 5;
const ALPHA_STEP_VALUE = 10;

function hexToRGBA(hex: string, opacity: number) {
  hex = hex.replace('#','');
  const r = parseInt(hex.substring(0,2), 16);
  const g = parseInt(hex.substring(2,4), 16);
  const b = parseInt(hex.substring(4,6), 16);

  return 'rgba('+r+','+g+','+b+','+opacity/100+')';
}

function colorAtIndex(index: number) {
  const colorCount = Colors.length;
  const number = index % colorCount;
  let color = Colors[number];

  const percent = parseInt(index / colorCount);
  if (percent > 0) {
    const alpha = Math.max((100 - (percent * ALPHA_STEP_VALUE)), MINIMUM_ALPHA_VALUE);
    color = hexToRGBA(color, alpha);
  }
  return color;
}

module.exports = {
  colors: Colors,
  deltaColor: DeltaColor,
  colorAtIndex
}
