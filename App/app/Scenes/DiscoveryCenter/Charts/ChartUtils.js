/* @flow */
'use strict';

import { Actant, Statement } from '../../../Database';

import { Localizable } from '../../../Common';

// actant.professions.forEach(profession => {
//   const wordCount = values[profession.name] || 0;
//   values[profession.name] = wordCount + statement.wordCount;
// });

export function valuesForCard(card) {
  const statements = card.statements;
  const statementCount = statements.length;
  const filterCount = card.filters.length;
  const xAxis = card.xAxis;
  const yAxis = card.yAxis;

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
        addCountToLabelValue(count, statement.book.name, values);
        break;

      case 'chronology':
        if (statement.source) statement.source.chronologies.forEach(chronology => addCountToLabelValue(count, chronology.name, values));
        break;

      case 'gender':
        switch (xAxis.type) {
          case 'source':
            if (statement.source) addCountToLabelValue(count, statement.source.genderDescription, values);
            break;

          case 'recipient':
            statement.recipients.forEach(recipient => addCountToLabelValue(count, recipient.genderDescription, values));
            break;
        }
        break;

      case 'name':
        switch (xAxis.type) {
          case 'source':
            if (statement.source) addCountToLabelValue(count, statement.source.name, values);
            break;

          case 'recipient':
            statement.recipients.forEach(recipient => addCountToLabelValue(count, recipient.name, values));
            break;
        }
        break;

      case 'nature':
        switch (xAxis.type) {
          case 'source':
            if (statement.source) statement.source.natures.forEach(nature => addCountToLabelValue(count, nature.name, values));
            break;

          case 'recipient':
            statement.recipients.forEach(recipient => recipient.natures.forEach(nature => addCountToLabelValue(count, nature.name, values)));
            break;
        }
        break;

      case 'profession':
        switch (xAxis.type) {
          case 'source':
            if (statement.source) statement.source.professions.forEach(profession => addCountToLabelValue(count, profession.name, values));
            break;

          case 'recipient':
            statement.recipients.forEach(recipient => recipient.professions.forEach(profession => addCountToLabelValue(count, profession.name, values)));
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
            addCountToLabelValue(count, Localizable.t(sphereCount.string), values);
          }
        });
        break;

      case 'words':
        // FIXME
        // const words = await statement.words();
        // words.forEach(word => addCountToLabelValue(count, word, values));
        break;
    }
  }

  return Object.keys(values).sort((a,b) => values[a] > values[b] ? -1 : 1).map(label => ({label, color: 'red', value: values[label]}));
}

function addCountToLabelValue(count, label, values) {
  if (!label) return;
  const labelCount = values[label] || 0;
  values[label] = labelCount + count;
}
