//import logo from './logo.svg';
//import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Connect from './components/Connect';
import Read from './components/Read';
import CreateUpdate from './components/CreateUpdate';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';


import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { CommonInfoProvider } from './CommonInfoProvider';
import { LoginUsernameProvider } from './LoginUsernameProvider';
import { TitleProvider } from './TitleProvider';


//サイト全体のテーマを設定できる
//とりあえずデフォルトで使う
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      //valorantのロゴの色
      main: '#ff4454'
    }
  }
});


function App() {
  return (
    <>
    <TitleProvider>
      <LoginUsernameProvider>
        <CommonInfoProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
              <div>
                <Routes>
                  <Route path='/' element={<Header />}>
                    <Route path='login' element={<Login />} />
                    <Route path='register' element={<Register/>} />
                    <Route path='connect' element={<Connect />} />
                    <Route path='read' element={<Read />} />
                    <Route path='create' element={<CreateUpdate />} />
                    <Route path='update' element={<CreateUpdate />} />
                  </Route>
                </Routes>
              </div>
            </BrowserRouter>
          </ThemeProvider>
        </CommonInfoProvider>
      </LoginUsernameProvider>
      </TitleProvider>
    </>
  );

}



export default App;
