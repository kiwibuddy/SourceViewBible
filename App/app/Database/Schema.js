const Book = {
  name: 'Book',
  properties: {
    name: 'string',
    DJHRef: 'string',
    chapters: {type: 'list', objectType: 'Chapter'},
    sources: {type: 'list', objectType: 'Source'},
    spheres: {type: 'list', objectType: 'Sphere'},
    wordCount: 'int',
    words: {type: 'list', objectType: 'WordCount'},
  }
};

const Chapter = {
  name: 'Chapter',
  properties: {
    chapter: 'int',
    DJHRef: 'string',
    sources: {type: 'list', objectType: 'Source'},
    spheres: {type: 'list', objectType: 'Sphere'},
    wordCount: 'int',
    words: {type: 'list', objectType: 'WordCount'},
  }
};

 onst Source = {
  name: 'Source',
  properties: {
    name: 'string',
  }
};

const Sphere = {
  name: 'Sphere',
  properties: {
    name: 'string'
  }
};

const WordCount = {
  name: 'WordCount',
  properties: {
    word: 'string',
    count: 'int',
  }
}
