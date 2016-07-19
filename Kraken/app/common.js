/* @flow */
'use strict';

export const SOURCE_TYPE_MAP = {
  "Black": "narrator",
  "Red": "god",
  "Green": "lead",
  "Blue": "support"
};

export const SPHERE_MAP = {
  "family": "family",
  "economics": "economics",
  "government": "government",
  "religion": "religion",
  "education": "education",
  "mediacom": "communication",
  "celebration": "celebration"
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

export function seedObjectSphereWordCounts(object: Object, spheresData: Object) {
  if (spheresData != null) {
    let sphereCount = 0;
    const sphereCounts = [];

    Object.keys(spheresData).forEach((sphereName) => {
      const sphereData = spheresData[sphereName];
      const wordCount = sphereData.true || 0;

      sphereCounts.push({
        string: SPHERE_MAP[sphereName],
        count: wordCount
      });

      if (wordCount > 0) {
        sphereCount++;
      }
    });

    object.sphereCount = sphereCount;
    object.sphereCounts = sphereCounts;
  }
}

export function isNumber(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
