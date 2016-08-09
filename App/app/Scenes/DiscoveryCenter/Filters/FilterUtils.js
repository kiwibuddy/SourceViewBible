/* @flow */
'use strict';

export function cardWithFilter(card: Object, filter: Object) {
  const existingFilter = card.filters.find(existingFilter => existingFilter.id === filter.id);

  let filters = card.filters;
  if (!existingFilter) {
    filters = [
      ...filters,
      filter
    ];
  }

  return {
    ...card,
    filters
  };
}
