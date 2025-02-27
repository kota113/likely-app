// ScrollContext.tsx
import React, {createContext, useContext, useState} from 'react';

export type HomeScrollContextType = {
  scrollToTop: (() => void);
};

const defaultValue: HomeScrollContextType = {
  scrollToTop: () => {},
};

export const HomeScrollContext = createContext<[HomeScrollContextType, React.Dispatch<React.SetStateAction<HomeScrollContextType>>]>([
  defaultValue,
  () => {
  },
]);

export const useHomeScrollContext = () => useContext(HomeScrollContext);

export const HomeScrollProvider: React.FC<{ children: React.ReactNode; value?: HomeScrollContextType }> = (
  {
    children,
    value
  }) => {
  const state = useState<HomeScrollContextType>(value || defaultValue);
  return (
    <HomeScrollContext.Provider value={state}>
      {children}
    </HomeScrollContext.Provider>
  );
};
