/* @flow */
'use strict';

import { Actant, Book, Statement } from '../../../Database';
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
      switch (xAxis.id) {
        case 'book':
        return await Book.valuesByWordCount(predicateWithCard(card));
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
      case 'book':
        addCountToLabelValue(count, statement.book.name, statement.book, values);
        break;

      case 'chronology':
        if (statement.source) statement.source.chronologies.forEach(chronology => addCountToLabelValue(count, chronology.name, chronology, values));
        break;

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

      case 'name':
        switch (xAxis.type) {
          case 'source':
            if (statement.source) addCountToLabelValue(count, statement.source.name, statement.source, values);
            break;

          case 'recipient':
            statement.recipients.forEach(recipient => addCountToLabelValue(count, recipient.name, recipient, values));
            break;
        }
        break;

      case 'nature':
        switch (xAxis.type) {
          case 'source':
            if (statement.source) statement.source.natures.forEach(nature => addCountToLabelValue(count, nature.name, nature, values));
            break;

          case 'recipient':
            statement.recipients.forEach(recipient => recipient.natures.forEach(nature => addCountToLabelValue(count, nature.name, nature, values)));
            break;
        }
        break;

      case 'profession':
        switch (xAxis.type) {
          case 'source':
            if (statement.source) statement.source.professions.forEach(profession => addCountToLabelValue(count, profession.name, profession, values));
            break;

          case 'recipient':
            statement.recipients.forEach(recipient => recipient.professions.forEach(profession => addCountToLabelValue(count, profession.name, profession, values)));
            break;
        }
        break;

      case 'role':
        // FIXME
        switch (xAxis.type) {
          case 'source':
            break;

          case 'recipient':
            break;
        }
        break;

      case 'sphere':
        statement.sphereCounts.forEach(sphereCount => {
          if (sphereCount.count > 0) {
            addCountToLabelValue(count, Localizable.t(sphereCount.string), sphereCount, values);
          }
        });
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
