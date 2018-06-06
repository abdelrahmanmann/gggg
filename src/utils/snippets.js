import { filter, includes, startsWith, trim, sortBy, flow, reverse, isEmpty, difference, size } from 'lodash/fp';

export const isTag = (filterText) => startsWith('#', filterText);

const filterByTagsText = (snippets, filterText) =>
  filter((snippet) => includes(filterText, snippet.tags), snippets);

const filterByFreeText = (snippets, filterText) => {
  const regex = new RegExp(filterText, 'gi');

  if (filterText !== '') {
    if (isTag(filterText)) {
      return filterByTagsText(snippets, filterText);
    }

    return filter((snippet) => snippet.description.match(regex), snippets);
  }

  return snippets;
};

const filterByTags = (snippets, filterTags) => {
  return filter((snippet) => size(difference(filterTags, snippet.tags)) === 0, snippets);
};

const filterByLanguage = (snippets, filterLanguage) => {
  return filter((snippet) =>
    includes(filterLanguage, snippet.languages), snippets);
};

export const filterSnippetsList = (snippets, filterText, filterTags, filterLanguage) => {
  const sortedSnippets = flow([
    sortBy(['created']),
    reverse
  ])(snippets);

  if (!isEmpty(trim(filterText))) {
    return filterByFreeText(sortedSnippets, trim(filterText));
  }

  if (!isEmpty(filterTags)) {
    return filterByTags(sortedSnippets, filterTags);
  }

  if (!isEmpty(trim(filterLanguage))) {
    return filterByLanguage(sortedSnippets, trim(filterLanguage));
  }

  return sortedSnippets;
};

export const copyToClipboard = (event, text) => {
  const handleCopy = (copyEvent) => {
    copyEvent.clipboardData.setData('text/plain', text);
    copyEvent.preventDefault();
    document.removeEventListener('copy', handleCopy, true);
  };

  document.addEventListener('copy', handleCopy.bind(this), true);
  document.execCommand('copy');
};
