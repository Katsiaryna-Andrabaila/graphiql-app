import { ReactElement } from 'react';
import type { Client, ClientOptions, ExecutionResult } from 'graphql-ws';
import { DocumentNode, IntrospectionQuery } from 'graphql';

export type TypeUser = {
  email: string;
  token: string;
};

export type TypeAppContext = {
  isLogin: boolean;
  setIsLogin?: (value: React.SetStateAction<boolean>) => void;
  lang: string;
  setLang?: (value: React.SetStateAction<string>) => void;
  history: Array<{ query: string; variables: string; id: string }>;
  setHistory?: (
    val:
      | { query: string; variables: string; id: string }[]
      | ((
          prevState: { query: string; variables: string; id: string }[]
        ) => { query: string; variables: string; id: string }[])
  ) => void;
  handleChangeLanguage?: () => void;
  handleClickLogout?: (cb: Function) => void;
  handleClickRegister?: (cb: Function) => void;
  handleClickLogin?: (cb: Function) => void;
};

export type TeamMember = {
  name: string;
  role: string;
  link: string;
  src: string;
};

export interface RequireAuthProps {
  children: ReactElement<any, any>;
  redirectPath?: string;
  redirect: boolean;
}

export type MembersDataProps = {
  data: Array<TeamMember>;
};

export interface HeaderResponsiveProps {
  links: { link: string; label: string }[];
}

type Kind = 'OBJECT' | 'SCALAR' | 'ENUM' | 'INPUT_OBJECT' | 'LIST' | 'NON_NULL';

type Type = {
  kind: Kind;
  name: string | null;
  ofType: {
    kind: Kind;
    name: string | null;
    ofType: Type;
  };
};

export type Args = {
  defaultValue: null;
  description: string;
  name: string;
  type: {
    kind: Kind;
    name: string | null;
    ofType: Type;
  };
};

export type Field = {
  args: Args[];
  deprecationReason: null;
  description: string;
  isDeprecated: boolean;
  name: string;
  type: {
    kind: Kind;
    name: string | null;
    ofType: Type;
  };
};

export type QueryType = {
  description: string;
  enumValues: null;
  fields: Field[];
  inputFields: Field[] | null;
  interfaces: [] | null;
  kind: Kind;
  name: string;
  possibleTypes: null;
};

export type DocsState = {
  isQueryOpen: boolean;
  isFieldOpen: boolean;
  field: Field | null;
  header: string | Field | QueryType;
  type: QueryType | null;
  isTypeOpen: boolean;
  nestedType: QueryType | null;
  isNestedTypeOpen: boolean;
  scalarType: QueryType | null;
  fieldDetails: Field | null;
  isFieldDetailsOpen: boolean;
};

export type SideMenuProps = {
  isOpenSchema: boolean;
  showVariables: boolean;
  variablesHandler: () => void;
  handleClickSchema: () => void;
  execOperation: () => Promise<void>;
  prettify: () => void;
  handleClickHistory: () => void;
};

export type Unsubscribable = {
  unsubscribe: () => void;
};
export type Observable<T> = {
  subscribe(opts: {
    next: (value: T) => void;
    error: (error: any) => void;
    complete: () => void;
  }): Unsubscribable;
  subscribe(
    next: (value: T) => void,
    error: null | undefined,
    complete: () => void
  ): Unsubscribable;
  subscribe(
    next?: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): Unsubscribable;
};
export interface CreateFetcherOptions {
  url: string;
  subscriptionUrl?: string;
  wsClient?: Client;
  legacyWsClient?: any;
  legacyClient?: any;
  headers?: Record<string, string>;
  wsConnectionParams?: ClientOptions['connectionParams'];
  enableIncrementalDelivery?: boolean;
  fetch?: typeof fetch;
  schemaFetcher?: Fetcher;
}
export type MaybePromise<T> = T | Promise<T>;
export type SyncExecutionResult =
  | ExecutionResult
  | Observable<ExecutionResult>
  | AsyncIterable<ExecutionResult>;

export type FetcherReturnType = MaybePromise<SyncExecutionResult>;
export type Fetcher = (graphQLParams: FetcherParams, opts?: FetcherOpts) => FetcherReturnType;

export type ExecutionResultPayload =
  | {
      data: IntrospectionQuery;
      errors?: Array<any>;
    }
  | { data?: any; errors?: Array<any> }
  | { data?: any; errors?: Array<any>; hasNext: boolean }
  | {
      data?: any;
      errors?: any[];
      path: (string | number)[];
      hasNext: boolean;
    };
export type FetcherOpts = {
  headers?: { [key: string]: any };
  documentAST?: DocumentNode;
};
export type FetcherParams = {
  query: string;
  operationName?: string | null;
  variables?: any;
};
export interface HistoryObject {
  query: string;
  variables: string;
  id: string;
}
