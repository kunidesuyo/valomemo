//import logo from './logo.svg';
//import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Connect from './components/Connect'
import Read from './components/Read'
import Create from './components/Create'


function App() {
  return (
    //react router dom v5で動く
    /*<Router>
      <div>
        <h1>connect-test</h1>
        <div>
          <Route exact path='/connect' component={Connect} />
        </div>
      </div>
    </Router>*/
    //react router dom v6で動かない
    <Router>
      <div>
        <Routes>
          <Route path='connect' element={<Connect />} />
          <Route path='read' element={<Read />} />
          <Route path='create' element={<Create />} />
        </Routes>
      </div>
    </Router>

  );

}



export default App;
