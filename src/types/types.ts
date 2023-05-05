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
};

export type TeamMember = {
  name: string;
  role: string;
  link: string;
};
