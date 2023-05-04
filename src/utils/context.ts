import { createContext } from 'react';
import { TypeAppContext } from '../types/types';
import { User as FirebaseUser } from 'firebase/auth';

const initialContext = { isAuth: false, isLogin: false };

export const AuthContext = createContext<FirebaseUser | null>(null);
export const AppContext = createContext<TypeAppContext>(initialContext);
