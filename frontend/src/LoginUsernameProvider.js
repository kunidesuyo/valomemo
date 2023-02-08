import React, { createContext, useState } from 'react'

export const LoginUsernameContext = createContext();

export const LoginUsernameProvider = ({children}) => {
  //ログイン中のユーザー名を入れる。
  //ログインしていなかったら空
  const [loginUsername, setLoginUsername] = useState("");

  return <LoginUsernameContext.Provider value={[loginUsername, setLoginUsername]}>{children}</LoginUsernameContext.Provider>;
};