/* @flow */
'use static'

const Colors = [
  '#EC4E51',
  '#FFDA88',
  '#D4A88D',
  '#44BEC7',
  '#917FB7',
  '#669ACC',
  '#67B869',
  '#F5A623',
  '#E58586',
  '#885EFF',
];

export const DeltaColor = '#323B43';

const MINIMUM_ALPHA_VALUE = 10;
const ALPHA_STEP_VALUE = 10;

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
