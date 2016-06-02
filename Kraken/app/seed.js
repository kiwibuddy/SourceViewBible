/* @flow */
'use strict';

import Schema from './Schema';
import Realm from 'realm';
import Emdros from 'react-native-emdros';
import RNFS from 'react-native-fs';

const DATABASE_PATH = '/tmp/SourceView.realm';
const JSON_PATH='/tmp/SourceView.json';

const BIBLE = require('./books');

const STOP_WORDS = ["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","s","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"];
const WORD_CLOUD_LIMIT = 20;
const MINIMUM_WORD_LENGTH = 2;

const SOURCE_TYPE_MAP = {
  "Black": "narrator",
  "Red": "god",
  "Green": "lead",
  "Blue": "support"
};

const SPHERES = ["family", "economics", "government", "religion", "education", "communication", "celebration"];

export async function kraken() {
  console.log('Hello!');

  // const realm = new Realm({
  //   path: DATABASE_PATH,
  //   schema: Schema
  // });
  const realm = null;

  const emdros = await Emdros.open({name: 'Datasets/en/NLT/SourceView.bpt'});
  let objects = BIBLE;
  await seed(emdros, BIBLE);

  RNFS.writeFile(JSON_PATH, JSON.stringify(objects), 'utf8').then((success) => {
    console.log('Done Seeding.');
    console.log(objects);
  }).catch((err) => {
    console.log(err.message);
  });
}

async function seed(emdros, objects) {
  console.log('Seeding...');

  await seedChapters(emdros, objects);
  await seedSources(emdros, objects);
  await seedSourceOccurrences(emdros, objects);
  await seedWordCounts(emdros, objects);
  await seedBookWordCloud(emdros, objects);
}

async function seedChapters(emdros, objects) {
  console.log('Seeding Chapters...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Chapter"
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of objects.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const chapterCount = bookData["Chapter"] || 0;
          const chapters = []
          for (let i = 0; i < chapterCount; i++) {
            const chapterNumber = i + 1;
            const chapter = {
              chapterNumber: chapterNumber,
              monadSet: null
            };

            monadSetForBookChapterNumber(emdros, book.DJHRef, chapterNumber).then(monadSet => {
              chapter.monadSet = monadSet;
            });

            chapters.push(chapter);
          }
          book["chapterCount"] = chapters.length;
          book["chapters"] = chapters;
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    });
  });
}

async function monadSetForBookChapterNumber(emdros, book, chapterNumber) {
  const query = `
    SELECT ALL OBJECTS
    WHERE
    [Chapter DJHBook='${book}' AND chapter = ${chapterNumber}]
  `;

  return emdros.monadSet({query});
}

async function seedSources(emdros, objects) {
  console.log('Seeding Sources...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Source",
      "feature": "source_name"
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of objects.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const sources = {}

          const sourceData = bookData["Source"]["source_name"];
          if (sourceData != null) {
            Object.keys(sourceData).forEach((sourceName) => {
                sources[sourceName] = {};
            });
          }

          book.sources = sources;
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    });
  });
}

async function seedSourceOccurrences(emdros, objects) {
  console.log('Seeding Source Occurrences...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Chapter",
      "feature": "chapter",
      "buckets": {
        "objectTypeName": "Source",
        "feature": "source_name",
        "buckets": {
          "objectTypeName": "Token",
          "feature": "self"
        }
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of objects.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const sources = book.sources;
          const chapterData = bookData["Chapter"]["chapter"];
          if (chapterData != null) {
            book.chapters.forEach((chapter, index) => {
              const chapterNumber = chapter.chapterNumber;
              const sourceData = chapterData[chapterNumber.toString()]["Source"]["source_name"];
              if (sourceData != null) {
                Object.keys(sourceData).forEach((sourceName) => {
                  const source = sources[sourceName];
                  if (!source.occurrences) source.occurrences = [];

                  const monadData = sourceData[sourceName]["Token"]["self"];
                  if (monadData != null) {

                    let firstMonad = null;
                    Object.keys(monadData).sort((a, b) => a > b ? 1 : -1).forEach((lastMonad) => {
                      if (firstMonad == null) firstMonad = lastMonad;

                      if (lastMonad != firstMonad && lastMonad - 1 != firstMonad) {
                        const occurrence = {
                          chapter: chapterNumber,
                          monadSet: {
                            first: parseInt(firstMonad),
                            last: parseInt(lastMonad)
                          }
                        }
                        source.occurrences.push(occurrence);
                        // console.log(`${book.name} - ${chapterNumber} - ${sourceName} occurrence {${firstMonad}, ${lastMonad}}`);
                      }

                      firstMonad = lastMonad;
                    });
                  }
                })
              }
            });
          }
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    });
  });
}

