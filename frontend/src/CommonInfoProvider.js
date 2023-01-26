import React, { createContext } from 'react'

import commonInfo from './common_info/common_info.json';

export const CommonInfoContext = createContext();

//const commonInfo = JSON.parse(fs.readFileSync("/usr/frontend/common_info/common_info.json"));


export const CommonInfoProvider = ({children}) => {
  return <CommonInfoContext.Provider value={commonInfo}>{children}</CommonInfoContext.Provider>;
};