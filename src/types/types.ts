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
  data: Array<TeamMember>
}
export type SideMenuProps = {
  isOpenSchema: boolean; 
  showVariables: boolean;  
  variablesHandler: () => void;  
  handleClickSchema: () => void; 
  execOperation: () => Promise<void>; 
}
