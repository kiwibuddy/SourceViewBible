/* @flow */
'use strict';

import Schema from './Schema';
import Realm from 'realm';
import Emdros from 'react-native-emdros';
import RNFS from 'react-native-fs';

const DATABASE_PATH = '/tmp/SourceView.realm';
const JSON_PATH='/tmp/SourceView.json';

const BIBLE = {
  books: require('./books'),
  sources: [],
  spheres: [
    { id: "family", name: "Family", bookCount: 0, bookCounts: {}, wordCount: 0, words: [] },
    { id: "economics", name: "Economics", bookCount: 0, bookCounts: {}, wordCount: 0, words: [] },
    { id: "government", name: "Government", bookCount: 0, bookCounts: {}, wordCount: 0, words: [] },
    { id: "religion", name: "Religion", bookCount: 0, bookCounts: {}, wordCount: 0, words: [] },
    { id: "education", name: "Education", bookCount: 0, bookCounts: {}, wordCount: 0, words: [] },
    { id: "communication", name: "Communication", bookCount: 0, bookCounts: {}, wordCount: 0, words: [] },
    { id: "celebration", name: "Celebration", bookCount: 0, bookCounts: {}, wordCount: 0, words: [] },
  ],
  wordCount: 0,
};

const STOP_WORDS = ["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","s","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"];
const WORD_CLOUD_LIMIT = 20;
const MINIMUM_WORD_LENGTH = 2;

const SOURCE_TYPE_MAP = {
  "Black": "narrator",
  "Red": "god",
  "Green": "lead",
  "Blue": "support"
};

const SPHERE_MAP = {
  "family": "family",
  "economics": "economics",
  "government": "government",
  "religion": "religion",
  "education": "education",
  "mediacom": "communication",
  "celebration": "celebration"
};

const SPHERE_KEYS = BIBLE.spheres.map(sphere => Object.keys(SPHERE_MAP).find(key => SPHERE_MAP[key] === sphere.id));

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

async function seed(emdros, bible) {
  console.log('Seeding...');

  await seedBooks(emdros, bible);
  await seedSources(emdros, bible);
  await seedSpheres(emdros, bible);
}

async function seedBooks(emdros, bible) {
  console.log('Seeding Books...');

  await seedChapters(emdros, bible);
  await seedBookSources(emdros, bible);
  await seedSourceOccurrences(emdros, bible);
  await seedBookWordCounts(emdros, bible);
  await seedBookWordCloud(emdros, bible);
  await seedBookSourceWordCloud(emdros, bible);

  bible.wordCount = bible.books.reduce((wordCount, book) => wordCount + book.wordCount, 0);
}

async function seedChapters(emdros, bible) {
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
      for (let [index, book] of bible.books.entries()) {
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

async function seedBookSources(emdros, bible) {
  console.log('Seeding Book Sources...');
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
      for (let [index, book] of bible.books.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const sources = {}
          let sourceCount = 0;

          const sourceData = bookData["Source"]["source_name"];
          if (sourceData != null) {
            Object.keys(sourceData).forEach((sourceName) => {
              sources[sourceName] = {id: sourceName, wordCount: 0, words: []};
              sourceCount++;
            });
          }

          book.sources = sources;
          book.sourceCount = sourceCount;
        }
      }

      for (let [index, book] of bible.books.entries()) {
        const sources = book.sources;
        book.sources = Object.keys(sources).sort((a, b) => sources[a].wordCount > sources[b].wordCount ? -1 : 1).map((sourceName) => {
          const source = sources[sourceName];
          return {...source, name: sourceName};
        });
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    });
  });
}

async function seedSourceOccurrences(emdros, bible) {
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
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of bible.books.entries()) {
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
                  const source = sources.find(source => source.name === sourceName);
                  if (!source.occurrences) source.occurrences = [];
                  source.occurrences.push({
                    chapterNumber: chapterNumber
                  });
                });
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

async function seedBookWordCounts(emdros, bible) {
  await seedBookWordCount(emdros, bible);
  await seedChapterWordCounts(emdros, bible);

  await seedBookSourceWordCounts(emdros, bible);
  await seedBookSphereWordCount(emdros, bible);
  await seedBookSphereWordCounts(emdros, bible);

  await seedChapterSourceWordCounts(emdros, bible);
  await seedChapterSphereWordCount(emdros, bible);
  await seedChapterSphereWordCounts(emdros, bible);
}

