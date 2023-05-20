import { CreateFetcherOptions, Fetcher, FetcherOpts, FetcherParams } from '../types/types';

const createMultiFetcher =
  (options: CreateFetcherOptions, httpFetch: typeof fetch): Fetcher =>
  async (graphQLParams: FetcherParams, fetcherOpts?: FetcherOpts) => {
    const data = await httpFetch(options.url, {
      method: 'POST',
      body: JSON.stringify(graphQLParams),
      headers: {
        'content-type': 'application/json',
        ...options.headers,
        ...fetcherOpts?.headers,
      },
    });
    return data.json();
  };

export function createFetcher(options: CreateFetcherOptions): Fetcher {
  let fetcher = window.fetch;
  if (options.fetch) {
    fetcher = options.fetch;
  }
  const simpleFetcher = createMultiFetcher(options, fetcher);

  return (graphQLParams, fetcherOpts) => {
    if (graphQLParams.operationName === 'IntrospectionQuery') {
      return (options.schemaFetcher || simpleFetcher)(graphQLParams, fetcherOpts);
    }

    return simpleFetcher(graphQLParams, fetcherOpts);
  };
}
