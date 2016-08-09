/* @flow */
'use strict';

import { Statement } from '../../../Database';

export function valuesForCard(card) {
  const statements = card.statements;
  const values = {};
  statements.forEach(occurrence => {
    const statement = Statement.findByID(occurrence.id);
    const actant = statement.source;
    if (actant) {
      actant.professions.forEach(profession => {
        const wordCount = values[profession.name] || 0;
        values[profession.name] = wordCount + statement.wordCount;
      });
    }
  });

  return Object.keys(values).sort((a,b) => values[a] > values[b] ? -1 : 1).map(label => ({label, color: 'red', value: values[label]}));
}