async function seedBookWordCount(emdros, bible) {
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
      for (let [index, book] of bible.books.entries()) {
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

async function seedChapterWordCounts(emdros, bible) {
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
      for (let [index, book] of bible.books.entries()) {
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

async function seedBookSourceWordCounts(emdros, bible) {
  console.log('Seeding Book Source Word Counts...');
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
      for (let [index, book] of bible.books.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const sourceData = bookData["Source"];
          if (sourceData != null) {
            seedObjectSourceTypeWordCounts(book, sourceData);

            const sourceNameData = sourceData["source_name"];
            if (sourceNameData != null) {
              let maxSourceWordCount = 0;

              Object.keys(sourceNameData).forEach((sourceName) => {
                const source = book.sources.find(source => source.name === sourceName);
                const wordCount = sourceNameData[sourceName]["Token"] || 0;
                source.wordCount = wordCount;

                if (wordCount > maxSourceWordCount) {
                  maxSourceWordCount = wordCount;
                }
              });

              book.maxSourceWordCount = maxSourceWordCount;
            }
          }
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedBookSphereWordCounts(emdros, bible) {
  console.log('Seeding Book Sphere Word Counts...');
  const sphereFeatures = SPHERE_KEYS.map(key => `"${key}"`).join(', ');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Token",
      "feature": [${sphereFeatures}],
      "expression" : "is_word=true"
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of bible.books.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const spheresData = bookData["Token"];
          if (spheresData != null) {
            seedObjectSphereWordCounts(book, spheresData);
          }
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedBookSphereWordCount(emdros, bible) {
  console.log('Seeding Book Sphere Word Count...');

  const sphereExpression = SPHERE_KEYS.map(key => `${key}=true`).join(' OR ');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Token",
      "expression" : "is_word=true AND (${sphereExpression})"
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of bible.books.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const wordCount = bookData["Token"];
          if (wordCount) {
            book.sphereWordCount = wordCount;
          }
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedChapterSourceWordCounts(emdros, bible) {
  console.log('Seeding Chapter Source Word Counts...');
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

      for (let [index, book] of bible.books.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const chapterData = bookData["Chapter"]["chapter"];
          if (chapterData != null) {
            book.chapters.forEach((chapter, index) => {
              const sourceData = chapterData[chapter.chapterNumber.toString()]["Source"];
              if (sourceData != null) {
                seedObjectSourceTypeWordCounts(chapter, sourceData);

                const sourceNameData = sourceData["source_name"];
                if (sourceNameData != null) {
                  chapter.sourceCount = Object.keys(sourceNameData).length;
                } else {
                  chapter.sourceCount = 0;
                }
              }
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

async function seedChapterSphereWordCount(emdros, bible) {
  console.log('Seeding Chapter Sphere Word Count...');

  const sphereExpression = SPHERE_KEYS.map(key => `${key}=true`).join(' OR ');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Chapter",
      "feature": "chapter",
      "buckets": {
        "objectTypeName": "Token",
        "expression" : "is_word=true AND (${sphereExpression})"
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of bible.books.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const chapterData = bookData["Chapter"]["chapter"];
          if (chapterData != null) {
            book.chapters.forEach((chapter, index) => {
              const wordCount = chapterData[chapter.chapterNumber.toString()]["Token"] || 0;
              chapter.sphereWordCount = wordCount;
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

async function seedChapterSphereWordCounts(emdros, bible) {
  console.log('Seeding Chapter Sphere Word Counts...');

  const sphereFeatures = SPHERE_KEYS.map(key => `"${key}"`).join(', ');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Chapter",
      "feature": "chapter",
      "buckets": {
        "objectTypeName": "Token",
        "feature": [${sphereFeatures}],
        "expression" : "is_word=true"
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of bible.books.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const chapterData = bookData["Chapter"]["chapter"];
          if (chapterData != null) {
            let maxChapterSphereWordCount = 0;

            book.chapters.forEach((chapter, index) => {
              const spheresData = chapterData[chapter.chapterNumber.toString()]["Token"];
              if (spheresData) {
                seedObjectSphereWordCounts(chapter, spheresData);

                let chapterSphereWordCount = 0;
                Object.keys(spheresData).forEach((sphereName) => {
                  const sphereData = spheresData[sphereName];
                  const wordCount = sphereData.true;
                  if (wordCount && wordCount > 0) {
                    chapterSphereWordCount += wordCount;
                  }
                });

                if (chapterSphereWordCount > maxChapterSphereWordCount) {
                  maxChapterSphereWordCount = chapterSphereWordCount;
                }
              }
            });

            book.maxChapterSphereWordCount = maxChapterSphereWordCount;
          }
        }
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedBookWordCloud(emdros, bible) {
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
      for (let [index, book] of bible.books.entries()) {
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

async function seedBookSourceWordCloud(emdros, bible) {
  console.log('Seeding Book Source Word Cloud...');
  const query = `
  {
    "objectTypeName": "Book",
    "feature": "DJHRef",
    "buckets": {
      "objectTypeName": "Source",
      "feature": "source_name",
      "buckets": {
        "objectTypeName": "Token",
        "feature": "surface",
        "expression" : "is_word=true"
      }
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      for (let [index, book] of bible.books.entries()) {
        const bookData = data["Book"]["DJHRef"][book.DJHRef];
        if (bookData != null) {
          const sourceData = bookData["Source"]["source_name"];
          if (sourceData != null) {
            Object.keys(sourceData).forEach(sourceName => {
              const source = book.sources.find(source => source.name === sourceName);
              if (source != null) {
                const wordData = sourceData[sourceName]["Token"]["surface"];
                seedObjectWordCloud(source, wordData);
              }
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

async function seedSpheres(emdros, bible) {
  console.log('Seeding Spheres...');

  await seedSphereWordCounts(emdros, bible);

  const sphereNames = Object.keys(SPHERE_MAP);
  for (let sphereName of sphereNames) {
    await seedSphereWordCloud(sphereName, emdros, bible);
  }
}

async function seedSources(emdros, bible) {
  console.log('Seeding Sources...');

  await seedSourceWordCounts(emdros, bible);
  await seedSourceWordCloud(emdros, bible);
}

async function seedSourceWordCounts(emdros, bible) {
  console.log('Seeding Source Word Counts...');
  const query = `
  {
    "objectTypeName": "Source",
    "feature": "source_name",
    "buckets": {
      "objectTypeName": "Token",
      "expression" : "is_word=true"
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      const sourceData = data["Source"]["source_name"];
      if (sourceData != null) {
        Object.keys(sourceData).forEach(sourceName => {
          let source = bible.sources.find(source => source.name === sourceName);
          if (source == null) {
            source = {id: sourceName, name: sourceName, firstInitial: sourceName[0], wordCount: 0, words: [], gender: null, nature: null, chronologies: []};
            bible.sources.push(source);
          }

          const wordCount = sourceData[sourceName]["Token"] || 0;
          source.wordCount = wordCount;
        });
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedSourceWordCloud(emdros, bible) {
  console.log('Seeding Source Word Cloud...');
  const query = `
  {
    "objectTypeName": "Source",
    "feature": "source_name",
    "buckets": {
      "objectTypeName": "Token",
      "feature": "surface",
      "expression" : "is_word=true"
    }
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      const sourceData = data["Source"]["source_name"];
      if (sourceData != null) {
        Object.keys(sourceData).forEach(sourceName => {
          let source = bible.sources.find(source => source.name === sourceName);
          const wordData = sourceData[sourceName]["Token"]["surface"];
          seedObjectWordCloud(source, wordData);
        });
      }

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

async function seedSphereWordCounts(emdros, bible) {
  console.log('Seeding Spheres Word Counts...');

  return new Promise((resolve, reject) => {
    SPHERE_KEYS.forEach(key => {
      const sphere = bible.spheres.find(sphere => sphere.id === SPHERE_MAP[key]);
      if (sphere != null) {
        let bookCount = 0;
        let totalWordCount = 0;

        bible.books.forEach(book => {
          const wordCount = book.sphereCounts[sphere.id] || 0;
          sphere.bookCounts[book.id] = wordCount;

          if (wordCount > 0) {
            bookCount++;
            totalWordCount += wordCount;
          }
        });

        sphere.bookCount = bookCount;
        sphere.wordCount = totalWordCount;
      }
    });

    resolve();
  });
}

async function seedSphereWordCloud(sphereName, emdros, bible) {
  const sphere = bible.spheres.find(sphere => sphere.id === SPHERE_MAP[sphereName]);
  if (!sphere) {
    return;
  }

  console.log(`Seeding Sphere: ${sphere.name} Word Cloud...`);
  const query = `
  {
      "objectTypeName": "Token",
      "feature": ["surface"],
      "expression" : "is_word=true AND ${sphereName}=true"
  }
  `;

  return new Promise((resolve, reject) => {
    emdros.query(query, {count: true}).then((data) => {
      const wordData = data["Token"]["surface"];
      seedObjectWordCloud(sphere, wordData);

      resolve();
    }).catch((error) => {
      console.log(error);
    })
  });
}

function seedObjectSourceTypeWordCounts(object, sourceData) {
  object.sourceTypeCounts = {
    "narrator": 0,
    "god": 0,
    "lead": 0,
    "support": 0
  };
  object.principalSourceType = null;

  if (sourceData != null) {
    const sourceTypeData = sourceData["source_color"];
    if (sourceTypeData != null) {
      Object.keys(sourceTypeData).forEach(function(sourceColor, index) {
        const wordCount = sourceTypeData[sourceColor]["Token"] || 0;
        const sourceType = SOURCE_TYPE_MAP[sourceColor];
        object.sourceTypeCounts[sourceType] = wordCount;
      });
    }

    object.principalSourceType = Object.keys(object.sourceTypeCounts).reduce((a, b) => object.sourceTypeCounts[a] > object.sourceTypeCounts[b] ? a : b);
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

function seedObjectSphereWordCounts(object, spheresData) {
  if (!object.spheres) {
    object.sphereCounts = {};
    object.sphereCount = 0;
  }

  if (spheresData != null) {
    let sphereCount = 0;

    Object.keys(spheresData).forEach((sphereName) => {
      const sphereData = spheresData[sphereName];
      const wordCount = sphereData.true || 0;
      object.sphereCounts[SPHERE_MAP[sphereName]] = wordCount;

      if (wordCount > 0) {
        sphereCount++;
      }
    });

    object.sphereCount = sphereCount;
  }
}
