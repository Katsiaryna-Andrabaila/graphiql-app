import { createContext } from 'react';
import { TypeAppContext } from '../types/types';
import { User as FirebaseUser } from 'firebase/auth';

export const AuthContext = createContext<FirebaseUser | null>(null);
export const AppContext = createContext<TypeAppContext | null>(null);
