/* @flow */
'use strict';

import Realm from 'realm';

const BibleSchema = {
  name: 'Bible',
  properties: {
    wordCount: 'int',
  }
};

class Bible extends Realm.Object {

}
Bible.schema = BibleSchema;

const ActantSchema = {
  name: 'Actant',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: {type: 'string', indexed: true},
    firstInitial: {type: 'string', optional: true},
    gender: 'int',
    natures: {type: 'list', objectType: 'Nature'},
    actantNumber: {type: 'int', optional: true},
    chronologies: {type: 'list', objectType: 'Chronology'},
    professions: {type: 'list', objectType: 'Profession'},
    isSource: 'bool',
    isRecipient: 'bool',
    sourceTypeCount: {type: 'int', default: 0},
    sourceTypeCounts: {type: 'list', objectType: 'Count'},
    principalSourceType: {type: 'string', default: 'other'},
    sphereCount: {type: 'int', default: 0},
    sphereCounts: {type: 'list', objectType: 'Count'},
    sphereWordCount: {type: 'int', default: 0},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
  }
};

class Actant extends Realm.Object {

}
Actant.schema = ActantSchema;

const BookSchema = {
  name: 'Book',
  primaryKey: 'id',
  properties: {
    id: 'string',
    DJHRef: 'string',
    name: {type: 'string', indexed: true},
    testament: 'int',
    textOrder: {type: 'int', indexed: true},
    firstMonad: {type: 'int', default: 0},
    lastMonad: {type: 'int', default: 0},
    chapterCount: {type: 'int', default: 0},
    chapters: {type: 'list', objectType: 'Chapter'},
    maxChapterWordCount: {type: 'int', default: 0},
    maxSourceWordCount: {type: 'int', default: 0},
    maxChapterSphereWordCount: {type: 'int', default: 0},
    sourceCount: {type: 'int', default: 0},
    sourceRelations: {type: 'list', objectType: 'SourceRelation'},
    sourceTypeCount: {type: 'int', default: 0},
    sourceTypeCounts: {type: 'list', objectType: 'Count'},
    principalSourceType: {type: 'string', default: 'narrator'},
    sphereCount: {type: 'int', default: 0},
    sphereCounts: {type: 'list', objectType: 'Count'},
    sphereWordCount: {type: 'int', default: 0},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
    overview: {type: 'list', objectType: 'Content'},
  }
};

class Book extends Realm.Object {

}
Book.schema = BookSchema;

const BookSourceOccurrenceSchema = {
  name: 'BookSourceOccurrence',
  primaryKey: 'id',
  properties: {
    id: 'int',
    book: 'Book',
    name: 'string',
    number: 'int',
    roleID: 'int',
    firstMonad: 'int',
    lastMonad: 'int',
    reference: 'string',
  }
};

class BookSourceOccurrence extends Realm.Object {

}
BookSourceOccurrence.schema = BookSourceOccurrenceSchema;


const ChapterSchema = {
  name: 'Chapter',
  primaryKey: 'id',
  properties: {
    id: 'string',
    chapterNumber: 'int',
    firstMonad: {type: 'int', default: 0},
    lastMonad: {type: 'int', default: 0},
    sourceCount: {type: 'int', default: 0},
    sourceTypeCount: {type: 'int', default: 0},
    sourceTypeCounts: {type: 'list', objectType: 'Count'},
    principalSourceType: {type: 'string', default: 'narrator'},
    sphereCount: {type: 'int', default: 0},
    sphereCounts: {type: 'list', objectType: 'Count'},
    sphereWordCount: {type: 'int', default: 0},
    wordCount: {type: 'int', default: 0},
    verseCount: {type: 'int', default: 0},
  }
};

class Chapter extends Realm.Object {

}
Chapter.schema = ChapterSchema;

const ChronologySchema = {
  name: 'Chronology',
  primaryKey: 'id',
  properties: {
    id: 'int',
    key: 'string',
    from: {type: 'int', indexed: true},
    to: 'int',
  }
};

export class Chronology extends Realm.Object {

}
Chronology.schema = ChronologySchema;

const ContentSchema = {
  name: 'Content',
  properties: {
    title: 'string',
    body: 'string',
  }
};

class Content extends Realm.Object {

}
Content.schema = ContentSchema;

const CountSchema = {
  name: 'Count',
  properties: {
    string: 'string',
    count: {type: 'int', default: 0},
  }
};

class Count extends Realm.Object {

}
Count.schema = CountSchema;

const MonadSetSchema = {
  name: 'MonadSet',
  properties: {
    firstMonad: 'int',
    lastMonad: 'int'
  }
}
export class MonadSet extends Realm.Object {

}
MonadSet.schema = MonadSetSchema;

const NatureSchema = {
  name: 'Nature',
  primaryKey: 'id',
  properties: {
    id: 'int',
    key: 'string',
  }
};

export class Nature extends Realm.Object {

}
Nature.schema = NatureSchema;

const ProfessionSchema = {
  name: 'Profession',
  primaryKey: 'id',
  properties: {
    id: 'int',
    key: 'string',
    searchable: {type: 'bool', default: true}
  }
}
class Profession extends Realm.Object {

}
Profession.schema = ProfessionSchema;

const SourceRelationSchema = {
  name: 'SourceRelation',
  primaryKey: 'id',
  properties: {
    id: 'string',
    book: 'Book',
    source: 'Actant',
    sourceTypeCount: {type: 'int', default: 0},
    sourceTypeCounts: {type: 'list', objectType: 'Count'},
    principalSourceType: {type: 'string', default: 'support'},
    sphereCount: {type: 'int', default: 0},
    sphereCounts: {type: 'list', objectType: 'Count'},
    sphereWordCount: {type: 'int', default: 0},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
  }
};

class SourceRelation extends Realm.Object {

}
SourceRelation.schema = SourceRelationSchema;

const SphereSchema = {
  name: 'Sphere',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    description: 'string',
    position: 'int',
    bookCount: {type: 'int', default: 0},
    bookCounts: {type: 'list', objectType: 'Count'},
    wordCount: {type: 'int', default: 0},
    words: {type: 'list', objectType: 'Count'},
    passages: {type: 'list', objectType: 'SpherePassage'},
  }
};

class Sphere extends Realm.Object {

}
Sphere.schema = SphereSchema;

const SpherePassageSchema = {
  name: 'SpherePassage',
  properties: {
    section: 'string',
    number: 'int',
    title: 'string',
    reference: 'string',
    monads: {type: 'list', objectType: 'MonadSet'},
  }
}

export class SpherePassage extends Realm.Object {

}
SpherePassage.schema = SpherePassageSchema;


const Schema = [Actant, Bible, Book, BookSourceOccurrence, Chapter, Chronology, MonadSet, Nature, Profession, SourceRelation, Sphere, SpherePassage, Count, Content];
export default Schema;
