/* @flow */
'use strict';

export function cardWithFilter(card: Object, filter: Object) {
  const filterIndex = card.filters.findIndex(existingFilter => existingFilter.id === filter.id);

  if (filterIndex != -1) {
    card.filters.splice(filterIndex, 1, filter);
  } else {
    card.filters.push(filter);
  }

  return card;
}

export function cardWithoutFilter(card: Object, filter: Object) {
  const filterIndex = card.filters.findIndex(existingFilter => existingFilter.id === filter.id);

  if (filterIndex != -1) {
    card.filters.splice(filterIndex, 1);
  }

  return card;
}
