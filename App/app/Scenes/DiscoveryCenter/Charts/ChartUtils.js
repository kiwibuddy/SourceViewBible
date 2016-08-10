/* @flow */
'use strict';

import { Actant, Book, Chronology, Nature, Profession, Role, Sphere, Statement } from '../../../Database';
import { predicateWithCard } from '../Filters/FilterUtils';
import { Localizable } from '../../../Common';

export async function valuesForCard(card) {
  const statements = card.statements;
  const statementCount = statements.length;
  const filterCount = card.filters.length;
  const xAxis = card.xAxis;
  const yAxis = card.yAxis;

  switch (yAxis.id) {
    case 'words':
      const predicate = predicateWithCard(card);

      switch (xAxis.id) {
        case 'book':
          return await Book.valuesByWordCount(predicate);

        case 'chronology':
          return await Chronology.valuesByWordCount(predicate);

        case 'name':
          return await Actant.valuesByWordCount(xAxis.type, predicate);

        case 'nature':
          return await Nature.valuesByWordCount(xAxis.type, predicate);

        case 'profession':
          return await Profession.valuesByWordCount(xAxis.type, predicate);

        case 'role':
          return await Role.valuesByWordCount(xAxis.type, predicate);

        case 'sphere':
          return await Sphere.valuesByWordCount(predicate);
      }
  }

  const values = {};

  for (let occurrence of statements) {
    const statement = Statement.findByID(occurrence.id);

    let count = 0;
    switch (yAxis.id) {
      case 'words':
        count = statement.wordCount;
        break;
    }

    switch (xAxis.id) {
      case 'gender':
        switch (xAxis.type) {
          case 'source':
            if (statement.source) addCountToLabelValue(count, statement.source.genderDescription, statement.source, values);
            break;

          case 'recipient':
            statement.recipients.forEach(recipient => addCountToLabelValue(count, recipient.genderDescription, recipient, values));
            break;
        }
        break;

      case 'words':
        const words = await statement.words();
        words.slice(0, 20).forEach(word => addCountToLabelValue(word.count, word.string, word, values));
        break;
    }
  }

  return Object.keys(values).sort((a,b) => values[a].count > values[b].count ? -1 : 1).map(label => ({label, object: values[label], value: values[label].count}));
}

function addCountToLabelValue(count, label, object, values) {
  if (!label) return;
  let labelValue = values[label];
  if (!labelValue) labelValue = {label, count: 0};
  labelValue.count = labelValue.count + count;
  values[label] = labelValue;
}
