/* @flow */
'use strict';

import { ComparisonPredicate, CompoundPredicate, WordPredicate } from '../../../Database';

export function cardWithFilter(card: Object, filter: Object) {
  const filterIndex = card.filters.findIndex(existingFilter => existingFilter.id === filter.id);

  if (filterIndex != -1) {
    card.filters.splice(filterIndex, 1, filter);
  } else {
    card.filters.push(filter);
  }

  return card;
}

export function predicateWithCard(card: Object) {
  const predicates = [];
  card.filters.forEach(filter => {
    switch(filter.type) {
      case 'actant':
        predicates.push(ComparisonPredicate.predicateWith(`${filter.actantType}_statements.id`, '=', filter.actant.id));
        break;

      case 'actant-number':
        predicates.push(ComparisonPredicate.predicateWith(`${filter.actantType}_actant_number_statements.id`, '=', filter.actantNumber.id));
        break;

      case 'book':
        predicates.push(ComparisonPredicate.predicateWith('statements.first', '>=', filter.book.firstMonad));
        predicates.push(ComparisonPredicate.predicateWith('statements.last', '<=', filter.book.lastMonad));
        break;

      case 'book-range':
        predicates.push(ComparisonPredicate.predicateWith('statements.first', '>=', filter.books.from.firstMonad));
        predicates.push(ComparisonPredicate.predicateWith('statements.last', '<=', filter.books.to.lastMonad));
        break;

      case 'chronology':
        predicates.push(ComparisonPredicate.predicateWith('chronology_statements.id', '=', filter.chronology.id));
        break;

      case 'chronology-range':
        const chronologies = Chronology.whereInRange(filter.chronologies.from, filter.chronologies.to).map(chronology => chronology.id);
        predicates.push(ComparisonPredicate.predicateWith('chronology_statements.id', 'IN', chronologies));
        break;

      case 'gender':
        predicates.push(ComparisonPredicate.predicateWith(`${filter.actantType}_gender_statements.id`, '=', filter.gender.id));
        break;

      case 'nature':
        predicates.push(ComparisonPredicate.predicateWith(`${filter.actantType}_nature_statements.id`, '=', filter.nature.id));
        break;

      case 'profession':
        predicates.push(ComparisonPredicate.predicateWith(`${filter.actantType}_profession_statements.id`, '=', filter.profession.id));
        break;

      case 'role':
        predicates.push(ComparisonPredicate.predicateWith(`${filter.actantType}_type_statements.id`, '=', filter.role.id));
        break;

      case 'sphere':
        const SPHERES = ["family", "economics", "government", "religion", "education", "communication", "celebration"];
        const sphereID = SPHERES.indexOf(filter.sphere.id) + 1;
        predicates.push(ComparisonPredicate.predicateWith('sphere_statements.id', '=', sphereID));
        break;

      case 'word':
        predicates.push(WordPredicate.predicateWithWord(filter.word));
        break;
    }
  });

  return CompoundPredicate.andPredicateWithSubpredicates(predicates);
}
