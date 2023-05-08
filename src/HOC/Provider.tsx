import { createContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { endSession } from '../utils/storage';
import { TypeAppContext } from '../types/types';

const initialContext = { isAuth: false, isLogin: false, lang: 'en' };
export const AppContext = createContext<TypeAppContext>(initialContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [lang, setLang] = useState('en');
  const { i18n } = useTranslation();

  const handleClickLogin = (cb: Function) => {
    setIsLogin && setIsLogin(true);
    cb();
  };

  const handleClickRegister = (cb: Function) => {
    setIsLogin && setIsLogin(false);
    cb();
  };

  const handleClickLogout = (cb: Function) => {
    endSession();
    setIsAuth && setIsAuth(false);
    setIsLogin && setIsLogin(true);
    cb();
  };

  const handleChangeLanguage = () => {
    if (lang === 'en') {
      setLang && setLang('ru');
      i18n.changeLanguage('ru');
    } else {
      setLang && setLang('en');
      i18n.changeLanguage('en');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      setIsAuth(true);
    }
  }, []);

  const value = {
    isAuth,
    setIsAuth,
    isLogin,
    lang,
    handleChangeLanguage,
    handleClickLogout,
    handleClickRegister,
    handleClickLogin,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
