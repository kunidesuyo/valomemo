import React, { createContext, useState } from 'react'

export const IsLoginContext = createContext();

export const IsLoginProvider = ({children}) => {
  const [isLogin, setIsLogin] = useState(false);

  return <IsLoginContext.Provider value={[isLogin, setIsLogin]}>{children}</IsLoginContext.Provider>;
};