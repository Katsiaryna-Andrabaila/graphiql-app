export type TypeUser = {
  email: string;
  token: string;
};

export type TypeAppContext = {
  isAuth: boolean;
  setIsAuth: (value: React.SetStateAction<boolean>) => void;
  isLogin: boolean;
  setIsLogin: (value: React.SetStateAction<boolean>) => void;
};
