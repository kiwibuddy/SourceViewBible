/* @flow */
'use strict';

import { Actant, Book, Chronology, Gender, Nature, Profession, Role, Sphere, Statement, Word } from '../../../Database';
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

        case 'gender':
          return await Gender.valuesByWordCount(xAxis.type, predicate);

        case 'nature':
          return await Nature.valuesByWordCount(xAxis.type, predicate);

        case 'profession':
          return await Profession.valuesByWordCount(xAxis.type, predicate);

        case 'role':
          return await Role.valuesByWordCount(xAxis.type, predicate);

        case 'sphere':
          return await Sphere.valuesByWordCount(predicate);

        case 'words':
          return await Word.valuesByWordCount(predicate);
      }
  }
  
  return [];
}

function addCountToLabelValue(count, label, object, values) {
  if (!label) return;
  let labelValue = values[label];
  if (!labelValue) labelValue = {label, count: 0};
  labelValue.count = labelValue.count + count;
  values[label] = labelValue;
}
