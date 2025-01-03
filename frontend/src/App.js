import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LandingPage from './Pages/LandingPage/LandingPage';
import Login from './Pages/Login/Login';
import SignUp from './Pages/SignUp/SignUp';
import Main from './Pages/Main/Main';

function App() {
  return (
    <>
    <Router>
    <Routes>
    
          <Route exact path='/' element={<LandingPage/>}/>
          <Route exact path='/login' element={<Login/>}/>
          <Route exact path='/signup' element={<SignUp/>}/>
          <Route exact path='/main' element={<Main/>}/>
        </Routes>
      
    </Router>
    </>
  );
}

export default App;
