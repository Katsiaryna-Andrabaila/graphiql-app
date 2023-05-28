import { createContext, useState, ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { endSession } from '../utils/storage';
import { TypeAppContext } from '../types/types';
import { useLocalStorage } from '@mantine/hooks';
import { getAuth, onIdTokenChanged } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app } from '../utils/firebase';

const initialContext = { isAuth: false, isLogin: false, lang: 'en', history: [] };
export const AppContext = createContext<TypeAppContext>(initialContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const auth = getAuth(app);
  const [user, loading] = useAuthState(auth);

  const [isAuth, setIsAuth] = useState(!!user);

  //useEffect(() => {
  /* onIdTokenChanged(auth, async () => {
    //const token = useRef<string | undefined>();
    const token = await user?.getIdToken(true);
    if (!token) {
      setIsAuth(false);
      //localStorage.removeItem('authToken');
    } else {
      setIsAuth(true);
      //localStorage.setItem('authToken', token);
    }
  }); */
  //}, [isAuth]);

  /* useEffect(() => {
    onIdTokenChanged(auth, async () => {
      token.current = await user?.getIdToken(true);
      if (!token.current) {
        setIsAuth(false);
      }
    });
  }, [isAuth]); */

  const [isLogin, setIsLogin] = useState(true);
  const { i18n } = useTranslation();
  const [lang, setLang] = useLocalStorage({
    key: 'language',
    defaultValue: 'en',
    getInitialValueInEffect: true,
  });
  const [history, setHistory] = useLocalStorage({
    key: 'history',
    defaultValue: [],
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const handleClickLogin = (cb: Function) => {
    setIsLogin && setIsLogin(true);
    cb();
  };

  const handleClickRegister = (cb: Function) => {
    setIsLogin && setIsLogin(false);
    cb();
  };

  const handleClickLogout = async (cb: Function) => {
    await endSession();
    setIsAuth && setIsAuth(false);
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
    isAuth,
    setIsAuth,
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
