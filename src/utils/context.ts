import { createContext } from 'react';
import { TypeAppContext } from '../types/types';

export const AppContext = createContext<TypeAppContext | null>(null);
