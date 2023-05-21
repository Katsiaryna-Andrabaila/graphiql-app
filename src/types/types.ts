import { ReactElement } from 'react';
import type { Client, ClientOptions, ExecutionResult } from 'graphql-ws';
import { DocumentNode, IntrospectionQuery } from 'graphql';

export type TypeUser = {
  email: string;
  token: string;
};

export type TypeAppContext = {
  isAuth: boolean;
  setIsAuth?: (value: React.SetStateAction<boolean>) => void;
  isLogin: boolean;
  setIsLogin?: (value: React.SetStateAction<boolean>) => void;
  lang: string;
  setLang?: (value: React.SetStateAction<string>) => void;
  history: Array<string>;
  setHistory?: (val: never[] | ((prevState: never[]) => never[])) => void;
  handleChangeLanguage?: () => void;
  handleClickLogout?: (cb: Function) => void;
  handleClickRegister?: (cb: Function) => void;
  handleClickLogin?: (cb: Function) => void;
};

export type TeamMember = {
  name: string;
  role: string;
  link: string;
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


export type SideMenuProps = {
  isOpenSchema: boolean; 
  showVariables: boolean;  
  variablesHandler: () => void;  
  handleClickSchema: () => void; 
  execOperation: () => Promise<void>; 
}

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
