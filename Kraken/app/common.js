/* @flow */
'use strict';

const SOURCE_TYPE_MAP = {
  "Black": "narrator",
  "Red": "god",
  "Green": "lead",
  "Blue": "support"
};

export function seedObjectSourceTypeWordCounts(object: Object, sourceTypeData: Object) {
  if (sourceTypeData != null) {
    let sourceTypeCount = 0;
    const sourceTypeCounts = [];
    Object.keys(SOURCE_TYPE_MAP).forEach(sourceColor => {
      const wordCountData = sourceTypeData[sourceColor] || {"Token": 0};
      const wordCount = wordCountData["Token"];
      if (wordCount > 0) sourceTypeCount++;
      sourceTypeCounts.push({
        string: SOURCE_TYPE_MAP[sourceColor],
        count: wordCount
      })
    });

    sourceTypeCounts.sort((a: Object, b: Object) => a.count > b.count ? -1 : 1);

    object.sourceTypeCount = sourceTypeCount;
    object.sourceTypeCounts = sourceTypeCounts;
    object.principalSourceType = sourceTypeCounts[0].string;
  }
}

export function isNumber(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
