export const BASE_URL = 'https://rickandmortyapi.com/graphql/';

export const availableLanguages = [
  { label: 'RU', value: 'ru' },
  { label: 'EN', value: 'en' },
];
export const DEFAULT_VALUES = {
  query: `query {
characters(page: 2, filter: { name: "rick" }) {
info {
  count
}
results {
  name
}
}
location(id: 1) {
id
}
episodesByIds(ids: [1, 2]) {
id
}
}`,
  variables: `
{

}
`,
  id: '0',
};

export const SCHEMA_ERROR = 'this demo does not support subscriptions or http multipart yet';
