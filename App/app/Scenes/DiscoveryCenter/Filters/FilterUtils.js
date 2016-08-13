/* @flow */
'use strict';

import { Chronology, ComparisonPredicate, CompoundPredicate, WordPredicate } from '../../../Database';

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
        predicates.push(ComparisonPredicate.predicateWith(`${filter.actantType}.id`, '=', filter.actant.id));
        break;

      case 'actant-number':
        predicates.push(ComparisonPredicate.predicateWith(`${filter.actantType}.actant_number`, '=', filter.actantNumber.id));
        break;

      case 'book':
        predicates.push(ComparisonPredicate.predicateWith('sources.first', '>=', filter.book.firstMonad));
        predicates.push(ComparisonPredicate.predicateWith('sources.last', '<=', filter.book.lastMonad));
        break;

      case 'book-range':
        predicates.push(ComparisonPredicate.predicateWith('sources.first', '>=', filter.books.from.firstMonad));
        predicates.push(ComparisonPredicate.predicateWith('sources.last', '<=', filter.books.to.lastMonad));
        break;

      case 'chronology':
        predicates.push(ComparisonPredicate.predicateWith('chronologies.chronology_id', '=', filter.chronology.id));
        break;

      case 'chronology-range':
        const chronologies = Chronology.whereInRange(filter.chronologies.from, filter.chronologies.to).map(chronology => chronology.id);
        predicates.push(ComparisonPredicate.predicateWith('chronologies.chronology_id', 'IN', chronologies));
        break;

      case 'gender':
        predicates.push(ComparisonPredicate.predicateWith(`${filter.actantType}.gender_id`, '=', filter.gender.id));
        break;

      case 'nature':
        predicates.push(ComparisonPredicate.predicateWith(`${filter.actantType}_natures.nature_id`, '=', filter.nature.id));
        break;

      case 'profession':
        predicates.push(ComparisonPredicate.predicateWith(`${filter.actantType}_professions.profession_id`, '=', filter.profession.id));
        break;

      case 'role':
        predicates.push(ComparisonPredicate.predicateWith(`sources.role_id`, '=', filter.role.id));
        break;

      case 'sphere':
        const SPHERES = ["family", "economics", "government", "religion", "education", "communication", "celebration"];
        const sphereID = SPHERES.indexOf(filter.sphere.id) + 1;
        predicates.push(ComparisonPredicate.predicateWith('spheres.sphere_id', '=', sphereID));
        break;

      case 'word':
        predicates.push(WordPredicate.predicateWithWord(filter.word));
        break;
    }
  });

  return CompoundPredicate.andPredicateWithSubpredicates(predicates);
}
