/* @flow */
'use static'

const Colors = [
  '#808BE4',
  '#D2F4F0',
  '#967B8E',
  '#3C7907',
  '#C61069',
  '#FD280F',
  '#A7100F',
  '#4360EC',
  '#920EA3',
  '#67871D',
];

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
