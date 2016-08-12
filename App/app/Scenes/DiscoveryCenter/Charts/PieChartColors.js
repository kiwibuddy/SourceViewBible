/* @flow */
'use static'

const Colors = [
  '#FF3F49',
  '#FF40F9',
  '#B73FFF',
  '#7C60FF',
  '#408BFE',
  '#6FECFF',
  '#80FF77',
  '#F8FF7C',
  '#FFD877',
  '#FFAA7C',
];

export const DeltaColor = '#323B43';

const MINIMUM_ALPHA_VALUE = 5;
const ALPHA_STEP_VALUE = 5;

export function colorAtIndex(index: number) {
  const colorCount = Colors.length;
  const number = index % colorCount;
  let color = Colors[number];

  const percent = parseInt(index / colorCount);
  if (percent > 0) {
    const alpha = Math.max((100 - (percent * ALPHA_STEP_VALUE)), MINIMUM_ALPHA_VALUE);
    color += alpha.toString();
  }
  return color;
}

export default Colors;
