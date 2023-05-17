import { ReactElement } from 'react';

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

type Type = {
  kind: string;
  name: string | null;
  ofType: null;
};

type Args = {
  defaultValue: null;
  description: string;
  name: string;
  type: {
    kind: string;
    name: string | null;
    ofType: Type;
  };
};

export type Field = {
  args: Args;
  deprecationReason: null;
  description: string;
  isDeprecated: boolean;
  name: string;
  type: Type;
};
