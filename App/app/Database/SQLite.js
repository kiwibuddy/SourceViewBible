import SQLite from 'react-native-sqlite-storage';

module.exports = SQLite.openDatabase({name : "SourceView", readOnly: true, createFromLocation : "~Datasets/en/NLT/SourceView.sqlite3"});
