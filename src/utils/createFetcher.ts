import { meros } from 'meros';
import { DocumentNode, visit } from 'graphql';
import {
  CreateFetcherOptions,
  ExecutionResultPayload,
  Fetcher,
  FetcherOpts,
  FetcherParams,
} from '../types/types';

export function isAsyncIterable(input: unknown): input is AsyncIterable<unknown> {
  return (
    typeof input === 'object' &&
    input !== null &&
    ((input as any)[Symbol.toStringTag] === 'AsyncGenerator' || Symbol.asyncIterator in input)
  );
}

export const isSubscriptionWithName = (
  document: DocumentNode,
  name: string | undefined
): boolean => {
  let isSubscription = false;
  visit(document, {
    OperationDefinition(node) {
      if (name === node.name?.value && node.operation === 'subscription') {
        isSubscription = true;
      }
    },
  });
  return isSubscription;
};

export const createSimpleFetcher =
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

export const createMultipartFetcher = (
  options: CreateFetcherOptions,
  httpFetch: typeof fetch
): Fetcher =>
  async function* (graphQLParams: FetcherParams, fetcherOpts?: FetcherOpts) {
    const response = await httpFetch(options.url, {
      method: 'POST',
      body: JSON.stringify(graphQLParams),
      headers: {
        'content-type': 'application/json',
        accept: 'application/json, multipart/mixed',
        ...options.headers,
        ...fetcherOpts?.headers,
      },
    }).then((r) =>
      meros<Extract<ExecutionResultPayload, { hasNext: boolean }>>(r, {
        multiple: true,
      })
    );
    if (!isAsyncIterable(response)) {
      const res: object | undefined = yield response.json();
      return res;
    }
    for await (const chunk of response) {
      if (chunk.some((part) => !part.json)) {
        const message = chunk.map((part) => `Headers::\n${part.headers}\n\nBody::\n${part.body}`);
        throw new Error(`Expected multipart chunks to be of json type. got:\n${message}`);
      }
      yield chunk.map((part) => part.body);
    }
  };

export function createFetcher(options: CreateFetcherOptions): Fetcher {
  let fetcher;
  if (typeof window !== 'undefined' && window.fetch) {
    fetcher = window.fetch;
  }
  if (options?.enableIncrementalDelivery === null || options.enableIncrementalDelivery !== false) {
    options.enableIncrementalDelivery = true;
  }
  if (options.fetch) {
    fetcher = options.fetch;
  }
  if (!fetcher) {
    throw new Error('No valid');
  }
  const simpleFetcher = createSimpleFetcher(options, fetcher);

  const httpFetcher = options.enableIncrementalDelivery
    ? createMultipartFetcher(options, fetcher)
    : simpleFetcher;

  return (graphQLParams, fetcherOpts) => {
    if (graphQLParams.operationName === 'IntrospectionQuery') {
      return (options.schemaFetcher || simpleFetcher)(graphQLParams, fetcherOpts);
    }

    return httpFetcher(graphQLParams, fetcherOpts);
  };
}
