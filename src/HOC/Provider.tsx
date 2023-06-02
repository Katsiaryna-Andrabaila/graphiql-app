import { createContext, useState, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TypeAppContext } from '../types/types';
import { useLocalStorage } from '@mantine/hooks';
import { logOut } from '../utils/firebase';
import { DEFAULT_VALUES } from '../constants/constants';

const initialContext = { isLogin: false, lang: 'en', history: [] };
export const AppContext = createContext<TypeAppContext>(initialContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { i18n } = useTranslation();
  const [lang, setLang] = useLocalStorage({
    key: 'language',
    defaultValue: 'en',
    getInitialValueInEffect: true,
  });
  const [history, setHistory] = useLocalStorage({
    key: 'history',
    defaultValue: DEFAULT_VALUES,
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const handleClickLogin = (cb: () => void) => {
    setIsLogin && setIsLogin(true);
    cb();
  };

  const handleClickRegister = (cb: () => void) => {
    setIsLogin && setIsLogin(false);
    cb();
  };

  const handleClickLogout = async (cb: () => void) => {
    await logOut();
    setIsLogin && setIsLogin(true);
    cb();
  };

  const handleChangeLanguage = () => {
    if (lang === 'en') {
      setLang && setLang('ru');
    } else {
      setLang && setLang('en');
    }
  };

  const value = {
    isLogin,
    lang,
    history,
    setHistory,
    handleChangeLanguage,
    handleClickLogout,
    handleClickRegister,
    handleClickLogin,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
