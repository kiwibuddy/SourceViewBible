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

const STOP_WORDS = ["the","and","of","to","you","will","in","I","a","he","for","they","your","is","with","his","from","that","be","all","them","as","who","it","was","but","my","have","s","this","their","are","me","on","him","people","then","so","not","when","were","had","king","what","by","we","at","said","one","has","t","do","son","out","if","there","no","or","land","like","us","must","these","up","those","her","day","our","now","man","into","am","can","come","let","because","go","about","against","give","down","even","don","an","over","other","she","before","made","been","men","its"];
const WORD_CLOUD_LIMIT = 20;
const MINIMUM_WORD_LENGTH = 2;

export function seedObjectSourceTypeWordCounts(realm: Object, type: string, key: any, sourceTypeData: Object) {
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
    const principalSourceType = sourceTypeCounts[0].string;

    realm.create(type, {id: key, sourceTypeCount, sourceTypeCounts, principalSourceType}, true);
  }
}

export function seedObjectSphereWordCounts(realm: Object, type: string, key: any, spheresData: Object) {
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

    realm.create(type, {id: key, sphereCount, sphereCounts}, true);
  }
}

export function seedObjectWordCloud(realm: Object, type: string, key: any, wordCounts: Object) {
  if (wordCounts != null) {
    let wordCount = 0;

    if (!Array.isArray(wordCounts)) {
      wordCounts = Object.keys(wordCounts).map((word) => {
        return {string: word, count: wordCounts[word]};
      });
    }

    const words = wordCounts.filter((word) => {
      wordCount += word.count;
      return word.string.length > MINIMUM_WORD_LENGTH && STOP_WORDS.indexOf(word.string) == -1;
    }).sort((a, b) => a.count > b.count ? -1 : 1).slice(0, WORD_CLOUD_LIMIT);

    realm.create(type, {id: key, wordCount, words}, true);
  }
}

export function getChapterID(book: Object, chapterNumber: number) {
  return `${book.id}-${chapterNumber}`;
}

export function firstInitial(name: string) {
  const firstInitial = name.charAt(0);
  return isNumber(firstInitial) ? '#' : firstInitial;
}

export function getSourceID(name: string) {
  return name;
}

export function isNumber(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
