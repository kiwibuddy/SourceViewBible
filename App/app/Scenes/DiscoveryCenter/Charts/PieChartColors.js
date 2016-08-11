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

export function colorAtIndex(index: number) {
  const colorCount = Colors.length;
  const number = index % colorCount;
  let color = Colors[number];

  const alpha = parseInt(index / colorCount);
  if (alpha > 0) {
    color += (100 - (alpha * 10)).toString();
  }
  return color;
}

export default Colors;