async function seedWordCounts(emdros, objects) {
  await seedBookWordCounts(emdros, objects);
  await seedChapterWordCounts(emdros, objects);
  await seedBookSourceWordCounts(emdros, objects);
  await seedBookSphereWordCounts(emdros, objects);
  await seedChapterSourceWordCounts(emdros, objects);
}

async function seedBookWordCounts(emdros, objects) {
  console.log('Seeding Book Word Counts...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Token",
      "expression" : "is_word=true"
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of objects.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const wordCount = bookData["Token"] || 0;
          book["wordCount"] = wordCount;
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedChapterWordCounts(emdros, objects) {
  console.log('Seeding Chapter Word Counts...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Chapter",
      "feature": "chapter",
      "buckets": {
        "objectTypeName": "Token",
        "expression" : "is_word=true"
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of objects.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const chapterData = bookData["Chapter"]["chapter"];
          if (chapterData != null) {
            let maxChapterWordCount = 0;
            book.chapters.forEach((chapter, index) => {
              const wordCount = chapterData[chapter.chapterNumber.toString()]["Token"] || 0;
              chapter["wordCount"] = wordCount;
              if (wordCount > maxChapterWordCount) {
                maxChapterWordCount = wordCount;
              }
            });
            book.maxChapterWordCount = maxChapterWordCount;
          }
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedBookSourceWordCounts(emdros, objects) {
  console.log('Seeding Book Source Word Counts');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Source",
      "feature": ["source_color", "source_name"],
      "buckets": {
        "objectTypeName": "Token",
        "expression" : "is_word=true"
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of objects.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const sourceData = bookData["Source"];
          seedObjectSourceWordCounts(book, sourceData);
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedBookSphereWordCounts(emdros, objects) {
  console.log('Seeding Book Sphere Word Counts');

  return new Promise((resolve, reject) => {
    for (let [index, book] of objects.entries()) {
      book.principalSphere = SPHERES[Math.floor(Math.random() * SPHERES.length)];
    }

    resolve();
  });
}

async function seedChapterSourceWordCounts(emdros, objects) {
  console.log('Seeding Chapter Source Word Counts');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Chapter",
      "feature": "chapter",
      "buckets": {
        "objectTypeName": "Source",
        "feature": ["source_color", "source_name"],
        "buckets": {
          "objectTypeName": "Token",
          "expression" : "is_word=true"
        }
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      let bookObjects = [];

      for (let [index, book] of objects.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const chapterData = bookData["Chapter"]["chapter"];
          if (chapterData != null) {
            book.chapters.forEach((chapter, index) => {
              const sourceData = chapterData[chapter.chapterNumber.toString()]["Source"];
              seedObjectSourceWordCounts(chapter, sourceData);
            });
          }
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedBookWordCloud(emdros, objects) {
  console.log('Seeding Book Word Cloud...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Token",
      "feature": "surface",
      "expression" : "is_word=true"
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of objects.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const wordData = bookData["Token"]["surface"];
          seedObjectWordCloud(book, wordData);
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

function seedObjectSourceWordCounts(object, sourceData) {
  object.sourceCount = 0;
  object.maxSourceWordCount = 0;
  object.sourceCounts = [];
  object.sourceTypeCounts = {
    "narrator": 0,
    "god": 0,
    "lead": 0,
    "support": 0
  };

  if (sourceData != null) {
    const sourceTypeData = sourceData["source_color"];
    if (sourceTypeData != null) {
      Object.keys(sourceTypeData).forEach(function(sourceColor, index) {
        const wordCount = sourceTypeData[sourceColor]["Token"] || 0;
        const sourceType = SOURCE_TYPE_MAP[sourceColor];
        object.sourceTypeCounts[sourceType] = wordCount;
      });
    }

    const sourceNameData = sourceData["source_name"];
    if (sourceNameData != null) {
      const sourceCounts = {};
      Object.keys(sourceNameData).forEach(function(sourceName, index) {
        const wordCount = sourceNameData[sourceName]["Token"] || 0;
        sourceCounts[sourceName] = wordCount;
      });

      object.sourceCounts = Object.keys(sourceCounts).sort((a, b) => sourceCounts[a] > sourceCounts[b] ? -1 : 1).map((source) => {
        return {name: source, wordCount: sourceCounts[source]};
      });

      object.sourceCount = object.sourceCounts.length;
      object.maxSourceWordCount = object.sourceCounts[0].wordCount;
    }
  }
}

function seedObjectWordCloud(object, wordData) {
  if (wordData != null) {
    const words = Object.keys(wordData).filter((word) => {
      return word.length > MINIMUM_WORD_LENGTH && STOP_WORDS.indexOf(word.toLowerCase()) == -1;
    });
    object.words = words.sort((a, b) => wordData[a] > wordData[b] ? -1 : 1).slice(0, WORD_CLOUD_LIMIT).map((word) => {
      return {word: word, wordCount: wordData[word]};
    });
  } else {
    object.words = [];
  }
}
