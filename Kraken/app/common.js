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

const STOP_WORDS = ["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","s","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"];
const WORD_CLOUD_LIMIT = 20;
const MINIMUM_WORD_LENGTH = 2;

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

export function seedObjectWordCloud(object: Object, wordData: Object) {
  if (wordData != null) {
    const words = Object.keys(wordData).filter((word) => {
      return word.length > MINIMUM_WORD_LENGTH && STOP_WORDS.indexOf(word.toLowerCase()) == -1;
    }).sort((a, b) => wordData[a] > wordData[b] ? -1 : 1).slice(0, WORD_CLOUD_LIMIT).map((word) => {
      return {string: word, count: wordData[word]};
    });

    object.words = words;
  }
}

export function getChapterID(book: Object, chapterNumber: number) {
  return `${book.id}-${chapterNumber}`;
}

export function firstInitial(name: string) {
  const firstInitial = name.charAt(0);
  return isNumber(firstInitial) ? null : firstInitial;
}

export function getSourceID(name: string) {
  return name;
}

export function isNumber(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
