import { notifications } from '@mantine/notifications';
import { CreateFetcherOptions, Fetcher, FetcherOpts, FetcherParams } from '../types/types';
import { IconExclamationMark } from '@tabler/icons-react';

const createMultiFetcher =
  (options: CreateFetcherOptions, httpFetch: typeof fetch): Fetcher =>
  async (graphQLParams: FetcherParams, fetcherOpts?: FetcherOpts) => {
    try {
      notifications.clean();
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
    } catch (e) {
      notifications.show({
        id: 'api-error',
        loading: false,
        message: `${e}`,
        color: 'red',
        icon: <IconExclamationMark size="3rem" color="black" />,
        autoClose: false,
        style: { backgroundColor: '#fa5252' },
      });
    }
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
