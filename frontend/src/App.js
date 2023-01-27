//import logo from './logo.svg';
//import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Connect from './components/Connect'
import Read from './components/Read'
import Create from './components/Create'
import Update from './components/Update'


import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { CommonInfoProvider } from './CommonInfoProvider'


//サイト全体のテーマを設定できる
//とりあえずデフォルトで使う
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff4454'
    }
  }
});


function App() {
  return (
    <>
      <CommonInfoProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* ヘッダー作る */}
          <Router>
            <div>
              <Routes>
                <Route path='connect' element={<Connect />} />
                <Route path='read' element={<Read />} />
                <Route path='create' element={<Create />} />
                <Route path='update' element={<Update />} />
              </Routes>
            </div>
          </Router>
          {/* フッター作る */}
        </ThemeProvider>
      </CommonInfoProvider>
    </>
  );

}



export default App;
